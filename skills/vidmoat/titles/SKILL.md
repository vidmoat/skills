---
name: titles
description: "Titles, hooks, lower thirds, callouts and end cards that read: addTitle roles, reading-time holds, eased entrances, type pairing. Use for a title, name tag, call to action, kinetic text or a font change."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Titles and on-screen text

## Workflow

1. **One command per element:** `addTitle` with a role ("hook", "title", "lower_third", "callout", "end_card"). It sizes for the canvas, keeps inside the safe area, eases the entrance, puts a pill behind lower thirds and callouts, and gives an end card a full-screen background of at least 2 s. Override with `style` only when the brief asks for a look.
2. **Hold for reading:** at least 0.6 s + 0.25 s per word on screen, entrance not counted. Anything under 1 s is decoration, not communication. Add time when the viewer is also watching action; a name lower third reads best held 3 to 4 s.
3. **One idea per card.** A title with two clauses is two cards, or one card held twice as long.
4. **Entrances and exits:** about 0.2 to 0.4 s in with ease-out (`easeOutCubic`, `easeOutExpo`), 0.15 to 0.25 s out with ease-in. Stagger related elements 0.15 to 0.3 s apart with the same animation family. Linear reads as robotic.
5. **Typography:** choose fonts and supported weights for the footage, audience, language and brand; match existing typography for small additions. Search the fonts catalogue and set `fontFamily` explicitly. One display face and one support face at most.
6. **Kinetic type:** one text clip per phrase with `applyMotionPreset` "elastic-pop", "pulse" or "bounce-in", or scale and opacity keyframes when it must hit an exact beat. `textAnimation` also offers pop, typewriter and blur-in.

## Gotchas

- Text fontSize uses a 1920-wide reference canvas: 64 draws at about 36 pixels on a 1080-wide portrait frame. Check the rendered frame, not the number.
- Visible words live in `textStyle.content`: change them with `setTextStyle` `patch:{content}`. Style goes through `setTextStyle`, placement through `updateClip` `patch`.
- One sentence lives in ONE text clip with a line break, never split across clips.
- Outline, shadow, uppercase and animated entrances are options, not a default treatment. Contrast comes from placement first, then a plate or shadow if the footage needs it.
- Fonts that are not on the render box silently fall back at export; preview a frame when the typeface matters.
- End cards and calls to action sit over existing footage in the last 1.5 to 3 s, never over accidental black.

Related skills: motion-graphics, captions. Specialists: motion-designer, brand-guardian.
