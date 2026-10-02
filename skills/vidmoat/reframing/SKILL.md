---
name: reframing
description: "Changing aspect ratio with subjects kept in frame: face-following reframe, named layouts, no letterbox. Use for make it vertical, 9:16, 1:1 or 4:5 crops, keep me centred, or someone half out of shot."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Reframing

Changing the canvas alone leaves subjects half out of shot. Reframe deliberately.

## Workflow

1. **Set the canvas:** `setProjectSettings` with the target `aspectRatio` ("9:16", "1:1", "4:5", "16:9").
2. **Frame people:** one `reframeAuto` with `follow:"faces"` per clip covers the frame and centres every shot on its measured face. Do not keyframe shots one by one. Add `zoom` (at least 1) only when the brief wants a tighter frame.
3. **Follow a moving subject:** `reframeAuto` with `keyframes` (a per-frame track), or the subject-tracking workflow for objects.
4. **Named layouts:** `applyLayout` frames a clip as "full", "split-top" / "split-bottom", "framed" (rounded card) or "caption-safe" (raised, bottom strip clear for captions), with cover-fit and no bars. Pass `mediaWidth`/`mediaHeight` when known.
5. **Check** preview frames across each shot: nobody half out of shot, faces clear of captions and platform UI.

## Gotchas

- Never letterbox a landscape shot into 9:16: it wastes about 60% of the screen. A blurred plate is a last resort, not a style.
- `reframeAuto` `follow:"faces"` needs measured face boxes (`semanticProfile.visualContext`). Without them, inspect or analyse the source first.
- Faces in portrait sources were once squashed by face detection; trust preview frames over the numbers.
- Reframe before captions and titles; overlays placed for the old canvas land in the wrong place.

For 9:16 safe zones and format targets, read [references/vertical-9x16.md](references/vertical-9x16.md).

Related skills: split-screen, long-to-shorts, captions. Specialist: shortform-strategist.
