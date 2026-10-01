#!/usr/bin/env node
// Developer Certificate of Origin check, dependency-free.
//
//   node tools/dco-check.mjs <base-ref> [head-ref]
//
// Every non-merge commit in base..head must carry a
//   Signed-off-by: Full Name <email>
// trailer whose email matches the commit author's email (case-insensitive).
// Contributors fix a failure with `git commit --amend -s` or
// `git rebase --signoff <base>` and a force-push to their branch.

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SEP = '\u001e';
const FIELD = '\u001f';

export function parseLog(raw) {
  return raw.split(SEP).map((s) => s.replace(/^\n/, '')).filter((s) => s.trim()).map((rec) => {
    const [sha, parents, authorName, authorEmail, body] = rec.split(FIELD);
    return { sha, parents: parents.trim().split(/\s+/).filter(Boolean), authorName, authorEmail, body: body ?? '' };
  });
}

export function checkCommit(c) {
  if (c.parents.length > 1) return { ok: true, skipped: 'merge commit' };
  const signoffs = [...c.body.matchAll(/^Signed-off-by:\s*(.+?)\s*<([^>]+)>\s*$/gim)].map((m) => ({ name: m[1], email: m[2] }));
  if (!signoffs.length) return { ok: false, reason: 'no Signed-off-by trailer' };
  const match = signoffs.some((s) => s.email.toLowerCase() === String(c.authorEmail).toLowerCase());
  if (!match) return { ok: false, reason: `Signed-off-by email does not match author <${c.authorEmail}>` };
  return { ok: true };
}

export function commitsInRange(base, head = 'HEAD', cwd = process.cwd()) {
  const fmt = `${SEP}%H${FIELD}%P${FIELD}%an${FIELD}%ae${FIELD}%B`;
  const raw = execFileSync('git', ['log', `--format=${fmt}`, `${base}..${head}`], { cwd, encoding: 'utf8' });
  return parseLog(raw);
}

function main() {
  const [base, head = 'HEAD'] = process.argv.slice(2);
  if (!base) { console.error('usage: node tools/dco-check.mjs <base-ref> [head-ref]'); process.exit(2); }
  const commits = commitsInRange(base, head);
  let bad = 0;
  for (const c of commits) {
    const r = checkCommit(c);
    const short = c.sha.slice(0, 10);
    if (r.ok) console.log(`ok   ${short}${r.skipped ? ` (${r.skipped})` : ''}`);
    else { bad++; console.log(`FAIL ${short} ${r.reason}`); }
  }
  if (bad) {
    console.log(`\n${bad} commit(s) lack a valid DCO sign-off. Fix with:\n  git rebase --signoff ${base}\n  git push --force-with-lease\nSee CONTRIBUTING.md#developer-certificate-of-origin.`);
    process.exit(1);
  }
  console.log(`\nAll ${commits.length} commit(s) signed off.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
