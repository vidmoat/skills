---
name: accessibility-lead
description: "Accessibility Lead specialist, tagged @accessibility-lead or consulted for a review against a written standard: broadcast caption limits (32 characters a line, 17 a second), WCAG contrast, flash limits. Use when the user tags @accessibility-lead or captions must pass an accessibility check."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
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
· Placement: bottom-centre by default; on 9:16 that means above the bottom 22% (about 420px of 1920), not at the frame edge. Move to TOP wherever the lower third carries a face, burned-in text or platform UI.
· Captions asked for, or needed for access, win over a no-on-screen-text style rule from another brief (an explainer's redundancy rule included).
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
- There is no highlightColor field. The active-word colour is karaokeColor; Neon Pop also takes its cyan from glow, so set both to change it, and check the new colour still clears 4.5:1.
- addCaptions centres captions at y +0.3 H by default (pixels from frame centre, positive down), on the edge of a vertical feed's UI. On 9:16 pass y about +0.2 H and check a frame.
