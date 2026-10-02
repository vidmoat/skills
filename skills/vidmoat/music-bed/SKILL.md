---
name: music-bed
description: "Music and sound effects under an edit: a licence-safe track, a bed with fades, ducking under speech, risers and impacts. Use for adding background music or SFX, music too loud over the voice, or ducking."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Music bed and sound effects

Music choice matters more than music processing: a track whose energy does not match the cut cannot be fixed with EQ.

## Workflow

1. **Choose the track.** The user's own first. Otherwise stock (`fetchStockMedia` `mediaType:"audio"`, `audioPurpose:"music"`, one or two concrete words) or original music (`generateMedia` kind `music` with a musical brief: mood, instruments, tempo, structure; Studio). If the edit has a turn in it, pick music with a turn in it and align them.
2. **Lay the bed in one command:** `musicBed` adds the music across the picture, sets a bed level with fades and ducks it under the voice where it is actually speaking. Use `autoDuck` for music that is already placed.
3. **Levels.** `volume` and `duckTo` are linear gains, and `duckTo` is the ABSOLUTE volume the music drops to under speech, not a dip below the bed. `musicBed` sets the bed at 0.35 and ducks to the `autoDuck` default 0.2, a dip of only about 5 dB (20 x log10(0.2 / 0.35)). For a dip of about 10 dB under a 0.35 bed, follow `musicBed` with `autoDuck` (`clipIds` the music clip, `voiceClipIds` the speech) with `duckTo` about 0.11 (0.35 x 10^(-10/20)); in general `duckTo` = bed x 10^(-dB/20). How far the music then sits under the voice depends on how loud each source is, so judge it with the audio review, not the numbers. Exports are loudness-normalised to -14 LUFS (true peak -1.5 dBTP) by default; that moves the whole mix, never the balance between voice and music.
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

General, tool-agnostic ducking craft (envelope timings that do not pump, sidechain settings, loudness targets per destination, ffmpeg recipes for work outside Vidmoat) is the public audio-ducking skill (`skills/core/audio-ducking` in vidmoat/skills), which the editor merges into this skill as `references/audio-ducking.md`: read that file when the user asks how loud music should sit, wants a sidechain, or needs a mix outside the editor. Where it differs from this skill, this skill wins: inside Vidmoat, `musicBed` and `autoDuck` do the envelope, and `normalize` cannot hit a loudness target.

Related skills: audio-cleanup, beat-sync. Specialist: sound-designer.
