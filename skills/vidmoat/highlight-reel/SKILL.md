---
name: highlight-reel
description: "Gaming, sports and action highlights: approach, impact and reaction per moment, slowed impacts, a replay, the best moment first. Use for gaming clips, stream highlights, match highlights, skate, racing or car edits."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Highlight reel

Build around observed action and reactions; sell the moment of impact.

## Workflow

1. **Find the peaks** from actual scene and transcript evidence, not guesses. Quiet gameplay can be important context.
2. **Each highlight** = approach (0.5 to 1 s), impact, reaction (0.5 to 1 s). Keep enough context to understand it; cut what lies between peaks.
3. **Slow the impact:** a speed ramp 1.0 to 0.3 just before contact and back after (speed-ramps). This is the sports-edit move.
4. **Punctuate:** `punchIn` or `applyCameraShake` a frame after impact, on the biggest moments only.
5. **Replay the best one:** `duplicateClip`, slow the copy to about 0.5, place it immediately after; optionally a small "REPLAY" label.
6. **Look:** sports reads crisp, not filmic (`applyFilterPreset` "HDR" or "Vivid", contrast up). Gaming keeps the game's own colours.
7. **Sound:** keep the original sound unless a treatment was asked for; an impact sound on a hit and a driving track where wanted, ducked under any commentary.
8. **Open on the single best moment**, never a slow build-up.

## Gotchas

- Do not invent reaction text or meme captions the footage does not support; captions only when relevant to the brief.
- Do not cut menu screens that explain the task the viewer needs to follow.
- Favour meaningful cuts over a fixed cadence; every beat punched means nothing punched.

Related skills: speed-ramps, beat-sync, camera-motion.
