// Tests for the CLI entry points, the catalogue generator, the DCO check,
// the eval runner's offline pieces, and the seed skills' bundled scripts.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpRepo, makeSkill, makeVidmoatSkill } from './helpers.mjs';
import { renderCatalogue, renderMarketplace, applyCatalogue, readSkills } from '../catalogue.mjs';
import { checkCommit, commitsInRange } from '../dco-check.mjs';
import { extractJson, Budget, scoreTriggers, selectProvider, buildRequest, parseResponse, createClient, runSkill, loadSkill, PROVIDERS } from '../run-evals.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const node = (args, opts = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', cwd: REPO, ...opts });

function hasCmd(cmd, args = ['--version']) {
  try { return spawnSync(cmd, args, { encoding: 'utf8' }).status === 0; } catch { return false; }
}
const PY = ['python3', 'python'].find((c) => hasCmd(c));

// ---- lint CLI ---------------------------------------------------------------

test('lint CLI exits 0 on a clean repo and 1 on errors', () => {
  const root = tmpRepo();
  const dir = makeSkill(root, 'core', 'widget-check');
  let r = node(['tools/lint-skills.mjs', '--root', root]);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  fs.appendFileSync(path.join(dir, 'SKILL.md'), '\n<!-- hidden -->\n');
  r = node(['tools/lint-skills.mjs', '--root', root]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /SK016/);
});

test('lint CLI reads labels from flag and environment', () => {
  const root = tmpRepo();
  makeSkill(root, 'community', 'widget-check', { extra: 'allowed-tools: Read' });
  assert.equal(node(['tools/lint-skills.mjs', '--root', root]).status, 1);
  assert.equal(node(['tools/lint-skills.mjs', '--root', root, '--labels', 'allowed-tools-approved']).status, 0);
  const env = { ...process.env, SKILLS_LINT_LABELS: 'triage,allowed-tools-approved' };
  assert.equal(node(['tools/lint-skills.mjs', '--root', root], { env }).status, 0);
});

test('lint CLI --json and --strict', () => {
  const root = tmpRepo();
  makeSkill(root, 'core', 'widget-check', { extra: 'allowed-tools: Read' });
  const r = node(['tools/lint-skills.mjs', '--root', root, '--json']);
  const out = JSON.parse(r.stdout);
  assert.equal(out.skills[0].name, 'widget-check');
  assert.equal(r.status, 0, 'a warning alone does not fail');
  assert.equal(node(['tools/lint-skills.mjs', '--root', root, '--strict']).status, 1);
});

test('lint CLI rejects an unknown skill name', () => {
  const r = node(['tools/lint-skills.mjs', 'no-such-skill']);
  assert.equal(r.status, 1);
});

// ---- catalogue --------------------------------------------------------------

test('catalogue renders a table per tier and a marketplace with only non-empty plugins', () => {
  const root = tmpRepo();
  makeSkill(root, 'core', 'widget-check');
  const skills = readSkills(root);
  const md = renderCatalogue(skills);
  assert.match(md, /\[`widget-check`\]\(skills\/core\/widget-check\/SKILL\.md\) \| 1\.0\.0 \| Checks widget timing and placement for exported clips\. \|/);
  assert.match(md, /No community skills yet/);
  const mp = JSON.parse(renderMarketplace(skills));
  assert.equal(mp.name, 'vidmoat-skills');
  assert.deepEqual(mp.plugins.map((p) => p.name), ['vidmoat-core']);
  assert.deepEqual(mp.plugins[0].skills, ['./skills/core/widget-check']);
  assert.equal(mp.plugins[0].strict, false);
});

test('catalogue lists the vidmoat tier as its own table and plugin', () => {
  const root = tmpRepo();
  makeSkill(root, 'core', 'widget-check');
  makeVidmoatSkill(root, 'vidmoat-widgets');
  const skills = readSkills(root);
  assert.deepEqual(skills.map((s) => s.tier), ['core', 'vidmoat']);
  const md = renderCatalogue(skills);
  assert.match(md, /\*\*Vidmoat \(official: the skills the Vidmoat editor loads\)\*\*/);
  assert.match(md, /\[`vidmoat-widgets`\]\(skills\/vidmoat\/vidmoat-widgets\/SKILL\.md\)/);
  const mp = JSON.parse(renderMarketplace(skills));
  assert.deepEqual(mp.plugins.map((p) => p.name), ['vidmoat-core', 'vidmoat-editor']);
  assert.deepEqual(mp.plugins[1].skills, ['./skills/vidmoat/vidmoat-widgets']);
});

