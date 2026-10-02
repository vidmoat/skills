# Changelog

All notable changes to the skills in this repository. Each skill is versioned
on its own in `metadata.version` (semver); repository releases are tagged
`vYYYY.MM.DD` and list the skill versions they contain. The `stable` branch
always points at the latest release; `latest` follows `main`.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Added

- `skills/vidmoat/`: every skill the Vidmoat editor loads, moved here from the
  product repository. This repository is now the single source for every
  Vidmoat skill; the product imports a pinned, reviewed commit. Linter rule
  SK029 (the product format), SK005 reserves the Vidmoat name for this tier
  (core included), and a `vidmoat-editor` plugin in the marketplace.
- Evals run on OpenAI (`OPENAI_API_KEY`, Responses API) as well as Anthropic;
  `EVAL_PROVIDER` forces one. Grading is the same for both.

- `caption-styling` 1.0.0: caption defaults (line length, reading speed,
  timing, size, contrast, safe zones), measured ffmpeg and libass burn-in
  recipes, and `scripts/check_captions.py` for SRT and VTT files.
- `audio-ducking` 1.0.0: voice-over-music levels, timing-based and sidechain
  ducking, two-pass loudness mastering, and `scripts/duck_envelope.py`.
- Repository scaffolding: linter (`tools/lint-skills.mjs`, rules SK001 to
  SK028) with tests, catalogue generator, eval runner, DCO check, CI
  workflows, Claude Code plugin marketplace, governance and security
  documents.
