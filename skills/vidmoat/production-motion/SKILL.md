---
name: production-motion
description: "Motion and timing rules for any production: moving stills, one move per shot, cut points, transitions, text holds, music fades, full coverage. Use for any multi-scene build; loaded automatically for productions."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.1.0"
  owner: "vidmoat"
  category: "craft"
---

# Production motion

Rules that hold for every production, whatever its type.

## Rules

- **Stills move.** A still on screen longer than about 1.5 s gets a slow eased push-in or drift of 3 to 8% across its whole hold (scale and x/y keyframes with `setKeyframeTrack`, or `applyMotionPreset` "slow-zoom" / "parallax-drift"), alternating direction between consecutive stills, faces and products kept in frame.
- **One move per shot.** Never stack zoom, pan and shake on one clip.
- **Fill the frame.** Footage is never scaled below fill unless a border is intended.
- **Cuts land on beats, action or sentence ends**, never mid-word.
- **Hard cuts by default.** A dissolve or whip only where it means something (a time jump, a section change), and one transition language per piece.
- **Text** enters in 0.4 s or less and holds by the titles rule: 0.6 s + 0.25 s per word, entrance not counted, never under the role minimum (1 s for any card, 3 s for a name lower third, 2 s for an end card).
- **Music** fades in and out and ducks under any voice (`musicBed`, or `autoDuck` for music already placed).
- **Coverage.** Fill the full requested duration with picture: no black at the start, no unintended gaps.
- **Ids.** Every new clip gets a unique clipId; reusing one replaces that clip.

## Gotchas

- A static photo held 4 s with no motion reads as a dead beat in any montage.
- Easing carries meaning: ease-out for entrances, ease-in for exits; linear reads as robotic. Pick one easing family per composition.
- Speed changes are part of structure: apply them before timed overlays, then read the new timing.
