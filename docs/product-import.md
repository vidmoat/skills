# How the Vidmoat editor gets its skills

This repository is the single source for every Vidmoat skill. The Vidmoat
editor (a private repository) holds no skill of its own: it imports this
repository at a pinned commit, and its deploy gate refuses any skill file that
differs from that commit. Nobody edits skills inside the product.

Nothing syncs automatically, and this repository holds no credentials for the
product. The product pulls; this repository never pushes.

## Direction of travel

```
pull request to vidmoat/skills (any tier)
        |
        |  review, CI (lint, catalogue, tests, evals), merge to main
        v
vidmoat/skills main  (or a release tag)
        |
        |  npm run skills:update in the product repository, run by a maintainer:
        |  resolves main (or a tag or commit) to an exact SHA, imports it,
        |  rebuilds the skill bundle, runs the skill checks
        v
product commit moving the pin (reviewed like any change)
        |
        |  next deploy
        v
the editor loads the new skills (bundled; nothing is fetched at run time)
```

## What the product imports

| Tier here | Lands in the product at | Notes |
| --- | --- | --- |
| `skills/vidmoat/<name>/` | `skills/<name>/` | byte-for-byte; must pass the product's own validator, or nothing is written |
| `skills/core/<name>/` | `skills/public/<name>/` | only `SKILL.md`, `references/`, `scripts/` and `assets/`; evals are recorded as skipped. Where the editor already owns the topic, the core skill is merged into that skill as reference files |
| `skills/community/` | nothing | never imported, and its scripts never run in the product |

Every imported file is verified against the commit's git tree (blob hash) and
recorded with its sha256 in the product's lock file, with the commit and tree.
The product's deploy gate (`checks/skills-spec.mts`) fails when any skill
file differs from the lock, with a message to change it here and re-import.

## Why the vidmoat tier has extra rules

The product validates every skill it imports with its own validator. A pull
request the product would refuse can merge here only to be stuck at import, so
the linter checks the product format in `skills/vidmoat/` (rule SK029): only
`SKILL.md`, `references/*.md`, `scripts/` and `assets/` one level deep, no
`evals/`, `metadata.owner` and `metadata.category`, no em dashes. The product
also checks that every command a skill names exists in the editor; that one
needs the editor's schema, so it runs at import time in the product, and a
maintainer fixes the pull request here if it fails.

## Keeping the editor current

- After merging a change to `skills/vidmoat/` or `skills/core/`, a maintainer
  runs `npm run skills:update` in the product, reads the summary of changed
  skills and the diff, and commits it.
- The product pins an exact commit. Do not rewrite `main` history: a pin to a
  commit that no longer exists cannot be re-verified.
- A release tag (`vYYYY.MM.DD`) can be imported instead of `main` when the
  editor should only move on releases.