test('catalogue replaces only the marked region and requires markers', () => {
  const out = applyCatalogue('intro\n<!-- catalogue:start -->\nold\n<!-- catalogue:end -->\noutro\n', []);
  assert.match(out, /^intro\n<!-- catalogue:start -->/);
  assert.match(out, /<!-- catalogue:end -->\noutro\n$/);
  assert.doesNotMatch(out, /\nold\n/);
  assert.throws(() => applyCatalogue('no markers', []));
});

test('catalogue --check passes on the committed repository', () => {
  const r = node(['tools/catalogue.mjs', '--check']);
  assert.equal(r.status, 0, r.stderr);
});

test('marketplace names avoid reserved words', () => {
  const mp = JSON.parse(fs.readFileSync(path.join(REPO, '.claude-plugin', 'marketplace.json'), 'utf8'));
  for (const n of [mp.name, ...mp.plugins.map((p) => p.name)]) {
    assert.doesNotMatch(n, /claude|anthropic/i);
    assert.match(n, /^[a-z0-9][a-z0-9._-]*$/);
  }
});

// ---- DCO --------------------------------------------------------------------

test('DCO: sign-off must match the author email', () => {
  const base = { sha: 'a'.repeat(40), parents: ['p'], authorName: 'Ada', authorEmail: 'ada@example.com' };
  assert.equal(checkCommit({ ...base, body: 'Fix\n\nSigned-off-by: Ada <ada@example.com>\n' }).ok, true);
  assert.equal(checkCommit({ ...base, body: 'Fix\n\nSigned-off-by: Ada <ADA@example.com>\n' }).ok, true);
  assert.equal(checkCommit({ ...base, body: 'Fix\n' }).ok, false);
  assert.equal(checkCommit({ ...base, body: 'Fix\n\nSigned-off-by: Bob <bob@example.com>\n' }).ok, false);
  assert.equal(checkCommit({ ...base, parents: ['p', 'q'], body: 'Merge' }).ok, true);
});

test('DCO: reads a real git range', (t) => {
  if (!hasCmd('git')) { t.skip('git not available'); return; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dco-'));
  const git = (...a) => execFileSync('git', a, { cwd: dir, encoding: 'utf8' });
  git('init', '-q');
  git('config', 'user.name', 'Ada');
  git('config', 'user.email', 'ada@example.com');
  git('config', 'commit.gpgsign', 'false');
  fs.writeFileSync(path.join(dir, 'a'), '1');
  git('add', 'a'); git('commit', '-q', '-m', 'base');
  fs.writeFileSync(path.join(dir, 'a'), '2');
  git('commit', '-q', '-am', 'signed', '-s');
  fs.writeFileSync(path.join(dir, 'a'), '3');
  git('commit', '-q', '-am', 'unsigned');
  const commits = commitsInRange('HEAD~2', 'HEAD', dir);
  assert.equal(commits.length, 2);
  const results = commits.map(checkCommit);
  assert.deepEqual(results.map((r) => r.ok).sort(), [false, true]);
});

// ---- eval runner (offline parts) -------------------------------------------

test('evals: JSON extraction, budget and scoring', () => {
  assert.deepEqual(extractJson('Sure.\n{"load": ["a"]}\nDone'), { load: ['a'] });
  assert.throws(() => extractJson('no json'));
  const b = new Budget({ maxCalls: 2, maxUsd: 1, priceIn: 4, priceOut: 20 });
  b.record({ input_tokens: 1_000_000, output_tokens: 0 });
  assert.equal(b.usd, 4);
  assert.equal(b.canSpend(), false, 'over the dollar cap');
  const c = new Budget({ maxCalls: 1, maxUsd: 100, priceIn: 1, priceOut: 1 });
  c.record({});
  assert.equal(c.canSpend(), false, 'over the call cap');
  assert.deepEqual(scoreTriggers([{ passed: true }, { passed: false }]), { total: 2, correct: 1, accuracy: 0.5 });
});

function noKeysEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  for (const k of ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'EVAL_PROVIDER', 'EVAL_MODEL', 'EVAL_PRICE_IN', 'EVAL_PRICE_OUT']) if (!(k in extra)) delete env[k];
  return env;
}

test('evals: no API key means a clean skip, not a failure', () => {
  const r = node(['tools/run-evals.mjs', 'caption-styling'], { env: noKeysEnv() });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /skipped: no OPENAI_API_KEY or ANTHROPIC_API_KEY/);
});

