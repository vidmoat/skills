---
name: j-l-cuts
description: "Split edits where sound and picture change at different moments: detach, lead or lag, real handles. Use when the user asks for a J-cut, L-cut, split edit, audio lead or lag, or smoother dialogue joins."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.1.0"
  owner: "vidmoat"
  category: "craft"
---

# J and L cuts

Picture and sound do not change at the same instant, and that hides the edit.

## Workflow

1. **Separate the audio:** `detachAudio` on the clip returns its `audioClipId` and mutes the video.
2. **J-cut (audio leads):** trim or move the incoming audio clip so it starts before the video cut, pulling the viewer into the next beat.
3. **L-cut (audio lags):** let the outgoing audio run past the video cut to hold a reaction.
4. **Place from word timings:** transcript words give the cut points; lead or lag by a phrase, typically 0.3 to 1 s.
5. **No join falls to digital silence.** Where the lead or lag leaves a gap in the audio, cover it with a quiet stretch of the same recording: another audio clip of that source, from a measured pause, under the gap. No command makes room tone, so never report it unless you placed that clip and listened.
6. **Check the join** with `agentWorkspace` action `review` mode `speech` and listen with mode `audio`.

## Gotchas

- Never fake a J or L cut by changing a linked clip's `mediaStart`: that slips the picture and the sound together and creates no bridge.
- A lead or lag needs real source handles: audio that exists before or after the used range. Without handles there is nothing to extend into.
- In dialogue roughly two-thirds of cuts can be split; straight cuts on every line is what makes amateur dialogue feel like ping-pong.

Related skills: pacing, narrative-film, talking-head. Specialist: film-editor.
