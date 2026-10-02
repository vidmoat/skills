# Changelog

All notable changes to the skills in this repository. Each skill is versioned
on its own in `metadata.version` (semver); repository releases are tagged
`vYYYY.MM.DD` and list the skill versions they contain. The `stable` branch
always points at the latest release; `latest` follows `main`.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Unreleased

### Changed

- Skills review fixes, each checked against the editor's code:
  - One vertical safe-zone rule everywhere: text above the bottom 22%
    (about 420 of 1920 px), the editor's caption check (bottom 20%, top 12%,
    right 12%, left 6%) as the hard floor, and an explicit caption `y` of
    about +0.2 H on 9:16 (`captions`, `accessibility-lead`, `reframing`,
    `shortform-strategist`, `talking-head`, `long-to-shorts`,
    `targeted-tweak`, `titles`; core `caption-styling` 1.1.0 corrects the
    "intersection" claim, the fit arithmetic and the table layout, and
    documents the checker's 32-character default).
  - `music-bed` 2.0.0: `duckTo` is an absolute gain, so the defaults dip
    about 5 dB; how to get 10 dB. Merged core references are named in plain
    text, so the links work on GitHub as well as in the editor.
  - `colour-grade`, `colourist` 2.0.0: lift, gamma, gain and the qualifier
    by their real fields; `shadows` and `highlights` are whole-frame
    approximations; what an adjustment layer does and does not render;
    `applyFilterPreset` resets the correction; colourist order, skin
    exposure as convention, and an acceptance line the agent can measure.
  - Audio: exports are loudness-normalised to -14 LUFS, -1.5 dBTP by
    default and `audio_inspect` returns source LUFS and true peak
    (`sound-designer`, `interview-editor`, `audio-cleanup`); no command makes
    room tone and `gate` is not a room-tone tool (`j-l-cuts`,
    `narrative-film`, `doc-storyteller`).
  - Speed ramps are one `setKeyframeTrack` speed curve (`speed-ramps`,
    `music-montage`, `beat-sync`, `editing-glossary`); multicam sync uses
    `syncAudioToVideo`; `undo` is a live-editor command only
    (`targeted-tweak`); reference-image limits per surface
    (`media-sourcing`, `vidmoat-editing`).
  - One hold rule for on-screen text (`titles`, referenced by
    `production-motion`, `text-led-video`, `motion-designer`,
    `doc-storyteller`); punch-ins inside a take versus cuts between shots
    (`camera-motion`, `film-editor`, `talking-head`, `interview-editor`);
    internal contradictions fixed in `retention-editor`,
    `explainer-producer`, `pacing`, `trailer-editor`.
  - Specialist descriptions lead with the tag or consultation, leaving plain
    task phrasing to the craft skills; overlapping descriptions narrowed.
  - `editing-glossary` 2.0.0: Hormozi maps to the Hormozi preset, plus
    pointers for tracking, background and object removal, voice change,
    audio sync, motion components and export loudness.

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
