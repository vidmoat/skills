---
name: screen-tutorial
description: "Tutorials and screen recordings: keep every step, cut only waiting, zoom to the real control, label steps. Use for how-tos, software demos, walkthroughs and courses (Director type tutorial_screen)."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Screen tutorial

Preserve the sequence someone needs to reproduce the result: every step, warning and prerequisite, in order.

## Workflow

1. **Understand.** Transcribe narration; inspect the recording (`agentWorkspace` action `source_inspect`) to find the actual UI actions and where they happen.
2. **Structure.** Remove confirmed waiting, loading and failed attempts only. Keep warnings, prerequisites and cause and effect.
3. **Point at the action.** Identify the actual control from visual evidence before zooming or pointing; never infer coordinates from speech alone. Zoom to the control being used (`punchIn` with a `hold`, or scale keyframes), hold long enough to read it, then pull back.
4. **Label steps** with short on-screen text (a verb and an object) that matches what is shown: `addTitle` role `callout` or `lower_third`.
5. **Captions** from real speech timing when there is narration (captions skill).
6. **Sound.** Music, if any, stays low under explanation (`musicBed`).
7. **End on the result**: show the finished outcome.

## Gotchas

- UI text must stay readable: hold a zoom long enough to read the control, and never zoom so far the pixels break up.
- Use only chapter and navigation commands that exist in the schema (`setChapters`); do not invent chapter ops.
- Never invent product facts, prices or claims. Ask for what only the user knows.

Related skills: captions, titles, dead-air-cleanup, camera-motion. Specialist: explainer-producer.
