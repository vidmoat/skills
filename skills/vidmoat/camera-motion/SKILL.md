---
name: camera-motion
description: "Virtual camera moves: punch-ins, Ken Burns on stills, shake on impacts, rack focus, whip pans and subtle depth. Use for zoom in, punch in, pan and zoom a photo, camera shake, rack focus or stills that feel dead."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Camera motion

One move per shot, chosen for a reason. Repeated zooms read as cheap.

## Moves

- **Punch-in:** `punchIn` (amount 1.10 to 1.15, eased) at the moment, with `hold` to release. Use it to mark emphasis or hide a jump cut, one per moment.
- **Ken Burns on stills:** `applyMotionPreset` "slow-zoom" or "parallax-drift", or scale and x/y keyframes, 3 to 8% across the hold (about 1 to 3% a second; faster reads as a screensaver), alternating direction, faces kept in frame.
- **Camera shake:** `applyCameraShake` on hits and drops only (amplitude 8 a knock, 30 an explosion). It decays, moves on both axes and ends at zero.
- **Rack focus:** `addKeyframe` on `blur`, high to 0 over about 0.4 s with `easeInOutCubic`, or the reverse, to move attention between subjects.
- **Whip pan:** `setTransition` type "whip-pan" with a `direction`, 0.15 to 0.3 s, best when both shots already move that way.
- **Depth:** `z` 0 is exactly neutral. Small `rotateY` / `rotateX` (3 to 8 degrees) gives a considered 3D feel; large values read as a gimmick.

## Easing

`easeOutExpo` reads confident and mechanical, `easeOutBack` playful, `spring` bouncy, `linear` like a machine. Pick one family per composition and stay in it.

## Gotchas

- Never stack zoom, pan and shake on one clip.
- Verify animation with sampled frames (`sample_clip_props` on MCP evaluates curves through the renderer); reading back keyframes only echoes what you set.
- Fast moves strobe without motion blur: `setMotionBlur` about 50.

Related skills: production-motion, speed-ramps, pacing.
