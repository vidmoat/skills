import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function tmpRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-lint-'));
  fs.mkdirSync(path.join(root, 'skills', 'core'), { recursive: true });
  fs.mkdirSync(path.join(root, 'skills', 'community'), { recursive: true });
  return root;
}

export const VALID_DESCRIPTION = 'Checks widget timing and placement for exported clips. Use when the user wants widgets added, fixed or reviewed, even if they only say "make it readable".';

export function skillMd({ name, description = VALID_DESCRIPTION, extra = '', body = null, version = '"1.0.0"' } = {}) {
  const fm = [
    '---',
    `name: ${name}`,
    `description: ${description}`,
    'license: CC-BY-4.0',
    extra,
    'metadata:',
    `  version: ${version}`,
    '  author: test',
    '---',
  ].filter((l) => l !== '').join('\n');
  const b = body ?? [
    '# Widget',
    '',
    'Follow [the guide](references/guide.md). Run scripts/check.py when done.',
    '',
    '## Gotchas',
    '',
    '- Widgets drift after trimming; rebase the times.',
    '',
  ].join('\n');
  return `${fm}\n\n${b}`;
}

export function evalsJson(name, overrides = {}) {
  const triggers = [];
  for (let i = 0; i < 5; i++) triggers.push({ id: `p${i}`, query: `please add a widget number ${i}`, should_trigger: true });
  for (let i = 0; i < 5; i++) triggers.push({ id: `n${i}`, query: `unrelated task ${i}`, should_trigger: false, ...(i < 3 ? { near_miss: true } : {}) });
  return {
    skill_name: name,
    trigger_cases: triggers,
    evals: [
      { id: 1, prompt: 'Add a widget', expected_output: 'A widget', assertions: ['has a widget', 'widget is readable'] },
      { id: 2, prompt: 'Fix a widget', expected_output: 'A fixed widget', assertions: ['widget fixed', 'explains why'] },
    ],
    ...overrides,
  };
}

/** Write a complete, valid skill and return its directory. */
export function makeSkill(root, tier, name, opts = {}) {
  const dir = path.join(root, 'skills', tier, opts.folder ?? name);
  fs.mkdirSync(path.join(dir, 'references'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'evals'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), opts.md ?? skillMd({ name, ...opts }));
  fs.writeFileSync(path.join(dir, 'references', 'guide.md'), '# Guide\n\nPlace widgets inside the safe box.\n');
  fs.writeFileSync(path.join(dir, 'scripts', 'check.py'), 'import sys\nprint("ok")\nsys.exit(0)\n');
  fs.writeFileSync(path.join(dir, 'evals', 'evals.json'), JSON.stringify(opts.evals ?? evalsJson(name), null, 2));
  return dir;
}

export function rules(findings, level = 'error') {
  return findings.filter((f) => f.level === level).map((f) => f.rule);
}

export function cp(code) {
  return String.fromCodePoint(code);
}
