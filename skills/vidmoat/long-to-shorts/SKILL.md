---
name: long-to-shorts
description: "Cutting a short out of long footage: one idea with a payoff, vertical reframe on faces, captions, a hook from the content. Use for clipping podcasts, streams or webinars into Shorts (Director type long_to_shorts)."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Long to shorts

Two jobs: find the moment, then cut and frame it.

## Workflow

1. **Find the moment.** Read the transcript for one coherent idea with a payoff, at the requested length. Do not impose 30 to 60 s on every extraction. If the requested moment is not in the source, say so plainly and change nothing rather than cutting something else.
2. **Trim to it.** `cutRanges` or `trimClip` so the clip starts on the strongest sentence, keeps the context needed to follow it, and ends right after the payoff, never trailing into the next topic.
3. **Reframe to vertical.** `setProjectSettings` aspectRatio "9:16", then one `reframeAuto` with `follow:"faces"` per clip: it frames every shot on its measured face. Do not keyframe shots one by one. Check nobody is half out of shot.
4. **Captions** 3 to 4 words a line, out of the bottom 25% (captions skill).
5. **Hook.** Written from what is said in this clip, never generic bait. `addTitle` role `hook` when a text hook serves the brief.
6. **Audio.** Level both speakers so one is not twice as loud as the other (`setAudio` `compress` and `volume`).

## Gotchas

- Cut on sentence boundaries. A voice line cut through a word blocks the run from finishing.
- `reframeAuto` `follow:"faces"` needs measured face boxes (`semanticProfile.visualContext`); without them, inspect the source first.
- Never letterbox a landscape shot into 9:16.

With synced cameras, read [references/multicam.md](references/multicam.md).

Related skills: reframing, captions, talking-head. Specialists: shortform-strategist, retention-editor.
