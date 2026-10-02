#!/usr/bin/env node
// Caption reading-speed check against broadcast practice.
//
//   node caption-cps.mjs cues.json [--max-cps 17] [--max-line 32] [--max-lines 2] [--min 1] [--max 6]
//
// cues.json: [{ "text": "First line\nSecond line", "start": 1.2, "end": 3.4 }, ...]
// Prints JSON { ok, cues, failures: [{ index, text, problems: [...] }] } and
// exits 1 when any cue fails. Characters per second counts visible characters
// (line breaks excluded) over the cue's time on screen.
// SPDX-License-Identifier: Apache-2.0
import { readFileSync } from 'node:fs';

function option(args, name, fallback) {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return fallback;
  const n = Number(args[i + 1]);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`--${name} must be a positive number; got "${args[i + 1]}".`);
  return n;
}

try {
  const args = process.argv.slice(2);
  const file = args[0];
  if (!file || file.startsWith('--')) throw new Error('Pass the cues JSON file first: node caption-cps.mjs cues.json');
  const maxCps = option(args, 'max-cps', 17);
  const maxLine = option(args, 'max-line', 32);
  const maxLines = option(args, 'max-lines', 2);
  const minDur = option(args, 'min', 1);
  const maxDur = option(args, 'max', 6);
  const cues = JSON.parse(readFileSync(file, 'utf8'));
  if (!Array.isArray(cues)) throw new Error('The cues file must hold a JSON array of { text, start, end }.');
  const failures = [];
  cues.forEach((cue, index) => {
    const problems = [];
    const text = String(cue?.text ?? '');
    const start = Number(cue?.start), end = Number(cue?.end);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      failures.push({ index, text, problems: ['start and end must be numbers with end after start'] });
      return;
    }
    const duration = end - start;
    const lines = text.split('\n');
    const visible = lines.join('').length;
    const cps = visible / duration;
    if (cps > maxCps) problems.push(`${cps.toFixed(1)} characters a second (max ${maxCps}): split the cue`);
    if (lines.length > maxLines) problems.push(`${lines.length} lines (max ${maxLines})`);
    const long = lines.find(l => l.length > maxLine);
    if (long) problems.push(`a line of ${long.length} characters (max ${maxLine})`);
    if (duration < minDur) problems.push(`${duration.toFixed(2)}s on screen (min ${minDur}s)`);
    if (duration > maxDur) problems.push(`${duration.toFixed(2)}s on screen (max ${maxDur}s)`);
    if (problems.length) failures.push({ index, text, problems });
  });
  console.log(JSON.stringify({ ok: failures.length === 0, cues: cues.length, failures }, null, 1));
  process.exit(failures.length ? 1 : 0);
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(2);
}
