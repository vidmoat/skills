---
name: talking-head
description: "Editing people talking to camera: transcript-first cuts, pauses and retakes removed, punch-ins, word-timed captions, a levelled voice. Use for talking heads, vlogs, podcasts and interviews (Director type talking_head)."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Talking head

Every decision comes from the words. Transcribe first (`transcribe` on each relevant clip, or reuse a cached `semanticProfile.transcript`), then cut, frame, caption and mix in that order.

## Workflow

1. **Understand.** Transcribe the speech, read `silenceRegions` and the measured face boxes. A transcript marked transcribed only means recognition ran; fragmented words are not evidence of what was said.
2. **Structure.** Cut to the strongest complete idea: start on a sentence that stands alone (never "so, yeah"), keep the setup needed to understand it, end right after the payoff line. Remove confirmed pauses, restarts and repetition only: `trimSilence` for measured silences, `cutRanges` for word-timed filler and retakes. Keep breaths and meaning. Never shorten an answer into a claim the speaker did not make, and keep the full question when the user asks for it.
3. **Framing.** `punchIn` (amount 1.10 to 1.15) marks emphasis or hides a jump cut, not every sentence. Rotate splice-hiding techniques: a punch-in, a cutaway, a short dissolve. On a vertical canvas use `reframeAuto` with `follow:"faces"` so every shot is framed on its measured face.
4. **Captions.** `addCaptions` by `clipId` (real word timing): "Bold Yellow", "Word Box" or "Karaoke" for social, "Clean" or "Minimal" for professional pieces, 3 to 4 words a line. Keep them out of the bottom 25% on vertical and never over the face. Activate the captions skill for styling and multi-clip detail.
5. **Audio finish.** Level the voice with `setAudio` (`compress` to even out delivery). Music, if wanted, sits under speech: `musicBed` for a new bed, `autoDuck` for music already placed. Hiss needs `noiseReduction`, rumble `denoise` (a low cut), mains buzz `hum` 50 or 60.
6. **Check.** Use `agentWorkspace` action `review` mode `speech` across every join and the ending: no word cut in half, every thought complete.

## Gotchas

- A request for captions or a "podcast look" does not authorize cutting. Silence detection is evidence, not permission to delete.
- Leave 150 to 300 ms of room around speech when trimming; zero padding sounds machine-gunned. Keep 600 to 900 ms before a punchline or an emotional answer.
- Transcript word times on a clip are clip-relative; `cutRanges` takes timeline seconds. Convert before cutting.
- `trimSilence` keeps the original id on the first kept segment and returns new ids for the rest. Read them before placing captions or punch-ins.
- A voice line whose edit cuts through a transcribed word blocks the run from finishing (`speechcut:`). Extend the clip to the end of the phrase.
- `normalize` is peak normalisation, not loudness. Never tell the user their audio is at a loudness target.

Related skills: dead-air-cleanup, captions, audio-cleanup, long-to-shorts. Specialist: interview-editor.