test('evals: a forced provider without its key skips and names the missing key, never a value', () => {
  const r = node(['tools/run-evals.mjs', 'caption-styling'], { env: noKeysEnv({ EVAL_PROVIDER: 'openai', ANTHROPIC_API_KEY: 'sk-ant-test-not-real' }) });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /skipped: EVAL_PROVIDER=openai but no OPENAI_API_KEY/);
  assert.doesNotMatch(r.stdout + r.stderr, /sk-ant-test-not-real/);
});

test('evals: dry run with a key reports the provider and model, not the key', () => {
  const r = node(['tools/run-evals.mjs', '--dry-run'], { env: noKeysEnv({ OPENAI_API_KEY: 'sk-test-not-real' }) });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /Provider: openai, model gpt-5\.1/);
  assert.doesNotMatch(r.stdout + r.stderr, /sk-test-not-real/);
});

test('evals: a bad EVAL_PROVIDER fails loudly', () => {
  const r = node(['tools/run-evals.mjs', 'caption-styling'], { env: noKeysEnv({ EVAL_PROVIDER: 'gemini', OPENAI_API_KEY: 'x' }) });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /EVAL_PROVIDER must be/);
});

test('evals: provider selection', () => {
  assert.deepEqual(selectProvider({}), { skip: 'no OPENAI_API_KEY or ANTHROPIC_API_KEY' });
  assert.equal(selectProvider({ OPENAI_API_KEY: 'o' }).provider, 'openai');
  assert.equal(selectProvider({ ANTHROPIC_API_KEY: 'a' }).provider, 'anthropic');
  assert.equal(selectProvider({ OPENAI_API_KEY: 'o', ANTHROPIC_API_KEY: 'a' }).provider, 'openai', 'OpenAI first when both are set');
  assert.equal(selectProvider({ OPENAI_API_KEY: 'o', ANTHROPIC_API_KEY: 'a', EVAL_PROVIDER: 'anthropic' }).provider, 'anthropic');
  assert.equal(selectProvider({ OPENAI_API_KEY: 'o', ANTHROPIC_API_KEY: 'a', EVAL_PROVIDER: ' OpenAI ' }).provider, 'openai');
  assert.equal(selectProvider({ OPENAI_API_KEY: '   ', ANTHROPIC_API_KEY: 'a' }).provider, 'anthropic', 'a blank key (an unset secret) is no key');
  assert.match(selectProvider({ ANTHROPIC_API_KEY: 'a', EVAL_PROVIDER: 'openai' }).skip, /no OPENAI_API_KEY/);
  assert.throws(() => selectProvider({ OPENAI_API_KEY: 'o', EVAL_PROVIDER: 'gemini' }), /EVAL_PROVIDER must be/);

  const o = selectProvider({ OPENAI_API_KEY: 'o' });
  assert.equal(o.model, PROVIDERS.openai.defaultModel);
  assert.deepEqual([o.priceIn, o.priceOut], [PROVIDERS.openai.priceIn, PROVIDERS.openai.priceOut]);
  const a = selectProvider({ ANTHROPIC_API_KEY: 'a', EVAL_MODEL: '', EVAL_PRICE_IN: '', EVAL_PRICE_OUT: '' });
  assert.equal(a.model, 'claude-opus-5-5', 'an empty repository variable means the default');
  assert.deepEqual([a.priceIn, a.priceOut], [4, 20]);
  const custom = selectProvider({ OPENAI_API_KEY: 'o', EVAL_MODEL: 'gpt-5-mini', EVAL_PRICE_IN: '0.25', EVAL_PRICE_OUT: '2' });
  assert.deepEqual([custom.model, custom.priceIn, custom.priceOut], ['gpt-5-mini', 0.25, 2]);
  assert.throws(() => selectProvider({ OPENAI_API_KEY: 'o', EVAL_MODEL: 'claude-opus-5-5' }), /anthropic model but the provider is openai/);
  assert.throws(() => selectProvider({ ANTHROPIC_API_KEY: 'a', EVAL_MODEL: 'gpt-5.1' }), /openai model but the provider is anthropic/);
});

