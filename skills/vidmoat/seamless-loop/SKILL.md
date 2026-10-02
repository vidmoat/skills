---
name: seamless-loop
description: "Loops with an invisible seam: matched frames and sound, a hard cut, constant energy, music in whole bars. Use for seamless loops, looping backgrounds, satisfying or ASMR clips and ambient wallpaper videos."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Seamless loop

A loop is judged entirely on whether the seam is invisible.

## Workflow

1. **Match the seam:** position, motion and sound at the last frame must meet the first. Inspect both frames before claiming it is seamless.
2. **No transition at the seam:** a fade announces the loop. Hard cut on matched frames.
3. **Constant energy:** no builds, drops or text cards; anything that marks a beginning breaks the illusion.
4. **Slow life on statics:** `applyMotionPreset` "breathing-scale", "float" or "parallax-drift".
5. **Soft grade:** `applyFilterPreset` "Pastel", "Fade" or "Cool", saturation about 95, contrast about 98.
6. **Audio loops too, or is silent.** Trim music to a whole number of bars and do not fade it; a fade marks the seam.

## Gotchas

- A forward and reverse duplicate (boomerang) is an optional effect, not a guarantee of a natural loop: it makes people, physics and dialogue visibly wrong.
- Keyframed motion must return to its starting value on the last frame or the seam jumps.

Related skills: camera-motion, music-bed.
