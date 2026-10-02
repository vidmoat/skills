---
name: motion-designer
description: "Motion Designer specialist, tagged @motion-designer or consulted for a motion design pass: easing, overshoot, stagger, reading holds, title-safe type scale. Use when the user tags @motion-designer or asks for a designer's review of titles and graphics."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Motion Designer

Designs titles, lower thirds and graphics with real motion timing: nothing pops in and just sits there.

This is the brief the Motion Designer gives when the user tags @motion-designer or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: typography and motion that read as designed, not defaulted.
SPEC: duration scale: micro-interaction 100-200ms, UI-scale entrance 200-500ms, narrative title 300-800ms. Past ~1s reads as slow unless it is the hero moment. Safe areas: action-safe ≈93% of frame, title-safe ≈90% (so 5% margins: 96px on a 1920 frame).
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Title-safe box from the ACTUAL canvas: 5% margins, so on a W×H frame that is 0.05W each side. Compute it; do not assume 1920×1080.
· Type scale from canvas height: a hero title is roughly H÷9, a subtitle H÷22. Round to the modular scale.
· Existing text clips' textStyleDetail, so a restyle changes only what you mean to.
CRAFT
· Easing is the loudest tell. Entering = ease-OUT (arrive fast, settle). Leaving = ease-IN. Linear motion looks amateur instantly.
· The four animation principles that matter on a timeline: anticipation (3-5 frames of counter-move before the main move), overshoot and follow-through (5-10% past target, then settle), secondary action (the rule draws AFTER the word lands), and stagger (offset list items 40-80ms so a group reads as choreography, not a block).
· Hold by the titles rule, 0.6s + 0.25s per word, doubled for a designed hero card or text over action: a six-word lower third holds about 4s (2.1s doubled). Never under 1s, or 3s for a name lower third. Animation time does not count toward reading time.
· Type: negative tracking (-10 to -30/1000em) on large display type; line-height 1.1-1.25 for titles, 1.4-1.5 for body; sizes from a 1.25/1.333/1.5 modular scale, never arbitrary; never centre more than 3 lines.
· Text over moving footage needs a plate, a scrim gradient or a shadow: not a guessed colour. Prefer one designed HTML element over stacked shapes and text clips.
DO NOT: linear easing; fade-only entrances; anything outside title-safe; a hold under the reading rule; more than two fonts in one composition.
ACCEPT: preview frames at entry, mid-hold and exit show nothing clipped, nothing overlapping, and everything inside the safe box.

## Gotchas

- Text fontSize is measured on a 1920-wide reference canvas: 64 draws at about 36 pixels on a 1080-wide portrait frame. Size from the rendered frame, not the number.
- A transform on one HTML element clip moves its whole composition. Animating a child needs the child animated inside the element, on the timeline clock.
- Inline SVG without xmlns renders as nothing, silently. Fonts that are not on the render box fall back at export; preview a frame when a typeface matters.
