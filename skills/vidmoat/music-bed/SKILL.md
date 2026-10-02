---
name: music-bed
description: "Music and sound effects under an edit: a licence-safe track, a bed with fades, ducking under speech, risers and impacts. Use for adding background music or SFX, music too loud over the voice, or ducking."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Music bed and sound effects

Music choice matters more than music processing: a track whose energy does not match the cut cannot be fixed with EQ.

## Workflow

1. **Choose the track.** The user's own first. Otherwise stock (`fetchStockMedia` `mediaType:"audio"`, `audioPurpose:"music"`, one or two concrete words) or original music (`generateMedia` kind `music` with a musical brief: mood, instruments, tempo, structure; Studio). If the edit has a turn in it, pick music with a turn in it and align them.
2. **Lay the bed in one command:** `musicBed` adds the music across the picture, sets a bed level with fades and ducks it under the voice where it is actually speaking. Use `autoDuck` for music that is already placed.
3. **Levels (convention):** the bed sits roughly 12 to 18 dB under speech while speech is present and comes up 6 to 10 dB in gaps. `autoDuck` `duckTo` 0.2 is the default dip.
4. **Fades.** Every music track fades out rather than stopping dead; an abrupt cut to silence reads as unfinished.
5. **Sound effects.** Risers and impacts from stock (`audioPurpose:"sound_effect"`), ONE per moment: a riser leads INTO the cut, an impact lands ON it.
6. **Silence is a tool.** Dropping the music for one beat before a reveal beats any transition effect.
7. **Listen to the result** with `agentWorkspace` action `review` mode `audio` before claiming the mix works.

## Gotchas

- Music under speech without ducking is the most common "sounds amateur" complaint. Never leave a flat bed over dialogue.
- When the music IS the content (a music video, a performance, a montage cut to the song), do not duck it. Duck only under a spoken intro.
- Licence: only Lyria generation and CC0 stock audio are safe for commercial export. Never send a music brief or lyrics to speech generation as a substitute; report a failed music generation honestly.
- Inspect generated or stock audio before claiming its content or full duration; a receipt is not a listening review.
- A loop must loop its audio too: trim music to whole bars and do not fade at the seam (seamless-loop).

General, tool-agnostic ducking craft (envelope timings that do not pump, sidechain settings, loudness targets per destination, ffmpeg recipes for work outside Vidmoat) is the public audio-ducking skill, merged here: read [references/audio-ducking.md](references/audio-ducking.md) when the user asks how loud music should sit, wants a sidechain, or needs a mix outside the editor. Where it differs from this skill, this skill wins: inside Vidmoat, `musicBed` and `autoDuck` do the envelope, and `normalize` cannot hit a loudness target.

Related skills: audio-cleanup, beat-sync. Specialist: sound-designer.
