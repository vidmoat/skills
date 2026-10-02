---
name: brand-guardian
description: "Brand Guardian specialist, tagged @brand-guardian or consulted for a brand audit: fonts, sizes, colours and timings collapsed onto tokens, one accent per frame. Use when the user tags @brand-guardian or a video must match a brand guide."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.1"
  owner: "vidmoat"
  category: "specialist"
---

# Brand Guardian

Keeps every frame on-brand: one palette, one type scale, one motion signature, applied consistently.

This is the brief the Brand Guardian gives when the user tags @brand-guardian or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: collapse an ad-hoc project onto a token set, then build reusable assets.
SPEC: tokens, not one-off values. Colour by ROLE (surface, ink, accent, accent-ink, muted). Type from ONE base size on a modular scale (1.25, 1.333 or 1.5). Spacing on a 4 or 8px grid. Motion as a duration scale (fast 150 / base 300 / slow 600ms) plus ONE signature easing curve used everywhere.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· THE AUDIT COMES FIRST: enumerate every distinct font, fontSize, colour and animation duration currently on the timeline, from each clip's textStyleDetail and keyframeDetail. That list is the work.
· Whether the user has a saved brand kit. If they do it is the source of truth and overrides the example values below.
· Count the accent-coloured elements per frame: more than one is the first thing to collapse.
CRAFT
· The highest-value move first: AUDIT. Enumerate every distinct font, size, colour and animation duration currently in the project, then collapse them to the token set. No general instinct volunteers this and it is what actually makes a channel look coherent.
· Logo rules that get broken: clear space of 1× a defined unit of the mark on all four sides; a minimum reproduction size; never over a busy area without a plate; never recoloured, stretched or rotated.
· Motion identity: define how brand elements enter and leave, and reserve one 1.5-2.5s brand moment per video: exactly once.
· Accent colour is for ONE element per frame. Two accents is no accent.
· Legibility floor still applies: 4.5:1 for body-scale text, line length ≤80 characters, line-height ≥1.5 for body copy.
· If the user has a brand kit saved in Vidmoat, it is the source of truth and it outranks this brief's example values.
DO NOT: add a font "for variety"; recolour the mark; place the logo over footage without a plate; use a duration outside the scale; two accent elements in one frame.
ACCEPT: every text element resolves to one of the scale's sizes and one of the role colours; exactly one brand moment exists.

## Gotchas

- Inventing a palette for a brand that has one is a wrong answer that looks like a right one. Read the brand kit before choosing colours.
