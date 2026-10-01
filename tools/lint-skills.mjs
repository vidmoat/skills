#!/usr/bin/env node
// Lint every skill in skills/core and skills/community.
//
//   node tools/lint-skills.mjs                 # lint everything
//   node tools/lint-skills.mjs caption-styling # lint named skills only
//   node tools/lint-skills.mjs --json          # machine-readable output
//   node tools/lint-skills.mjs --labels allowed-tools-approved
//   node tools/lint-skills.mjs --strict        # warnings fail too
//   node tools/lint-skills.mjs --rules         # list rule ids
//
// Labels can also come from SKILLS_LINT_LABELS (comma separated), which is how
// CI passes pull request labels in. Exit code 1 on any error.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintRepo, RULES } from './lib/rules.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--') && !a.includes('=')));
let labels = (process.env.SKILLS_LINT_LABELS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const names = [];
let repoRoot = root;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--labels') { labels = labels.concat(String(args[++i] ?? '').split(',').map((s) => s.trim()).filter(Boolean)); continue; }
  if (a.startsWith('--labels=')) { labels = labels.concat(a.slice(9).split(',').map((s) => s.trim()).filter(Boolean)); continue; }
  if (a === '--root') { repoRoot = path.resolve(args[++i]); continue; }
  if (a.startsWith('--')) continue;
  names.push(a);
}

if (flags.has('--rules')) {
  for (const [id, text] of Object.entries(RULES)) console.log(`${id}  ${text}`);
  process.exit(0);
}

const { skills, findings } = lintRepo(repoRoot, { labels, only: names.length ? names : null });
const errors = findings.filter((f) => f.level === 'error');
const warnings = findings.filter((f) => f.level === 'warning');

if (flags.has('--json')) {
  console.log(JSON.stringify({ skills: skills.map((s) => ({ tier: s.tier, name: s.name })), findings }, null, 2));
} else {
  for (const f of findings) {
    const loc = f.line ? `${f.file}:${f.line}` : f.file;
    console.log(`${f.level === 'error' ? 'ERROR' : 'warn '} ${f.rule} ${loc}  ${f.message}`);
    if (process.env.GITHUB_ACTIONS === 'true') {
      const kind = f.level === 'error' ? 'error' : 'warning';
      const line = f.line ? `,line=${f.line}` : '';
      console.log(`::${kind} file=${f.file}${line},title=${f.rule}::${f.message.replace(/\r?\n/g, ' ')}`);
    }
  }
  console.log(`\n${skills.length} skill(s) checked: ${errors.length} error(s), ${warnings.length} warning(s).`);
}

if (names.length && skills.length !== names.length) {
  const found = new Set(skills.map((s) => s.folder));
  const missing = names.filter((n) => !found.has(n));
  if (missing.length) { console.error(`Unknown skill(s): ${missing.join(', ')}`); process.exit(1); }
}
process.exit(errors.length || (flags.has('--strict') && warnings.length) ? 1 : 0);
