# Platform safe zones

App interfaces (captions, buttons, usernames, progress bars) cover parts of the
frame. These figures are approximate and change when the apps change; when the
stakes are high, overlay a current screenshot of the target app.

## Vertical 1080x1920

| Platform | Keep clear (pixels) |
| --- | --- |
| TikTok | about 140 top, 400 bottom, 60 left, 180 right (the button rail) |
| Instagram Reels | about 220 top, 420 bottom |
| Both, for text | x 60 to 900, y 220 to 1500: the strict intersection of the two rows above (840x1280, not centred) |
| Both, for faces and graphics | a 900x1400 box centred on the frame, a common working convention |

Use the intersection for captions and any text that must be read when the
same file is posted to both apps. The centred 900x1400 box is NOT the
intersection: its bottom edge is only 260 px up, inside both apps' bottom UI,
so it is a guide for keeping faces and graphics central, never for placing
captions at its bottom edge.

## Any canvas

Derive the box from the actual canvas instead of assuming 1080x1920:

- **Vertical (9:16 and taller):** text stays out of the bottom 22% of height
  (420 px on 1920), the top 11.5% (220 px) and the right 17% of width (180 px,
  the button rail), which clears both TikTok and Reels. Faces and graphics
  also sit inside a centred box 83% of width by 73% of height (the 900x1400
  convention generalised).
- **Landscape and square:** title-safe is 90% of the frame (5% margins each
  side, for example 96 px on a 1920 px wide frame). Action-safe is about 93%.

Worked example for a 1080x1350 (4:5) feed post: it is not 9:16, so use the
landscape rule: margins are 54 px left and right and 68 px top and bottom.

## Moving captions to the top

Move a cue (or the whole track) to the top of the safe box when the lower third
holds a face, burned-in text, a lower-third graphic, or a product the viewer
must see. Keep the same style; only the position changes.
