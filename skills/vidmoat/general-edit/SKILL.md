---
name: general-edit
description: "Productions that fit no specific type: read the timeline and the brief, plan scene purposes and timings, choose treatments for this footage. Use when no more specific skill fits (Director type other)."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# General edit

Read the timeline and what the brief is for, then plan scene purposes and timings against the requested outcome before building.

## Workflow

1. **Understand.** Inspect the relevant sources (transcripts, scene understanding, `source_inspect`, `audio_inspect`) before deciding anything that depends on them.
2. **Plan.** Ordered scene purposes, target durations, the visual hierarchy, motion and sound approach, in the working plan.
3. **Build in dependency order:** structure (aspect ratio, cuts, trims, order), then content (captions, titles, media), then style, motion and the audio finish.
4. **Choose for this footage:** meaningful cuts over a fixed cadence, one transition language, text only where it adds meaning, sound balanced so speech is always clear.
5. **Check** the result against the brief: coverage, required moments, readable text, continuity, clear sound, an intentional opening and ending.

## Gotchas

- Prevent accidental uncovered gaps and unintended black frames. Intentional black, pauses and designed title cards are legitimate when they serve the brief.
- Reusing an existing clipId in `addClip` REPLACES that clip. To change a clip's media, use `replaceClipMedia`.
- Finish the whole job in this run; users hate being told to say "continue".
- When no specific skill fits, check the catalog again: a technique skill (captions, pacing, colour-grade, music-bed) may cover the part that matters.

Related skills: pacing, production-motion, editing-glossary.
