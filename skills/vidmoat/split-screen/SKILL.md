---
name: split-screen
description: "Two sources on screen at once: stacked or side-by-side splits, facecam picture in picture, reaction layouts and the audio hierarchy. Use for split screen, side by side, webcam overlays, reactions and duets."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Split screen and picture in picture

Two things on screen means the layout has to be deliberate.

## Workflow

1. **Stacked (vertical):** each clip on its own track, `applyLayout` "split-top" on one and "split-bottom" on the other: mask, position and cover-fit in one command, no bars.
2. **Side by side:** each clip `updateClip` scale about 0.5 with an x offset left and right (origin is the canvas CENTRE, +y is DOWN), `setMask` rectangle to trim spill.
3. **Picture in picture / facecam:** the overlay on a later track (it draws on top), `updateClip` scale about 0.28 into a corner, `cornerRadius` for softness, clear of captions and the action. Or `applyLayout` "framed".
4. **Audio hierarchy is the whole job:** the reactor's voice sits ON TOP. `autoDuck` the source under the commentary and level the voice (`setAudio` `compress`).
5. **Captions** for the commentary, placed where neither pane is obscured.
6. **Keep both panes visible** the whole time unless a moment justifies going full screen on one; cut to the reaction only when there IS a reaction.

## Gotchas

- Tracks later in the document's track list draw above earlier ones. An overlay on an earlier track is buried under the full-frame clip.
- `applyLayout` assumes 16:9 media when `mediaWidth`/`mediaHeight` are not passed; pass them for portrait sources.
- Check every pane on preview frames: faces must not be cropped by the mask.

Related skills: reframing, captions, audio-cleanup.
