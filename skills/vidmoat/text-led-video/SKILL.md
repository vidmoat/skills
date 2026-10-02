---
name: text-led-video
description: "Videos carried by on-screen words with no speech: write the copy, time cards to reading speed, design the type. Use for text-only videos, quote videos, silent announcements and text-card teasers (Director type silent_text_led)."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.1.0"
  owner: "vidmoat"
  category: "craft"
---

# Text-led video

Words carry the piece, so write them well and give each one time to land.

## Workflow

1. **Write the copy.** A clear premise, a progression and an ending line, each card 2 to 6 words. The copy is yours to write; claims are not. Never invent facts, prices or results.
2. **Time every card** by the titles rule: 0.6 s + 0.25 s per word on screen, never under 1 s, with the entrance (0.4 s or less) not counted as reading time.
3. **One entrance style** used consistently (`addTitle` roles, or `animIn` / `applyMotionPreset`), and a stronger one reserved for the climax.
4. **Typography is the design.** One display face and one support face, deliberate sizes from the design-language type scale, safe-area placement, contrast against the background. Activate titles for card mechanics.
5. **Depth and motion.** Build backgrounds with `addShapeClip`, `addHtmlElement` for designed layouts and slow background motion so no frame is static or empty. Activate motion-graphics for designed elements.
6. **Pace like a trailer:** build, a pause, a hit. With music, land each card on a measured beat (beat-sync).

## Gotchas

- One sentence lives in ONE text clip with a line break, never spread across separate clips.
- Text over moving footage needs a plate, a scrim or a shadow chosen for that frame; check the rendered frame, not the number.
- An intentional title card on black is valid here; accidental black between cards is a defect.

Related skills: titles, motion-graphics, beat-sync. Specialists: motion-designer, trailer-editor.
