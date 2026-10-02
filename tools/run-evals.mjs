#!/usr/bin/env node
// Run a skill's evals/evals.json against a model: trigger cases (does the
// description make an agent load the skill, and stay away on near misses?)
// and output cases (does the answer pass its assertions WITH the skill, and by
// how much more than WITHOUT it?).
//
//   node tools/run-evals.mjs                       # every skill
//   node tools/run-evals.mjs caption-styling       # named skills
//   node tools/run-evals.mjs --changed origin/main # skills touched since a ref
//   node tools/run-evals.mjs --dry-run             # plan and call count, no network
//
// Provider: OpenAI (Responses API) when OPENAI_API_KEY is set, otherwise
// Anthropic (Messages API) when ANTHROPIC_API_KEY is set. EVAL_PROVIDER=openai
// or EVAL_PROVIDER=anthropic forces one. The prompts, the trigger rule and the
// grading are the same for both; only the HTTP call differs.
//
// No key, no run: without a key for the chosen provider it prints "skipped"
// and exits 0, which is what happens on fork pull requests where secrets are
// withheld. Key values are never printed.
//
// Cost controls (env):
//   EVAL_PROVIDER     openai | anthropic (default: whichever key is present, OpenAI first)
//   EVAL_MODEL        model id (default gpt-5.1 for OpenAI, claude-opus-5-5 for Anthropic)
//   EVAL_MAX_CALLS    hard ceiling on API calls per run (default 150)
//   EVAL_MAX_USD      stop once estimated spend passes this (default 3)
//   EVAL_PRICE_IN     $ per million input tokens  (default: the default model's list price)
//   EVAL_PRICE_OUT    $ per million output tokens (default: the default model's list price)
//   EVAL_TRIGGER_RUNS runs per trigger query (default 1; 3 is better locally)
//   EVAL_MIN_TRIGGER_ACCURACY  fail below this trigger accuracy (default 0.7)
//   EVAL_FALLBACKS    "0" disables Anthropic server-side refusal fallbacks
// This file is CI tooling, not a skill script: the no-network rule applies to
// skills/*/scripts only.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { splitFrontmatter, parseFrontmatter } from './lib/frontmatter.mjs';
import { TIERS } from './lib/rules.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const OPENAI_URL = 'https://api.openai.com/v1/responses';
const FALLBACK_MODELS = new Set(['claude-opus-5-5', 'claude-opus-5', 'claude-fable-5-1', 'claude-sonnet-5-5']);

// Defaults per provider. Prices are dollars per million tokens for the default
// model, used only for the spend estimate; set EVAL_PRICE_IN/OUT with EVAL_MODEL.
export const PROVIDERS = {
  openai: { keyEnv: 'OPENAI_API_KEY', defaultModel: 'gpt-5.1', priceIn: 1.25, priceOut: 10, family: /^(gpt-|o\d|chatgpt-)/i },
  anthropic: { keyEnv: 'ANTHROPIC_API_KEY', defaultModel: 'claude-opus-5-5', priceIn: 4, priceOut: 20, family: /^claude-/i },
};

const envNum = (v, fallback) => (v === undefined || v === null || String(v).trim() === '' ? fallback : Number(v));

/**
 * Choose the provider from the environment. Returns { provider, key, model,
 * priceIn, priceOut } or { skip } with the reason. Throws on a bad
 * EVAL_PROVIDER or an EVAL_MODEL that belongs to the other provider.
 */
