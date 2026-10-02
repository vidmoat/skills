---
name: speed-ramps
description: "Slow motion and speed ramps done right: speed keyframes, the source-time integral, replays, freezes, reverses. Use for slow-mo, speed ramps, time warps, replays, freeze frames, rewinds or speeding up part of a clip."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Speed ramps

A ramp is a change of speed over time. A flat `setSpeed` is a speed CHANGE, not a ramp; use it only when no ramp is wanted.

## Workflow

1. **Ramp with keyframes:** `addKeyframe` on the `speed` property (it is keyframable). For a slow-motion hit: 1.0 down to 0.3 to 0.4 over about 0.3 s with `easeOutCubic` just before the moment, hold, then back up. For velocity edits, time the ramp in beats (beat-sync).
2. **Or use the preset:** `applyVfxPreset` "speed-ramp" writes a tested ramp in one command.
3. **Motion blur** sells fast moves: `setMotionBlur` 50 is about a 180-degree shutter. It costs nothing on a still clip.
4. **Replays:** `duplicateClip`, slow the copy (about 0.5) and place it immediately after the original; optionally label it.
5. **Freeze:** `freezeFrame` at the source-media time to hold, usually with a label and a punch.
6. **Reverse:** `reverseClip`. For a rewind beat, duplicate, reverse the copy and shorten it so the motion snaps back.

## Gotchas

- Source time is the INTEGRAL of the speed curve, not time multiplied by the current speed. A ramp from 1x to 3x over 4 s consumes 8 s of source, not 12. Plan source handles from the area under the curve.
- Speed is floored at 0.05; zero or negative does not reverse a clip (`reverseClip` does).
- Speed changes are structural: make them before captions and timed overlays, then read the new timing.
- Captions and speech review on ramped, reversed or frozen footage need baked audio or verified timeline words.
- Emotional does not automatically mean slow motion; ramp only the best moments.

Related skills: beat-sync, highlight-reel, camera-motion.