test('evals: request and response shapes per provider', () => {
  const args = { key: 'k', system: 'SYS', user: 'USER', maxTokens: 123, effort: 'low', env: {} };
  const o = buildRequest({ ...args, provider: 'openai', model: 'gpt-5.1' });
  assert.equal(o.url, 'https://api.openai.com/v1/responses');
  assert.equal(o.headers.authorization, 'Bearer k');
  assert.deepEqual(o.body, { model: 'gpt-5.1', instructions: 'SYS', input: 'USER', max_output_tokens: 123, store: false, reasoning: { effort: 'low' } });
  assert.equal(buildRequest({ ...args, provider: 'openai', model: 'gpt-4.1' }).body.reasoning, undefined, 'no reasoning field for a non-reasoning model');
  const a = buildRequest({ ...args, provider: 'anthropic', model: 'claude-opus-5-5' });
  assert.equal(a.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(a.headers['x-api-key'], 'k');
  assert.deepEqual(a.body.messages, [{ role: 'user', content: 'USER' }]);
  assert.equal(a.body.system, 'SYS');
  assert.deepEqual(a.body.output_config, { effort: 'low' });

  const oj = { status: 'completed', output: [{ type: 'reasoning', summary: [] }, { type: 'message', content: [{ type: 'output_text', text: 'hello' }] }], usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15 } };
  assert.deepEqual(parseResponse('openai', oj), { text: 'hello', usage: { input_tokens: 10, output_tokens: 5 } });
  assert.throws(() => parseResponse('openai', { output: [{ type: 'message', content: [{ type: 'refusal', refusal: 'no' }] }] }), /refused/);
  assert.throws(() => parseResponse('openai', { status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' }, output: [] }), /max_output_tokens/);
  assert.equal(parseResponse('anthropic', { content: [{ type: 'text', text: 'hi' }], usage: { input_tokens: 1, output_tokens: 1 } }).text, 'hi');
  assert.throws(() => parseResponse('anthropic', { stop_reason: 'refusal', content: [] }), /refused/);
});

/** A fake fetch that answers like the given provider, from a function of the request. */
function fakeFetch(provider, answer, calls = []) {
  return async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ url, body });
    const system = provider === 'openai' ? body.instructions : body.system;
    const user = provider === 'openai' ? body.input : body.messages[0].content;
    const text = answer(system, user);
    const json = provider === 'openai'
      ? { status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text }] }], usage: { input_tokens: 100, output_tokens: 10 } }
      : { stop_reason: 'end_turn', content: [{ type: 'text', text }], usage: { input_tokens: 100, output_tokens: 10 } };
    return { ok: true, status: 200, headers: { get: () => null }, json: async () => json };
  };
}

test('evals: the client retries a 429 without real waiting', async () => {
  let n = 0;
  const waits = [];
  const fetchImpl = async () => {
    n++;
    if (n === 1) return { ok: false, status: 429, headers: { get: () => '1' }, json: async () => ({}) };
    return { ok: true, status: 200, headers: { get: () => null }, json: async () => ({ output: [{ type: 'message', content: [{ type: 'output_text', text: 'ok' }] }], usage: { input_tokens: 1, output_tokens: 1 } }) };
  };
  const client = createClient({ provider: 'openai', key: 'k', model: 'gpt-5.1', fetchImpl, sleep: async (ms) => { waits.push(ms); } });
  const budget = new Budget({ maxCalls: 5, maxUsd: 5, priceIn: 1, priceOut: 1 });
  assert.equal(await client.complete({ system: 's', user: 'u', maxTokens: 10, effort: 'low', budget }), 'ok');
  assert.deepEqual(waits, [1000]);
  assert.equal(budget.calls, 1, 'only the successful call is billed');
});

test('evals: grading is identical across providers (same answers, same report)', async () => {
  const skill = { ...loadSkill(path.join(REPO, 'skills', 'core', 'caption-styling')), tier: 'core' };
  skill.evals = { ...skill.evals, trigger_cases: skill.evals.trigger_cases.slice(0, 3), evals: skill.evals.evals.slice(0, 1) };
  const nAssert = skill.evals.evals[0].assertions.length;
  // A deterministic "model": loads the skill only for the first trigger case,
  // and a grader that passes every assertion only for the with-skill answer.
  const answer = (system, user) => {
    if (system.startsWith('You are a coding and media agent')) return JSON.stringify({ load: user === skill.evals.trigger_cases[0].query ? ['caption-styling'] : [] });
    if (system.startsWith('You grade')) {
      const withSkill = user.includes('ANSWER-SKILLED');
      return JSON.stringify({ results: Array.from({ length: nAssert }, (_, i) => ({ text: String(i), passed: withSkill, evidence: 'x' })) });
    }
    return system.includes('<skill>') ? 'ANSWER-SKILLED' : 'ANSWER-BASELINE';
  };
  const reports = {};
  for (const provider of ['openai', 'anthropic']) {
    const calls = [];
    const client = createClient({ provider, key: 'k', model: PROVIDERS[provider].defaultModel, fetchImpl: fakeFetch(provider, answer, calls), env: {} });
    const budget = new Budget({ maxCalls: 50, maxUsd: 50, priceIn: 1, priceOut: 1 });
    reports[provider] = await runSkill(skill, [skill], { client, budget, triggerRuns: 1 });
    assert.equal(calls.length, 3 + 4, `${provider}: 3 trigger calls + 4 per output case`);
    assert.ok(calls.every((c) => c.url === (provider === 'openai' ? 'https://api.openai.com/v1/responses' : 'https://api.anthropic.com/v1/messages')));
  }
  assert.deepEqual(reports.openai, reports.anthropic);
  assert.deepEqual(reports.openai.errors, []);
  assert.equal(reports.openai.outputs[0].delta, 1);
  const t = reports.openai.triggers;
  assert.equal(t[0].rate, 1);
  assert.deepEqual(t.map((x) => x.passed), t.map((x, i) => (i === 0 ? x.should_trigger : !x.should_trigger)));
});

