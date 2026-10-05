---
name: colour-grade
description: "Correcting and grading colour: match shots first, then one restrained look, with setColor's real scales and lift, gamma and gain. Use for colour grading or correction, white balance, too dark or washed out, or a cinematic, teal-orange, film or moody look."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Colour grade

Order of operations: balance, then match, then look, then finishing. A look applied before balance is why "cinematic" presets look wrong on real footage.

## Workflow

1. **Inspect** exposure, balance and any reference before choosing changes (`source_inspect`, measured scene evidence; on MCP `analyze_shots` returns a `colourReadout` with clipped and crushed percentages, casts and face brightness per shot). Do not describe unseen skin as corrected.
2. **Correct per shot.** Mismatched clips are corrected individually with `setColor`: white balance with `temperature` and `tint`, then exposure, contrast, saturation. Match to the BEST shot, not the average. A global filter cannot fix opposite errors across shots.
3. **One shared look, optional.** An `addAdjustmentLayer` across the timeline, graded with `setColor`, renders only brightness, exposure, contrast, saturation, hue, highlights, shadows, blur, sharpen and vignette; its opacity acts as strength. Use it for the shared tonal look. Colour in the look (a teal-orange split, warmth, a LUT) renders only on the clips themselves: give each clip the same `lift` / `gamma` / `gain` values with `setColor`, or `applyFilterPreset` on each clip.
4. **Protect skin and product identity.** Put a colour split in `lift` (weighted to the shadows) and `gain` (weighted to the highlights), which leaves midtone skin mostly alone. Prefer `vibrance` over `saturation` when a shot is dull but faces already read well. If skin still drifts, the clip's qualifier corrects one colour range (see Gotchas).
5. **Verify** the rendered result with preview frames at several points: no clipping, skin natural, no visible camera change across cuts.

## Gotchas

- `setColor` brightness, contrast and saturation are ABSOLUTE 0 to 200 with 100 neutral; vibrance, exposure, highlights, shadows, temperature and tint are -100 to 100 with 0 neutral; vignette is 0 to 1 (0.3 is a normal amount). Writing brightness 3 as if it were "+3" once shipped an export that was 11 of 13 frames pure black; values between 0 and 10 on the 0 to 200 fields are now refused with that explanation.
- `shadows` and `highlights` are whole-frame approximations (shadows changes contrast, highlights changes brightness), not tonal-range controls: they cannot cool the shadows or tint anything. For that use `lift`, `gamma` and `gain`, each an [R, G, B] triple: lift is an offset that moves the blacks (default [0, 0, 0]; the Teal preset uses [0, 0.02, 0.045]), gain a multiplier that moves the highlights (default [1, 1, 1]; Teal uses [1.05, 1.0, 0.97]), gamma a power on the mids (default [1, 1, 1]). A few hundredths of lift is already visible; lift 0.05 puts black at 5%.
- "Black and white except one colour" (colour pop, colour splash, keep only the red) is ONE `isolateColor` op: `clipId`, `color` (a name such as red, orange, yellow, green, cyan, teal, blue, purple, magenta, pink, a hex, or [r, g, b] 0 to 1), optional `tolerance` (0.05 to 1, default 0.3) and `strength` (0 to 1, default 1). It selects by hue, so shadowed reds stay red. Never write a custom shader for it. Lower `tolerance` if faces stay coloured when keeping red: skin sits 20 to 30 degrees from red.
- The qualifier is one colour-range correction per clip: `qualifierTarget` an [R, G, B] colour from 0 to 1 (sample the skin on a graded frame), `qualifierTolerance` 0 to 1 (how far from it a pixel may be, default 0.1), then `qualifierHue` (-180 to 180), `qualifierSat` and `qualifierLuma` (-100 to 100) applied to that range only. It runs after that clip's lift, gamma and gain, and an adjustment layer does not render it.
- `applyFilterPreset` REPLACES the previous look; it never stacks. It also resets every field a preset controls (brightness, contrast, saturation, exposure, temperature, lift, gain and more) on that clip, so apply the preset or LUT first and the per-shot correction after it. The render order is fixed whatever order the commands came in: the clip's correction, then lift/gamma/gain, then the LUT. LUT looks take an `intensity` 0 to 1.
- Curated presets never rotate every hue: a global `hue` shift takes skin with it.
- Preserve the existing grade unless a colour change is requested. Cinematic pacing is not permission to recolor.
- Interpret a style reference as mood and contrast choices for this footage, not numbers to copy.

For named looks (teal and orange, film, matte, day for night, grain and halation, letterbox, vignette), read [references/looks.md](references/looks.md).

Specialist: colourist.