export function selectProvider(env = process.env) {
  const forced = String(env.EVAL_PROVIDER ?? '').trim().toLowerCase();
  if (forced && !PROVIDERS[forced]) throw new Error(`EVAL_PROVIDER must be "openai" or "anthropic" (got "${forced}").`);
  const has = (p) => typeof env[PROVIDERS[p].keyEnv] === 'string' && env[PROVIDERS[p].keyEnv].trim() !== '';
  let provider = forced || (has('openai') ? 'openai' : has('anthropic') ? 'anthropic' : '');
  if (!provider) return { skip: 'no OPENAI_API_KEY or ANTHROPIC_API_KEY' };
  const cfg = PROVIDERS[provider];
  if (!has(provider)) return { skip: `EVAL_PROVIDER=${provider} but no ${cfg.keyEnv}` };
  const model = String(env.EVAL_MODEL ?? '').trim() || cfg.defaultModel;
  for (const [other, o] of Object.entries(PROVIDERS)) {
    if (other !== provider && o.family.test(model) && !cfg.family.test(model)) {
      throw new Error(`EVAL_MODEL "${model}" is an ${other} model but the provider is ${provider}. Unset EVAL_MODEL, or set EVAL_PROVIDER=${other}.`);
    }
  }
  return {
    provider,
    key: env[cfg.keyEnv].trim(),
    model,
    priceIn: envNum(env.EVAL_PRICE_IN, cfg.priceIn),
    priceOut: envNum(env.EVAL_PRICE_OUT, cfg.priceOut),
  };
}

/** The HTTP request for one completion, per provider. Same inputs for both. */
export function buildRequest({ provider, key, model, system, user, maxTokens, effort, env = process.env }) {
  if (provider === 'anthropic') {
    const body = { model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }], output_config: { effort } };
    const headers = { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' };
    if (FALLBACK_MODELS.has(model) && env.EVAL_FALLBACKS !== '0') {
      body.fallbacks = 'default';
      headers['anthropic-beta'] = 'server-side-fallback-2026-07-01';
    }
    return { url: ANTHROPIC_URL, headers, body };
  }
  if (provider === 'openai') {
    const body = { model, instructions: system, input: user, max_output_tokens: maxTokens, store: false };
    // Reasoning models take an effort; the same low/medium the Anthropic call uses.
    if (/^(gpt-5|o\d)/i.test(model)) body.reasoning = { effort };
    const headers = { authorization: `Bearer ${key}`, 'content-type': 'application/json' };
    return { url: OPENAI_URL, headers, body };
  }
  throw new Error(`unknown provider ${provider}`);
}

/** Text and usage from a successful response, per provider. Throws on a refusal. */
export function parseResponse(provider, json) {
  if (provider === 'anthropic') {
    if (json.stop_reason === 'refusal') throw new Error(`model refused (${json.stop_details?.category ?? 'unknown'})`);
    return { text: (json.content ?? []).filter((b) => b.type === 'text').map((b) => b.text).join('\n'), usage: json.usage ?? {} };
  }
  const parts = [];
  let refusal = null;
  for (const item of json.output ?? []) {
    if (item.type !== 'message') continue;
    for (const c of item.content ?? []) {
      if (c.type === 'output_text') parts.push(c.text);
      else if (c.type === 'refusal') refusal = c.refusal ?? 'refused';
    }
  }
  if (!parts.length && refusal) throw new Error(`model refused (${String(refusal).slice(0, 80)})`);
  if (!parts.length && json.status === 'incomplete') throw new Error(`response incomplete (${json.incomplete_details?.reason ?? 'unknown'})`);
  return { text: parts.join('\n'), usage: { input_tokens: json.usage?.input_tokens ?? 0, output_tokens: json.usage?.output_tokens ?? 0 } };
}

/**
 * A client with one method, complete(), that every eval step calls. fetchImpl
 * and sleep are injectable so tests run with no network.
 */
