---
name: talking-head
description: "People talking to camera: transcript-first cuts, inserts on what is said, key-word captions, a sound on each pop, a levelled voice. Use for talking heads, vlogs, podcasts and interviews (Director type talking_head)."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "3.1.1"
  owner: "vidmoat"
  category: "craft"
---

# Talking head

Every decision comes from the words. Transcribe first (`transcribe` on each relevant clip, or reuse a cached `semanticProfile.transcript`), then cut, frame, caption, insert and mix in that order.

The edit people pay for: a designed insert on each spoken idea, the key word of each caption line restyled, a sound on each element that appears. Cuts stay sparse; the motion is inside the take.

## Workflow

1. **Understand.** Transcribe the speech, read `silenceRegions` and the measured face boxes. Fragmented words are not evidence of what was said.
2. **Structure.** Cut to the strongest complete idea: start on a sentence that stands alone (never "so, yeah"), keep the setup needed to understand it, end right after the payoff line. Remove confirmed pauses, restarts and repetition only: `trimSilence` for measured silences, `cutRanges` for word-timed filler and retakes. Keep breaths and meaning. Never shorten an answer into a claim the speaker did not make, and keep the full question when the user asks for it.
3. **Framing.** `punchIn` marks emphasis or hides a jump cut within one continuous take, not every sentence; leave `amount` out and it hits as hard as the direction says. A cut between camera setups follows the shot-size rule in film-editor instead. Rotate it with a cutaway. On a vertical canvas use `reframeAuto` with `follow:"faces"` so every shot is framed on its measured face.
4. **Captions.** `addCaptions` by `clipId`, 3 to 4 words a line, with `emphasis` naming the word each line leans on. On vertical the default `y` of about +0.2 H keeps them above the bottom 22% (platform UI), and never over the face. Skill: captions.
5. **Inserts.** One `designInserts` pass after the cut, one per idea, not one per sentence: a said figure counts up, a point lands as a keyword, steps tick. `at` is the timeline second of the spoken word. Use it, not `addTitle`, for graphics on what is said. On the line worth stopping for, `wordsBehind` puts big words behind the speaker, and `placeSpeech` sets a line as large type around the frame. Read references/inserts.md for which fits.
6. **A sound on each pop, a bed under it.** Each insert's `start` in the result gets a short `fetchStockMedia` `mediaType:"audio"`, `audioPurpose:"sound_effect"`, under the voice; `musicBed` for the bed (music-bed). A brief that rules them out wins.
7. **Voice.** Level with `setAudio` (`compress`). Hiss, rumble and hum: audio-cleanup.
8. **Check.** `agentWorkspace` action `review`: mode `speech` across every join and the ending (no word cut, every thought complete), mode `audio` for the mix, a frame at each insert.

## Gotchas

- A request for captions or a "podcast look" does not authorize cutting. Silence detection is evidence, not permission to delete.
- Captions alone add no inserts and no sound: a small request gets what it asked for.
- A figure nobody says refuses the WHOLE `designInserts` pass, naming the insert. Fix it from the transcript; never add the claim by another route. `wordsBehind` holds to the same rule.
- Leave 150 to 300 ms of room around speech when trimming; zero padding sounds machine-gunned. Keep 600 to 900 ms before a punchline or an emotional answer.
- Transcript word times on a clip are clip-relative; `cutRanges` takes timeline seconds. Convert before cutting.
- `trimSilence` keeps the original id on the first kept segment and returns new ids for the rest. Read them before placing captions or punch-ins.
- A voice line whose edit cuts through a transcribed word blocks the run from finishing (`speechcut:`). Extend the clip to the end of the phrase.
- `normalize` is peak normalisation, not loudness. Never tell the user their audio is at a loudness target.

Related skills: dead-air-cleanup, captions, audio-cleanup, long-to-shorts. Specialist: interview-editor.
