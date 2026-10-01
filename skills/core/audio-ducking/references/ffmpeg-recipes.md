# ffmpeg recipes for ducking and mastering

Each recipe was run on ffmpeg 8.0 and its levels measured. Paths are examples:
`voice.wav` is the narration, `music.wav` the bed, both local files.

## 1. Duck from speech timings (default)

Build the filter, then apply it to the music input only:

```bash
DUCK=$(python scripts/duck_envelope.py speech.json --depth-db 10 --format ffmpeg)
ffmpeg -i voice.wav -i music.wav -filter_complex \
  "[1:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=-6dB,${DUCK}[bed]; \
   [0:a]aformat=sample_rates=48000:channel_layouts=stereo[vo]; \
   [vo][bed]amix=inputs=2:duration=first:normalize=0[mix]" \
  -map "[mix]" -c:a pcm_s24le mix.wav
```

- `volume=-6dB` sets the bed's normal level; adjust it so the bed sits where
  you want it in the music-only sections.
- `duration=first` ends the mix with the voice. Use `longest` when the music
  should play out after the last word, and fade it (`afade=t=out:st=...:d=3`).
- Measured: with regions at 1 to 3 s and 3.5 to 5 s, the 0.5 s pause stayed
  fully ducked (the two phrases merged), the music sat exactly 10 dB lower
  under speech, and it returned to full level 0.7 s after the last word.

To loop a short bed under a longer voice, put `-stream_loop -1` before
`-i music.wav` and keep `duration=first`.

## 2. Duck with a sidechain compressor (no timings)

```bash
ffmpeg -i voice.wav -i music.wav -filter_complex \
  "[0:a]aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[vo][sc]; \
   [1:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=-6dB[bed]; \
   [bed][sc]sidechaincompress=threshold=0.067:ratio=4:attack=40:release=500[ducked]; \
   [vo][ducked]amix=inputs=2:duration=first:normalize=0[mix]" \
  -map "[mix]" -c:a pcm_s24le mix.wav
```

- `asplit` sends the voice both to the mix and to the compressor's key input.
- Threshold: find the voice's typical peak (`volumedetect` `max_volume` on a
  speech-only stretch), go about 13 dB below it, and convert to linear:
  `10 ** (dB / 20)`. For a voice peaking near -10.5 dBFS that is -23.5 dB,
  so `threshold=0.067`. Measured duck: 9 dB.
- The compressor can only react after the voice starts, so the first syllable
  of each phrase lands on full-level music for the attack time. That is why
  timing-based automation is the default.

## 3. Master to the target (two passes)

Pass 1 measures:

```bash
ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null -
```

Copy `input_i`, `input_tp`, `input_lra`, `input_thresh` and `target_offset`
from the JSON into pass 2:

```bash
ffmpeg -i mix.wav -af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=-17.65:measured_TP=-12.85:measured_LRA=3.20:measured_thresh=-28.06:offset=1.23:linear=true:print_format=summary" -ar 48000 master.wav
```

- Swap `I=-14` for -16 (podcast) or -23 (broadcast, with `TP=-1`).
- If pass 2 reports `Normalization Type: Dynamic`, the target was not
  reachable within the true-peak ceiling in linear mode; lower the mix's peaks
  (a gentle limiter on the music, or less bed) and run both passes again.
- Always set `-ar 48000`: in dynamic mode loudnorm outputs 192 kHz.

## 4. Measure

Whole-file loudness and true peak:

```bash
ffmpeg -i master.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:"
```

Level of one stem in one window (repeat for voice and for ducked music):

```bash
ffmpeg -ss 12.0 -t 3.0 -i ducked_music.wav -af volumedetect -f null - 2>&1 | grep mean_volume
```

Render the ducked music on its own for this check by mapping `[bed]` (or
`[ducked]`) to an output instead of mixing it.

Find accidental silence (gaps of 0.3 s or more below -45 dB):

```bash
ffmpeg -i master.wav -af silencedetect=noise=-45dB:d=0.3 -f null - 2>&1 | grep silence_
```
