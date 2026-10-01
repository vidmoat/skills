## What this changes

One or two sentences: which skill, and what will an agent now do differently?

## Type

- [ ] New community skill
- [ ] Change to an existing skill (bumped `metadata.version` and added a CHANGELOG line)
- [ ] New gotcha from a real failure
- [ ] Tooling, CI or docs

## Evidence

For skill changes: what failed before, and how you know this fixes it. Paste
the prompt, what the agent did, and what it does now. For numbers (sizes,
levels, timings): how they were measured or where they come from.

## Checklist

- [ ] `npm test` passes locally (lint, catalogue, tool tests)
- [ ] `evals/evals.json` has at least 5 should-trigger and 5 should-not-trigger cases, 3 of them near misses
- [ ] Output cases have checkable assertions, and the skill beats the no-skill baseline (`npm run evals -- <skill>` with a key; maintainers run it otherwise)
- [ ] `SKILL.md` has a Gotchas section with concrete corrections
- [ ] Scripts use the standard library only, make no network calls and install nothing
- [ ] No customer media, private URLs, credentials or personal data in evals or examples
- [ ] Every commit is signed off (`git commit -s`)
