---
name: colour-grade
description: "Correcting and grading colour: match shots first, one look on an adjustment layer, setColor 0 to 200. Use for colour grading or correction, white balance, too dark or washed out, or a teal-orange, film or moody look."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Colour grade

Order of operations: balance, then match, then look, then finishing. A look applied before balance is why "cinematic" presets look wrong on real footage.

## Workflow

1. **Inspect** exposure, balance and any reference before choosing changes (`source_inspect`, measured scene evidence). Do not describe unseen skin as corrected.
2. **Correct per shot.** Mismatched clips are corrected individually with `setColor`: white balance with `temperature` and `tint`, then exposure, contrast, saturation. Match to the BEST shot, not the average. A global filter cannot fix opposite errors across shots.
3. **One shared look, optional:** `addAdjustmentLayer` once across the timeline, then `setColor`, `applyFilterPreset` or `addEffect` on THAT layer. Its opacity acts as strength. Grade once, not per clip.
4. **Protect skin and product identity.** Prefer `vibrance` over `saturation` when a shot is dull but faces already read well.
5. **Verify** the rendered result with preview frames at several points: no clipping, skin natural, no visible camera change across cuts.

## Gotchas

- `setColor` brightness, contrast and saturation are ABSOLUTE 0 to 200 with 100 neutral; vibrance, exposure, highlights, shadows, temperature and tint are -100 to 100 with 0 neutral; vignette is 0 to 1 (0.3 is a normal amount). Writing brightness 3 as if it were "+3" shipped an export that was 11 of 13 frames pure black, and every command returned ok.
- `applyFilterPreset` REPLACES the previous look; it never stacks. LUT looks take an `intensity` 0 to 1.
- Curated presets never rotate every hue: a global `hue` shift takes skin with it.
- Preserve the existing grade unless a colour change is requested. Cinematic pacing is not permission to recolor.
- Interpret a style reference as mood and contrast choices for this footage, not numbers to copy.

For named looks (teal and orange, film, matte, day for night, grain and halation, letterbox, vignette), read [references/looks.md](references/looks.md).

Specialist: colourist.
