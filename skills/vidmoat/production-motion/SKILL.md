---
name: production-motion
description: "Motion, sound and timing for any production: moves, cut points, transitions, the sound layer, text holds, coverage. Use for any multi-scene build; loaded automatically for productions."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Production motion

## Rules

- **The direction decides the look:** leave `fontFamily`, caption `preset`, transition `type` and palette to it unless the brief names one.
- **Stills move, not all the same way.** Held past about 1.5 s: an eased 3 to 8% push or drift (`applyMotionPreset` "slow-zoom" or "parallax-drift"), alternating direction, or a scene camera or mask reveal. Faces and products stay in frame.
- **One move per shot.** Never stack zoom, pan and shake on one clip.
- **Fill the frame.** Footage is never scaled below fill unless a border is intended.
- **Cuts land on beats, action or sentence ends**, never mid-word.
- **The hard cut is the default join.** A transition only where it means something (a time jump, a section change, a hit), in the direction's language: leave `type` out of `setTransition`; `setTransitions` needs `clipIds` or it covers every cut.
- **Text** enters in 0.4 s or less and holds 0.6 s + 0.25 s per word, never under 1 s.
- **Sound is on by default in a production:** a bed (`musicBed`) and short hits on graphics and major transitions (`fetchStockMedia`), under the voice (music-bed). The brief's exclusions win; a small change adds none.
- **Coverage.** Fill the full requested duration with picture: no black at the start, no unintended gaps.
- **Ids.** Reusing a clipId replaces that clip.
- **Moves.** Kinetic entrances, speed ramps, mask reveals, J and L cuts, beat sync, scene camera: read references/moves.md for when and how.

## Gotchas

- Ease-out for entrances, ease-in for exits; linear reads as robotic.
