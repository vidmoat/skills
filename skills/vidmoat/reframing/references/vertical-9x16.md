# Vertical 9:16 and format targets

Read this before placing text, captions or graphics on a vertical canvas, or when choosing a format.

## Safe zones on 1080 x 1920

- TikTok UI: about 140 px top, 400 px bottom, 60 px left, 180 px right (the action rail).
- Reels UI: about 220 px top, 420 px bottom.
- Text and captions (both apps): keep every text box above the bottom 22% (about 420 px) and below the top 12% (about 230 px), and clear of the right 180 px rail. The editor's caption check flags anything in the bottom 20%, top 12%, right 12% or left 6%: that is the hard floor, the 22% is the recommendation.
- Faces and graphics: inside a 900 x 1400 box centred on frame (83% of width by 73% of height on any vertical canvas). That box is a convention for keeping subjects central, not the platforms' intersection: its bottom edge is only 260 px up, inside both apps' UI, so never put text at its bottom edge.
- Positions are `y` in pixels from the frame centre, positive down. Captions: pass `y` about +0.2 H (384 on 1920); the `addCaptions` default of +0.3 H sits on the UI edge. A call to action sits at or above +0.2 H, never on top of the captions. Check a frame either way.

## Format targets

| target | canvas | notes |
|---|---|---|
| TikTok / Reels / Shorts | 1080 x 1920 | UI covers about the bottom 21 to 22% (400 to 420 px) and the top 7 to 11% (140 to 220 px) |
| Square feed | 1080 x 1080 | safe for feed and grid |
| YouTube | 1920 x 1080 | the thumbnail is a separate job |
| Landscape social | 1200 x 675 | often watched muted, caption it |

Vertical is the default for social unless the user says otherwise.
