---
name: audio-ducking
description: Mix voice over music so every word stays clear. Sets music bed levels, ducks the music under speech without pumping (from speech timings or with a sidechain compressor), and masters the mix to a platform loudness target. Use when the user wants background music under narration, a voiceover, a podcast or a vlog, says the music drowns out or fights their voice, asks how loud music should sit, or needs the final mix at YouTube, podcast or broadcast loudness, even if they never say "ducking".
license: CC-BY-4.0 for this text, Apache-2.0 for scripts
compatibility: Tool-agnostic guidance for any editor or DAW. The envelope script needs Python 3.8 or newer (standard library only). Recipes use ffmpeg 4.4 or newer.
metadata:
  version: "1.0.0"
  author: vidmoat
  domain: audio
---

# Audio ducking

The voice carries the meaning, so the music works for it: lower and steady
under speech, back up in the gaps that matter, never pumping on every breath.
Do the work in the user's editor when they have one (volume keyframes or a
sidechain compressor exist everywhere). Without one, use the ffmpeg recipes in
[references/ffmpeg-recipes.md](references/ffmpeg-recipes.md).

## Defaults

| Setting | Default | Why |
| --- | --- | --- |
| Delivery target | YouTube and streaming: -14 LUFS integrated. Podcast: -16 LUFS. Broadcast (EBU R 128): -23 LUFS, within 0.5 LU. True peak at most -1 dBTP | One master cannot serve every destination. If the user named none, use -14 LUFS and say so. |
| Music under speech | 12 to 18 dB below the voice | Below 12 the music competes for the same ears; beyond 18 it disappears. |
| Duck depth | 10 dB (range 6 to 12) when speech starts | Deeper ducks are heard as the music switching off. |
| Method | Volume automation from speech timings | Predictable, editable, and it can start before the first syllable. |
| Automation timing | Ramp down over 150 ms, ending at the first syllable; hold 200 ms after the last word; ramp up over 500 ms | Clips no word onsets and does not snap back on a breath. |
| Short pauses | Stay ducked through any pause shorter than the whole envelope (about 0.85 s with the timings above) | Releasing between phrases is the "pumping" that sounds amateur. |
| Sidechain (no timings available) | Ratio 4, threshold about 13 dB below the voice's typical peak level, attack 30 to 80 ms, release 250 to 700 ms | Gives about 10 dB of duck; see the depth formula below. |

Sidechain depth is roughly `(voice level - threshold) x (1 - 1/ratio)`. In a
measured test, a voice peaking at -10.5 dBFS with a -30 dB threshold at ratio 8
ducked the music 17 dB (too deep); a -23.5 dB threshold at ratio 4 ducked it
9 dB.

## Workflow

1. **Name the tracks.** Decide which clip is voice and which is music from the
   audio itself or a transcript, not from file names (see Gotchas).
2. **Get speech timings.** Use transcript segments or a voice activity
   detector. With timings, use automation; without them, use a sidechain.
3. **Set the bed level** with the music alone in the music-only sections,
   then decide the under-speech level from the table.
4. **Build the duck.** Turn timings into an envelope:

   ```bash
   python scripts/duck_envelope.py speech.json --depth-db 10 --format keyframes
   ```

   `--format keyframes` prints `time_s,gain_db` pairs for any editor's volume
   lane; `--format ffmpeg` prints a `volume` filter for the music input. It
   accepts `[[start, end], ...]`, transcript JSON with `segments`, or an SRT or
   VTT file (each cue counts as speech).
5. **Mix** voice and ducked music without automatic gain changes.
6. **Master** the full mix to the target with a two-pass loudness normaliser,
   then a true-peak limit. Mix to the target; do not lean on the limiter.
7. **Verify by measuring**, then by ear:
   - integrated loudness within 0.5 LU of the target and true peak at or
     below -1 dBTP;
   - in two or three speech windows, the ducked music alone is 12 to 18 dB
     under the voice alone;
   - no silence at the cuts (lay room tone under dialogue splices);
   - speech still clear with playback at about 30% volume.
   Report what was measured and what is still a judgment call.

## Gotchas

- **File names are not evidence.** A file called `voiceover.wav` can be music
  and a video's audio can be pure ambience. Confirm speech with a transcript
  or voice activity detection before building a duck from it.
- **ffmpeg's amix changes your levels.** By default it scales every input down
  by the number of inputs, and when one input ends it ramps the others back
  up over `dropout_transition` (2 s), so music swells as the voice ends. Use
  `amix=...:normalize=0` (ffmpeg 4.4 or newer).
- **Peak normalisation is not loudness.** Scaling so the highest peak hits a
  level lets one cough set the gain, and two clips "normalised" that way can
  differ by 15 dB in perceived loudness. Use LUFS (`loudnorm`, `ebur128`).
- **A "denoise" control may only be a high-pass filter.** One editor's
  denoise was literally `highpass`, which removes rumble and does nothing for
  hiss. Check what a control does before promising a cleaner voice.
- **Single-pass loudnorm pumps and resamples.** Without measured values it
  runs in dynamic mode (`"normalization_type": "dynamic"`) and outputs
  192 kHz. Run two passes with `linear=true`, check the second pass reports
  `linear`, and set `-ar 48000` on the output.
- **sidechaincompress threshold is linear, not dB.** `threshold=0.03` is about
  -30 dBFS. The range is 0.000976563 to 1 and ratio tops out at 20. Feed both
  inputs the same sample rate and channel layout (`aformat`) first.
- **Vocals in the music fight the voice.** Ducking a sung track deeper makes it
  pump. Cut 2 to 4 dB around 2 to 4 kHz on the music under speech instead, or
  pick an instrumental.
- **Remote inputs truncate silently.** In a long ffmpeg render, `http(s)` audio
  inputs can go idle and end early, so clips cut out mid-render at random
  points. Copy every source to a local file first.
- **Frame-stepped automation.** `volume=...:eval=frame` changes gain once per
  audio frame (about 21 ms at 48 kHz). That is smooth for ramps of 100 ms or
  more; for faster moves, use a sidechain.
