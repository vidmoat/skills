# Writing a skill

A skill is a folder an agent loads when a task matches its description. The
agent reads the description up front (about 100 tokens per skill, for every
skill installed), the `SKILL.md` body only when it decides the skill applies,
and `references/` or `scripts/` only when the body tells it to. Write for that
order. The format is the [Agent Skills specification](https://agentskills.io/specification);
this page adds what this repository expects on top.

## Folder

```
skills/community/<name>/
  SKILL.md              frontmatter + instructions, under 500 lines
  evals/evals.json      trigger and output cases (required here)
  evals/files/          small synthetic inputs for output cases
  references/           extra detail, flat, linked from SKILL.md
  scripts/              helpers: standard library, no network, no installs
  assets/               templates, images, data; the only place for binaries
```

## Frontmatter

```yaml
---
name: caption-styling
description: Style, time and place captions ... Use when the user wants captions or subtitles added, restyled ...
license: CC-BY-4.0 for this text, Apache-2.0 for scripts
compatibility: Tool-agnostic. The checker needs Python 3.8 or newer.
metadata:
  version: "1.0.0"
  author: your-github-handle
  domain: captions
---
```

- `name` (required): lowercase letters, digits and single hyphens, 1 to 64
  characters, equal to the folder name. No `claude` or `anthropic`; no
  `vidmoat` in community skills.
- `description` (required): see below.
- `metadata.version` (required here): quoted semver string.
- `compatibility`: only if the skill needs something specific (Python,
  ffmpeg, network). At most 500 characters.
- `allowed-tools`: avoid. Community skills need a maintainer label for it.
- No other top-level keys: clients and `skills-ref` reject them.

The linter parses a strict YAML subset: plain or quoted strings, `>` and `|`
block scalars, and one level of nested map. Quote any value containing `: `
or ` #`. Flow lists, anchors and tabs are rejected.

## Descriptions

The description decides whether the skill is ever used, so it must say what
the skill does and when to use it ([guidance](https://agentskills.io/skill-creation/optimizing-descriptions)):

- Lead with what it does, concretely: "Style, time and place captions...".
- Then "Use when..." with the user's intents, in their words, including
  indirect ones: "says the music drowns out their voice".
- Cover the cases where the user never names the domain ("even if they never
  say ducking").
- State the boundary where a neighbour skill would be confused with yours, if
  near-miss trigger cases fail.
- 40 to 1,024 characters; aim under 700, because every installed skill's
  description is loaded into every session.

The linter's SK007 checks for a "when" clause and enough "what" words. It is a
heuristic; the trigger evals are the real test.

## Body

Structure that works for editing craft:

1. **One paragraph of intent**: who the output is for and what matters.
2. **Defaults table**: the values to use, each with a one-line "why".
3. **Workflow**: numbered steps, including a check step that runs a script or
   looks at rendered output.
4. **Gotchas**: concrete corrections from real failures.

Keep detail that is only needed sometimes in `references/`, and say exactly
when to read it: "Read references/platform-safe-zones.md before placing
captions on vertical video" beats "see references for more".

## Gotchas

The most valuable lines in a skill. Each one is a fact that a capable agent
would get wrong by assuming the obvious, ideally with the measurement that
proved it:

- Good: "ffmpeg burns SRT on a 288-line grid: `FontSize=24` renders as a 90 px
  font on 1080-line video."
- Bad: "Be careful with font sizes."

When an agent makes a mistake you have to correct, that correction is a
gotcha. Add it, and add an eval case that fails without it.

## Measure, do not recall

Two plausible numbers in Vidmoat's own guidance turned out wrong when
measured: a caption-width estimate that was off by more than 3x, and a
"normalize" control that was peak, not loudness, normalisation. If a skill
states a number, it should be one somebody measured or can cite. Recipes in
the seed skills were all run before they were written down; do the same.

## Scripts

Bundle a script when every run of the skill would otherwise reinvent the same
logic (parsing captions, building an envelope). Scripts must:

- use the standard library only and install nothing (SK018);
- make no network calls and contain no URLs in code (SK017);
- take arguments, print results, exit non-zero on failure, and support
  `--help`;
- be referenced from `SKILL.md` with a relative path, for example
  `scripts/check_captions.py`.

## Lint rules

`node tools/lint-skills.mjs --rules` prints them all. The ones contributors
meet most:

| Rule | Checks |
| --- | --- |
| SK001 | frontmatter exists and parses |
| SK002 | only spec fields |
| SK003, SK004, SK005 | name format, matches folder, no reserved words |
| SK006, SK007 | description length, says what and when |
| SK009, SK010 | metadata map with a semver version |
| SK011, SK012 | under 500 lines; about 5,000 tokens (warning) |
| SK013, SK014 | references one level deep; links resolve inside the skill |
| SK015, SK016 | no hidden Unicode, no HTML comments |
| SK017, SK018 | scripts: no network, no installs |
| SK019 | `allowed-tools` in community needs a maintainer label |
| SK020, SK021, SK022 | size limits; binaries only in `assets/`; no symlinks |
| SK023 | evals present and shaped |
| SK024 | a Gotchas section with items |
| SK025, SK026 | no injection phrasing; no download piped to a shell |
| SK027, SK028 | unique names; only `core/` and `community/` in `skills/` |
