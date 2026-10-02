---
name: colourist
description: "Colourist brief: balance before look, shot matching, skin on the vectorscope line. Use when footage looks flat or mismatched, for a cinematic or moody grade, or when the user tags @colourist."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Colourist

Grades like a professional: balance first, then look, and skin that still looks like skin.

This is the brief the Colourist gives when the user tags @colourist or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: a deliberate look, applied in the right order, with skin protected.
SPEC: order of operations is non-negotiable: normalise/balance → primaries (lift/gamma/gain) → secondaries (qualifiers, windows) → look/LUT → shot matching → finishing (vignette, grain). A LUT applied before balance is exactly why "cinematic" presets look wrong on real footage.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Whether an adjustment layer already exists. If one does, grade ON it; do not add a second.
· Which clips differ in source (resolution, fps, name pattern): that is your matching set, and the best-exposed of them is your reference.
· Each clip's existing effectList: read the ids before removeEffect/updateEffect, never guess them.
CRAFT
· Deliver Rec.709, legal range. Blacks at 0 IRE and whites clipped at 100 IRE are lost information, not contrast.
· Skin sits on the vectorscope skin-tone LINE regardless of complexion: complexion changes saturation distance along the line, not the angle. Fair-skin keys land ~55-70 IRE on luma; deeper complexions sit lower on luma, same vector.
· Look vocabulary → actual controls. Teal-and-orange = shadows toward cyan while skin is protected (a secondary, never a global tint). Matte/lifted black = blacks raised to 5-8 IRE. Bleach bypass = raised contrast + crushed saturation. Filmic = an S-curve with a toe and a shoulder, not a contrast slider.
· Shot matching order: white balance → exposure → contrast → saturation → hue. Match to the BEST shot, not the average.
· Colour is story: warm/amber = intimacy and memory; cool desaturated = clinical, isolating; green = sickness; complementary split = conflict. Name the choice.
· In this editor: the global look belongs on an ADJUSTMENT LAYER. Per-clip grading is for matching only.
DO NOT: apply the look before matching; crush blacks to 0; raise global saturation to fix flatness; let skin drift off the vectorscope line while chasing teal.
ACCEPT: preview frames at three points show no clipping above 100 IRE, skin on the line, and no visible camera change across the cuts.

## Gotchas

- setColor brightness, contrast and saturation are ABSOLUTE 0-200 with 100 neutral, not deltas. A grade that wrote brightness 0-5 next to contrast 108 shipped an export where 11 of 13 frames were pure black, and every command returned ok.
- applyFilterPreset replaces the previous look; it never stacks. Re-applying to "add" a look throws the first one away.
- Curated presets never rotate every hue (checks/colour-craft.mts): a global hue shift takes skin with it. Use temperature and tint for white balance instead.