export function createClient({ provider, key, model, fetchImpl = globalThis.fetch, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), env = process.env }) {
  return {
    provider,
    model,
    async complete({ system, user, maxTokens, effort, budget }) {
      if (!budget.canSpend()) throw Object.assign(new Error('budget exhausted'), { budget: true });
      const req = buildRequest({ provider, key, model, system, user, maxTokens, effort, env });
      let lastErr;
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await fetchImpl(req.url, { method: 'POST', headers: req.headers, body: JSON.stringify(req.body) });
        if (res.status === 429 || res.status >= 500) {
          lastErr = new Error(`HTTP ${res.status}`);
          const wait = Number(res.headers?.get?.('retry-after') ?? 2 ** attempt * 2);
          await sleep(Math.min(wait, 30) * 1000);
          continue;
        }
        const json = await res.json();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${json?.error?.message ?? 'request failed'}`);
        const { text, usage } = parseResponse(provider, json);
        budget.record(usage);
        return text;
      }
      throw lastErr;
    },
  };
}

// Realistic neighbours so a trigger case has something to choose between.
export const DECOY_SKILLS = [
  { name: 'video-transcode', description: 'Convert video between containers and codecs, change resolution or bitrate, and make web or social delivery files with ffmpeg. Use when the user wants to re-encode, compress or change the format of a video.' },
  { name: 'transcription', description: 'Transcribe speech in audio or video to text with timestamps, and translate transcripts. Use when the user needs a transcript, speaker turns or text of what was said.' },
  { name: 'colour-grading', description: 'Correct and grade colour in video: white balance, exposure, contrast, LUTs, shot matching. Use when footage looks flat, too warm or cold, or cameras do not match.' },
  { name: 'music-composition', description: 'Write or generate original music, chord progressions and arrangements. Use when the user wants a new song, score or jingle composed.' },
  { name: 'podcast-show-notes', description: 'Write episode titles, summaries, chapters and show notes from a podcast transcript. Use when the user wants publishing copy for an audio episode.' },
  { name: 'motion-titles', description: 'Design animated titles, lower thirds and logo stings with timing and easing. Use when the user wants on-screen text or graphics that move.' },
  { name: 'pdf-processing', description: 'Extract text and tables from PDFs, fill forms and merge files. Use when working with PDF documents.' },
];

export function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('no JSON object in model output');
  return JSON.parse(text.slice(start, end + 1));
}

export function scoreTriggers(results) {
  const total = results.length;
  const correct = results.filter((r) => r.passed).length;
  return { total, correct, accuracy: total ? correct / total : 1 };
}

export class Budget {
  constructor({ maxCalls, maxUsd, priceIn, priceOut }) {
    Object.assign(this, { maxCalls, maxUsd, priceIn, priceOut, calls: 0, usd: 0, inTok: 0, outTok: 0 });
  }
  canSpend() { return this.calls < this.maxCalls && this.usd < this.maxUsd; }
  record(usage = {}) {
    this.calls++;
    const i = usage.input_tokens ?? 0;
    const o = usage.output_tokens ?? 0;
    this.inTok += i; this.outTok += o;
    this.usd += (i * this.priceIn + o * this.priceOut) / 1e6;
  }
}

export function loadSkill(dir) {
  const md = fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8');
  const { raw, body } = splitFrontmatter(md);
  const { data } = parseFrontmatter(raw);
  const refsDir = path.join(dir, 'references');
  const refs = fs.existsSync(refsDir)
    ? fs.readdirSync(refsDir).filter((f) => f.endsWith('.md')).sort().map((f) => ({ name: `references/${f}`, text: fs.readFileSync(path.join(refsDir, f), 'utf8') }))
    : [];
  const evalsPath = path.join(dir, 'evals', 'evals.json');
  const evals = fs.existsSync(evalsPath) ? JSON.parse(fs.readFileSync(evalsPath, 'utf8')) : null;
  return { dir, name: data.name, description: String(data.description).trim(), body, refs, evals };
}

export function discoverSkills(root = ROOT) {
  const out = [];
  for (const tier of TIERS) {
    const d = path.join(root, 'skills', tier);
    if (!fs.existsSync(d)) continue;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory() && fs.existsSync(path.join(d, e.name, 'SKILL.md'))) out.push({ tier, folder: e.name, dir: path.join(d, e.name) });
    }
  }
  return out;
}

export function changedSkillFolders(base, cwd = ROOT) {
  const out = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { cwd, encoding: 'utf8' });
  const set = new Set();
  for (const line of out.split('\n')) {
    const m = /^skills\/(core|community|vidmoat)\/([^/]+)\//.exec(line.trim());
    if (m) set.add(m[2]);
  }
  return [...set];
}

function catalogueText(skills) {
  return skills.map((s) => `- ${s.name}: ${s.description}`).join('\n');
}

function skillContext(skill) {
  const refs = skill.refs.map((r) => `\n\n<file path="${r.name}">\n${r.text}\n</file>`).join('');
  return `You have loaded the skill "${skill.name}". Follow it.\n\n<skill>\n${skill.body}\n</skill>${refs}`;
}

function fileBlock(skill, files = []) {
  return files.map((f) => {
    const p = path.join(skill.dir, f);
    const text = fs.readFileSync(p, 'utf8').slice(0, 20000);
    return `\n\n<attached path="${path.basename(f)}">\n${text}\n</attached>`;
  }).join('');
}

/**
 * Run one skill's trigger and output cases. ctx.client is from createClient;
 * nothing here depends on the provider, so grading is identical for both.
 * Trigger neighbours: the official product skills (skills/vidmoat/) are
 * a separate install, so a core or community skill competes with core and
 * community skills (plus decoys), and a vidmoat-tier skill with its own tier.
 */
export async function runSkill(skill, allSkills, ctx) {
  const { client, budget, triggerRuns } = ctx;
  const callModel = (args) => client.complete({ ...args, budget });
  const report = { skill: skill.name, triggers: [], outputs: [], incomplete: false, errors: [] };
  const isVidmoat = (s) => s.tier === 'vidmoat';
  const neighbours = allSkills.filter((s) => !skill.tier || !s.tier || isVidmoat(s) === isVidmoat(skill));
  const catalogue = catalogueText([...neighbours, ...DECOY_SKILLS]);
  const triggerSystem = `You are a coding and media agent. Before starting a task you may load skills. Load a skill only when its description says it applies to the task.\n\nAvailable skills:\n${catalogue}\n\nReply with JSON only: {"load": ["skill-name", ...]} (an empty list when none apply).`;

  try {
    for (const t of skill.evals.trigger_cases) {
      let hits = 0;
      for (let r = 0; r < triggerRuns; r++) {
        const out = await callModel({ system: triggerSystem, user: t.query, maxTokens: 2000, effort: 'low' });
        let loaded = [];
        try { loaded = extractJson(out).load ?? []; } catch { loaded = []; }
        if (loaded.includes(skill.name)) hits++;
      }
      const rate = hits / triggerRuns;
      report.triggers.push({ id: t.id, should_trigger: t.should_trigger, near_miss: !!t.near_miss, rate, passed: t.should_trigger ? rate >= 0.5 : rate < 0.5 });
    }

    for (const e of skill.evals.evals) {
      const user = e.prompt + fileBlock(skill, e.files);
      const runs = {};
      for (const cfg of ['with_skill', 'without_skill']) {
        const system = cfg === 'with_skill' ? skillContext(skill) : 'You are a helpful media and coding agent.';
        const answer = await callModel({ system, user, maxTokens: 8000, effort: 'medium' });
        const graderSystem = 'You grade an answer against assertions. Require concrete evidence quoted from the answer for a PASS; give no benefit of the doubt. Reply with JSON only: {"results": [{"text": "...", "passed": true|false, "evidence": "..."}]}';
        const graderUser = `Task given to the agent:\n${e.prompt}\n\nExpected output: ${e.expected_output}\n\nAssertions:\n${e.assertions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\n<answer>\n${answer}\n</answer>`;
        const graded = extractJson(await callModel({ system: graderSystem, user: graderUser, maxTokens: 4000, effort: 'low' }));
        const results = Array.isArray(graded.results) ? graded.results : [];
        const passed = results.filter((r) => r.passed === true).length;
        runs[cfg] = { pass_rate: e.assertions.length ? passed / e.assertions.length : 0, results };
      }
      report.outputs.push({ id: e.id, ...runs, delta: runs.with_skill.pass_rate - runs.without_skill.pass_rate });
    }
  } catch (err) {
    if (err.budget) report.incomplete = true;
    else report.errors.push(String(err.message ?? err));
  }
  return report;
}

export function summarise(reports, budget, minAccuracy, label = '') {
  const lines = ['## Skill evals', '', ...(label ? [label, ''] : []), `Model calls: ${budget.calls}, tokens in/out: ${budget.inTok}/${budget.outTok}, estimated spend: $${budget.usd.toFixed(2)}`, ''];
  let failed = false;
  for (const r of reports) {
    const t = scoreTriggers(r.triggers);
    const w = r.outputs.map((o) => o.with_skill.pass_rate);
    const wo = r.outputs.map((o) => o.without_skill.pass_rate);
    const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
    const delta = mean(w) - mean(wo);
    const triggerFail = r.triggers.length && t.accuracy < minAccuracy;
    const deltaFail = r.outputs.length && delta < 0;
    if (triggerFail || deltaFail || r.errors.length) failed = true;
    lines.push(`### ${r.skill}${r.incomplete ? ' (incomplete: budget reached)' : ''}`);
    lines.push(`- Trigger accuracy: ${t.correct}/${t.total} (${(t.accuracy * 100).toFixed(0)}%)${triggerFail ? ` FAIL, below ${minAccuracy * 100}%` : ''}`);
    const misses = r.triggers.filter((x) => !x.passed);
    if (misses.length) lines.push(`  - misfires: ${misses.map((m) => `${m.id} (${m.should_trigger ? 'should load' : 'should not load'}, rate ${m.rate})`).join(', ')}`);
    lines.push(`- Output pass rate with skill ${(mean(w) * 100).toFixed(0)}%, without ${(mean(wo) * 100).toFixed(0)}%, delta ${(delta * 100).toFixed(0)} points${deltaFail ? ' FAIL, the skill made answers worse' : ''}`);
    for (const err of r.errors) lines.push(`- Error: ${err}`);
    lines.push('');
  }
  return { text: lines.join('\n'), failed };
}

async function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry-run');
  let names = args.filter((a) => !a.startsWith('--'));
  const ci = args.indexOf('--changed');
  const all = discoverSkills();
  if (ci !== -1) {
    const base = args[ci + 1];
    names = names.filter((n) => n !== base);
    const changed = changedSkillFolders(base);
    if (!changed.length) { console.log('No skills changed; nothing to evaluate.'); return; }
    names = changed;
  }
  const selected = all.filter((s) => !names.length || names.includes(s.folder));
  const skills = selected.map((s) => ({ ...loadSkill(s.dir), tier: s.tier })).filter((s) => s.evals);
  const allLoaded = all.map((s) => ({ ...loadSkill(s.dir), tier: s.tier }));
  const triggerRuns = envNum(process.env.EVAL_TRIGGER_RUNS, 1);
  const planned = skills.reduce((n, s) => n + s.evals.trigger_cases.length * triggerRuns + s.evals.evals.length * 4, 0);
  const maxCalls = envNum(process.env.EVAL_MAX_CALLS, 150);
  console.log(`Evaluating ${skills.length} skill(s): ${skills.map((s) => s.name).join(', ') || 'none'}; ${planned} planned call(s), ceiling ${maxCalls}.`);

  const choice = selectProvider(process.env);
  if (!choice.skip) console.log(`Provider: ${choice.provider}, model ${choice.model}.`);
  if (dry) return;

  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (choice.skip) {
    const msg = `Skill evals skipped: ${choice.skip} (expected on forks; maintainers run them before merge).`;
    console.log(msg);
    if (summaryFile) fs.appendFileSync(summaryFile, `## Skill evals\n\n${msg}\n`);
    return;
  }
  if (!skills.length) return;
  const budget = new Budget({
    maxCalls,
    maxUsd: envNum(process.env.EVAL_MAX_USD, 3),
    priceIn: choice.priceIn,
    priceOut: choice.priceOut,
  });
  const { provider, model } = choice;
  const client = createClient({ provider, key: choice.key, model });
  const reports = [];
  for (const s of skills) reports.push(await runSkill(s, allLoaded, { client, budget, triggerRuns }));
  const minAcc = envNum(process.env.EVAL_MIN_TRIGGER_ACCURACY, 0.7);
  const { text, failed } = summarise(reports, budget, minAcc, `Provider: ${provider}, model ${model}.`);
  console.log(text);
  if (summaryFile) fs.appendFileSync(summaryFile, text + '\n');
  const outDir = path.join(ROOT, 'eval-results');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify({ provider, model, budget: { calls: budget.calls, usd: budget.usd }, reports }, null, 2));
  if (failed) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
