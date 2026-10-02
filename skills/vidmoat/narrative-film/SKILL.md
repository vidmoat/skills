---
name: narrative-film
description: "Story-led and cinematic edits: scene order kept, meaningful joins, per-shot correction before one restrained look. Use for short films, documentaries and make-it-look-like-a-movie requests (Director type narrative_film)."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Narrative and cinematic film

Story continuity first. A professional finish is coherence and control, not more effects.

## Workflow

1. **Structure.** Preserve scene order and meaning. Hold on action and expression as long as they carry; let holds follow the action, not a fixed interval.
2. **Joins.** Hard cuts for continuity; a dissolve only for a motivated jump in time or feeling; a fade to black for an act break. A static shot or a hard cut is often the best choice.
3. **Look.** Correct exposure and balance per shot before one restrained shared look on an adjustment layer (colour-grade). Keep skin natural.
4. **Sound is half the picture.** Level dialogue, keep room tone under cuts so no splice falls to digital silence, music under speech (`musicBed` or `autoDuck`).
5. **Format.** Keep the requested aspect ratio; a cinematic request does not change it.

## Gotchas

- No default teal-orange, grain, widescreen bars or slow zoom unless asked. Inspect what needs improvement rather than prescribing a recipe.
- A J or L cut needs separate audio and picture timing with real source handles; never fake one by moving a linked clip's mediaStart (j-l-cuts).
- Never change duration just because the user asked for a professional look.
- A decorative dissolve between two shots of one continuous moment is a tell.

Related skills: colour-grade, j-l-cuts, pacing, audio-cleanup. Specialists: film-editor, colourist, doc-storyteller.
