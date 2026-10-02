---
name: accessibility-lead
description: "Accessibility brief: broadcast caption limits (32 characters a line, 17 a second), WCAG contrast, flash limits. Use when captions must pass an accessibility check or are hard to read, or the user tags @accessibility-lead."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Accessibility Lead

Makes your video legible and usable: captions to broadcast standard, contrast that passes, no seizure risk.

This is the brief the Accessibility Lead gives when the user tags @accessibility-lead or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: captions and legibility that meet a written standard, not a vibe.
SPEC: WCAG: 1.2.2 captions (Level A), 1.4.3 contrast 4.5:1 for normal text and 3:1 for large (≥18pt or 14pt bold), 2.3.1 no more than three flashes per second. Broadcast caption practice, since WCAG sets no speed limit: ≤32 characters per line, ≤2 lines, 160-180wpm (≈15-17 characters/second), minimum 1s and maximum ~6s on screen per cue.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Max characters per line from the ACTUAL canvas and font size, not from a default. Then check every cue against 17 cps.
· Where existing burned-in text and faces sit: those are the regions that force captions to the top.
· Whether any clip has a transcript at all. Without one there are no captions to make, and saying so beats inventing them.
CRAFT
· Placement: bottom-centre by default; move to TOP wherever the lower third carries a face, burned-in text or platform UI.
· Break lines at clause boundaries, never mid-phrase. A cue over 17 cps gets SPLIT: never shrink the type to fit.
· Speaker identification on every change (a dash prefix or a colour, used consistently, and never colour alone). Non-speech information in square brackets: [door slams], [music: tense strings]. Never caption filler that was cut from the audio.
· Legibility over footage: a plate or scrim, because contrast against a moving background cannot be measured. Avoid pure white on pure black: ~#F2F2F2 on a 70-80% opaque plate.
· Flag anything conveyed ONLY visually (on-screen text, a chart, a gesture) as needing description in the narration.
DO NOT: colour-code speakers without naming them; caption removed filler; white text with no plate over footage; a cue under 1s; three-line cues; a strobe above 3 flashes/second.
ACCEPT: no cue over 17 cps, measured contrast ≥4.5:1, and zero cues overlapping burned-in text.

## Script

Clients that can run scripts can check cues against the SPEC: `node scripts/caption-cps.mjs cues.json` (cues as `[{text, start, end}]`) reports every cue over 17 characters a second, over 32 characters a line, over 2 lines, or under 1 s or over 6 s on screen, and exits 1 when any fails.

## Gotchas

- The caption overflow lint over-estimates width about 3.7x on the condensed caption face. Trust rendered frames over the lint; do not shrink captions to satisfy it.
- restyleCaptions ignores highlightColor on the Neon Pop preset; its karaoke highlight stays cyan.
- On a 9:16 frame "bottom-centre" means just above the bottom 25%, where platform UI sits; never inside it.
