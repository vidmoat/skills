# Platform safe zones

App interfaces (captions, buttons, usernames, progress bars) cover parts of the
frame. These figures are approximate and change when the apps change; when the
stakes are high, overlay a current screenshot of the target app.

## Vertical 1080x1920

| Platform | Keep clear (pixels) |
| --- | --- |
| TikTok | about 140 top, 400 bottom, 60 left, 180 right (the button rail) |
| Instagram Reels | about 220 top, 420 bottom |
| Cross-platform | everything important inside a 900x1400 box centred on the frame |

The cross-platform box is the intersection of the platforms. It is the only
safe assumption when the same file is posted in more than one place, so use it
by default.

## Any canvas

Derive the box from the actual canvas instead of assuming 1080x1920:

- **Vertical (9:16 and taller):** a centred box 83% of width by 73% of height.
  That is the 900x1400 rule generalised. Faces and graphics go inside it.
  Captions need more room at the bottom than the box gives (its bottom edge
  is 260 px up on 1080x1920): keep caption text above the bottom 420 px, or
  22% of height, which clears both TikTok and Reels.
- **Landscape and square:** title-safe is 90% of the frame (5% margins each
  side, for example 96 px on a 1920 px wide frame). Action-safe is about 93%.

Worked example for a 1080x1350 (4:5) feed post: it is not 9:16, so use the
landscape rule: margins are 54 px left and right and 68 px top and bottom.

## Moving captions to the top

Move a cue (or the whole track) to the top of the safe box when the lower third
holds a face, burned-in text, a lower-third graphic, or a product the viewer
must see. Keep the same style; only the position changes.
