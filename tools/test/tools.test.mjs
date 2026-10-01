// Tests for the CLI entry points, the catalogue generator, the DCO check,
// the eval runner's offline pieces, and the seed skills' bundled scripts.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpRepo, makeSkill } from './helpers.mjs';
import { renderCatalogue, renderMarketplace, applyCatalogue, readSkills } from '../catalogue.mjs';
import { checkCommit, commitsInRange } from '../dco-check.mjs';
import { extractJson, Budget, scoreTriggers } from '../run-evals.mjs';

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

test('evals: no API key means a clean skip, not a failure', () => {
  const env = { ...process.env };
  delete env.ANTHROPIC_API_KEY;
  const r = node(['tools/run-evals.mjs', 'caption-styling'], { env });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /skipped/);
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