test('evals: dry run plans calls for every seed skill', () => {
  const r = node(['tools/run-evals.mjs', '--dry-run']);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /audio-ducking/);
  assert.match(r.stdout, /caption-styling/);
});

// ---- seed skill scripts -----------------------------------------------------

test('check_captions.py flags every planted problem in the eval fixture', (t) => {
  if (!PY) { t.skip('python not available'); return; }
  const dir = path.join(REPO, 'skills', 'core', 'caption-styling');
  const r = spawnSync(PY, ['scripts/check_captions.py', 'evals/files/podcast-clip.srt', '--json'], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 1);
  const report = JSON.parse(r.stdout);
  const seen = new Set(report.findings.map((f) => `${f.cue}:${f.rule}`));
  for (const k of ['1:line-length', '1:reading-speed', '2:too-short', '3:lines', '3:overlap', '4:too-long']) assert.ok(seen.has(k), k);
});

test('check_captions.py passes a clean file and handles VTT', (t) => {
  if (!PY) { t.skip('python not available'); return; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cap-'));
  const vtt = path.join(dir, 'ok.vtt');
  fs.writeFileSync(vtt, 'WEBVTT\n\n00:00.000 --> 00:02.000\n<v Ada>Hello there,\nwelcome back.\n\n00:02.000 --> 00:04.500\n[door slams]\n');
  const script = path.join(REPO, 'skills', 'core', 'caption-styling', 'scripts', 'check_captions.py');
  const r = spawnSync(PY, [script, vtt], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('duck_envelope.py merges close phrases and emits keyframes', (t) => {
  if (!PY) { t.skip('python not available'); return; }
  const dir = path.join(REPO, 'skills', 'core', 'audio-ducking');
  const r = spawnSync(PY, ['scripts/duck_envelope.py', 'evals/files/narration-segments.json', '--format', 'json'], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const out = JSON.parse(r.stdout);
  assert.deepEqual(out.regions, [[2.1, 9.4], [14.0, 17.3]]);
  assert.deepEqual(out.keyframes[0], [1.95, 0]);
  assert.deepEqual(out.keyframes[1], [2.1, -10]);
});

test('duck_envelope.py filter really ducks the music by the requested depth', (t) => {
  if (!PY) { t.skip('python not available'); return; }
  if (!hasCmd('ffmpeg', ['-version'])) { t.skip('ffmpeg not available'); return; }
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'duck-'));
  const regions = path.join(work, 'r.json');
  fs.writeFileSync(regions, JSON.stringify([[1, 3], [3.5, 5]]));
  const script = path.join(REPO, 'skills', 'core', 'audio-ducking', 'scripts', 'duck_envelope.py');
  const filter = spawnSync(PY, [script, regions, '--depth-db', '10'], { encoding: 'utf8' }).stdout.trim();
  const out = path.join(work, 'out.wav');
  const ff = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'sine=f=1000:d=7:sample_rate=48000', '-af', filter, out], { encoding: 'utf8' });
  assert.equal(ff.status, 0, ff.stderr);
  const level = (ss, dur) => {
    const r = spawnSync('ffmpeg', ['-hide_banner', '-ss', String(ss), '-t', String(dur), '-i', out, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
    return Number(/mean_volume: (-?[\d.]+) dB/.exec(r.stderr)[1]);
  };
  const full = level(0.1, 0.6);
  const pause = level(3.1, 0.3);
  const after = level(6.0, 0.8);
  assert.ok(Math.abs(full - pause - 10) < 0.3, `ducked ${full - pause} dB in the pause between phrases`);
  assert.ok(Math.abs(full - after) < 0.3, 'returns to full level');
});
