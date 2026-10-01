---
name: caption-styling
description: Style, time and place captions and subtitles so they read on a phone with the sound off. Sets line length, reading speed, cue timing, size, contrast and platform safe zones, and checks SRT or VTT files against them. Use when the user wants captions or subtitles added, restyled, fixed or made accessible, says captions are too fast, too small or hidden under app buttons, or is preparing TikTok, Reels, Shorts or YouTube video, even if they only ask to "put what I say on screen".
license: CC-BY-4.0 for this text, Apache-2.0 for scripts
compatibility: Tool-agnostic guidance. The checker needs Python 3.8 or newer (standard library only). Burn-in recipes use ffmpeg built with libass.
metadata:
  version: "1.0.0"
  author: vidmoat
  domain: captions
---

# Caption styling

A caption is read in about two seconds, on a phone, with the sound off, over
moving footage, under app buttons. Every default below serves that reader.
Work in the user's editor if they have one; the numbers are the same
everywhere. When there is no editor, use the ffmpeg recipes in
[references/ffmpeg-burn-in.md](references/ffmpeg-burn-in.md).

## Defaults

Use these unless the user or their style guide says otherwise.

| Setting | Default | Why |
| --- | --- | --- |
| Lines per cue | 2 at most | A third line covers the subject and is not read in time. |
| Characters per line | 42 on landscape 16:9; on vertical 9:16, whatever fits the safe width at your size, usually 28 to 32 | Longer lines force eye travel, and on vertical they run off the frame. |
| Reading speed | 17 characters per second at most (about 160 to 180 words a minute) | Broadcast practice; WCAG sets no speed, so this is the working standard. |
| Cue duration | 1 s minimum, 6 s maximum | Under 1 s is a flicker; over 6 s viewers re-read. |
| Gap between cues | 0 or at least 2 frames | A 1-frame gap reads as a flash. |
| Position | Bottom centre, inside the safe zone | Move to the top when the lower third holds a face, burned-in text or app UI. |
| Size, sentence subtitles | Landscape: 4.5 to 5% of frame height (49 to 54 px at 1080p). Vertical: 64 to 72 px on 1080x1920 | Readable at arm's length, and 28 to 32 characters still fit the 900 px safe width. |
| Size, punchy short-form captions (1 to 3 words) | About 140 to 150 px on 1080x1920, at most about 14 characters per line | These are graphic elements, not subtitles. |

**Fit check before rendering.** A bold Arial-class sans in mixed case
averages 0.44 of the font size per character (measured, spaces included); all
caps averages 0.55; condensed faces about 0.35. So a line is roughly
`characters x 0.44 x font_px` wide. At 96 px, a 27-character line is about
1,140 px and runs off a 1080 px frame. Confirm with a rendered frame.
| Colour | Off-white `#F2F2F2` on a 70 to 80% opaque dark plate, or a 3 to 5 px dark outline plus soft shadow | Contrast against moving footage cannot be measured frame by frame; a plate guarantees WCAG 4.5:1. |
| Fonts | One heavy sans-serif (bold or semibold); never more than two families in a video | Thin weights vanish after compression. |
| Word highlight (karaoke) | One accent colour on the active word only, and it must clear 4.5:1 too | A second colour for "emphasis" makes viewers hunt for meaning. |

Platform pixel safe zones and how to derive the safe box for any canvas are in
[references/platform-safe-zones.md](references/platform-safe-zones.md). Read it
before placing captions on vertical video.

## Workflow

1. **Start from real timings.** Captions need a transcript with segment or
   word times. With no transcript there are no captions to make: say so, or
   transcribe first. Never invent wording.
2. **Rebase times to the edit.** Transcripts are timed against the source file.
   After trimming, cutting or changing speed, shift and scale each cue to the
   timeline (see Gotchas).
3. **Segment into cues.** Break at clause boundaries: after punctuation,
   before conjunctions and prepositions. Never split an article from its noun,
   a first name from a surname, or a number from its unit. Of two possible
   breaks, take the one that makes the two lines closest in length.
4. **Enforce reading speed.** A cue over 17 characters per second gets split or
   extended into the silence after it. Never shrink the type to fit.
5. **Mark speakers and sound.** On a speaker change start the line with `- `
   (or name them in brackets the first time). Put meaningful non-speech in
   square brackets: `[door slams]`, `[tense music]`. Do not caption filler
   words that were cut from the audio.
6. **Style and place** using the defaults and the safe box for this canvas.
7. **Check the file**, then fix every error it reports:

   ```bash
   python scripts/check_captions.py captions.srt --fps 30 --max-chars 32
   ```

   It checks line count, line length, characters per second, duration, gaps
   and overlaps, and exits non-zero on errors. Add `--json` for a machine
   report.
8. **Look at rendered frames**, not settings: the first cue, the longest cue,
   and a cue over the busiest background. Confirm nothing is clipped, nothing
   sits under app UI, and the text is readable at phone size.
9. **Deliver both** a burned-in version for social and a sidecar `.srt` or
   `.vtt` for accessibility and platform upload, unless the user asked for one.

## Gotchas

- **Width estimates lie on condensed faces.** Average-glyph width estimates
  have been off by more than 3x: one overflow check reported a line running
  127 px off each side when it actually rendered 270 px wide in a 1080 px
  frame. Shrinking type to satisfy that estimate produced 76 px captions on
  1080x1920 that were too small to read on a phone. Render a frame and measure.
- **Transcript times are source-relative.** If a clip starts 12.4 s into its
  source, subtract 12.4 s from every cue and add the clip's timeline start.
  At 2x speed, durations halve, so cues can fall under 1 s; re-segment instead
  of keeping the old cue boundaries.
- **ffmpeg burns SRT on a 288-line grid, not in pixels.** With
  `subtitles=file.srt:force_style=...`, `FontSize` and `MarginV` are measured
  against a 384x288 script, so `FontSize=24` renders as a 90 px font on
  1080-line video and 160 px on 1920-line video. Convert with
  `FontSize = px * 288 / frame_height`, or write an ASS file whose `PlayResX`
  and `PlayResY` equal the video size so units are pixels (the recipe does).
- **A plate in ASS takes OutlineColour.** With `BorderStyle=3` the box colour
  comes from `OutlineColour`, not `BackColour`, and ASS colours are
  `&HAABBGGRR` where alpha `00` is opaque. `&H40000000` is black at 75% opacity.
- **Inline colour changes break an ASS plate.** A `{\c...}` highlight inside a
  `BorderStyle=3` line draws a separate box per colour run, and the
  half-transparent boxes overlap into dark seams. Draw the plate as its own
  layer with invisible text and put the visible text on a layer above (the
  recipe shows how).
- **Missing fonts fail silently.** libass falls back to another font without an
  error. Check the `fontselect:` line in the ffmpeg log, or pass `fontsdir=`.
- **Windows paths break the subtitles filter.** Escape the drive colon:
  `subtitles='C\:/clips/subs.srt'`.
- **Sung lyrics are phrase-timed.** Speech recognition under music drops words
  (one test lost 4 of 17) and returns phrase times, not word times. Do not
  build word-by-word karaoke from it without checking against the audio.
- **Preset highlight colours can be baked in.** Some caption presets ignore a
  highlight-colour override with no error. Confirm on a rendered frame, and
  build a custom style if the brand colour does not appear.
