# Burning captions in with ffmpeg

Use these when the user has no editor, or wants a scripted, repeatable burn-in.
They need an ffmpeg build with libass (`ffmpeg -filters` lists `subtitles`).
Every recipe here was rendered and measured on ffmpeg 8.0.

## Default: write an ASS file at the video's own resolution

Setting `PlayResX` and `PlayResY` to the video size makes every size and margin
a pixel value, which is what the defaults in SKILL.md are written in. Measured:
`Fontsize` 90 on a 1920-line frame gives capital letters about 58 px tall
(cap height is roughly 0.65 of `Fontsize`).

```text
[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Plate,Arial,68,&HFF000000,&HFF000000,&H40000000,&H00000000,1,0,0,0,100,100,0,0,3,12,0,2,90,90,420,1
Style: Text,Arial,68,&H00F2F2F2,&H00F2F2F2,&H00000000,&H00000000,1,0,0,0,100,100,0,0,1,0,0,2,90,90,420,1
Style: Outline,Arial,68,&H00F2F2F2,&H00F2F2F2,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,4,2,2,90,90,420,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:03.20,Plate,,0,0,0,,I lost four thousand pounds\Nin a single week.
Dialogue: 1,0:00:01.00,0:00:03.20,Text,,0,0,0,,I lost four thousand pounds\Nin a single {\c&H35A5FF&}week{\c}.
```

How it fits together:

- **Two layers per cue.** Layer 0 uses `Plate`: invisible text (primary alpha
  `FF`) with `BorderStyle` 3, which draws a box per line in `OutlineColour`
  (`&H40000000` is black at 75% opacity; `Outline` 12 is the padding). Layer 1
  uses `Text` and carries the visible words and any highlight. Writing the
  highlight on the plate layer instead splits the box into one box per colour
  run with dark seams where they overlap.
- **`Outline` style** is the alternative look: a 4 px dark outline and a 2 px
  half-transparent shadow, one layer, no plate. Use it when a plate is too
  heavy for the edit.
- `WrapStyle: 2` turns off automatic wrapping, so only your `\N` breaks apply.
  Line breaks are an editorial decision; do not leave them to the renderer.
- `Alignment` uses numpad positions: 2 is bottom centre, 8 is top centre.
- `MarginV` 420 on 1920 keeps the text clear of the bottom 420 px, where
  TikTok and Reels draw the caption and buttons. Margins L and R of 90 keep
  lines inside 900 px.
- At 68 px the 27-character first line measures about 810 px wide, inside the
  900 px box. The same line at 96 px runs off the frame.
- Colours are `&HAABBGGRR`. Alpha `00` is opaque, `FF` is invisible. Inline
  `{\c&HBBGGRR&}` has no alpha: `{\c&H35A5FF&}` is orange.
- Where the two line boxes overlap, a partly transparent plate shows a darker
  strip. Lower the padding until they just touch, or accept it.

Burn it in, copying the audio untouched:

```bash
ffmpeg -i input.mp4 -vf "subtitles=captions.ass" -c:a copy -c:v libx264 -crf 18 -preset medium output.mp4
```

## Quick: style an SRT directly

When the user only has an SRT and wants a fast result. Remember the 288-line
grid: sizes are `px * 288 / frame_height`. For 68 px text on 1920-line video
that is `FontSize=10.2`, and a 420 px bottom margin is `MarginV=63`. The
single-layer plate is fine here because SRT lines carry no colour changes.

```bash
ffmpeg -i input.mp4 -vf "subtitles=captions.srt:force_style='FontName=Arial,FontSize=10.2,Bold=1,PrimaryColour=&H00F2F2F2,OutlineColour=&H40000000,BorderStyle=3,Outline=2,Shadow=0,Alignment=2,MarginV=63'" -c:a copy output.mp4
```

## Fonts

Name the font family exactly as installed, then confirm the `fontselect:` line
in the log shows it. If the font is a file, add `:fontsdir=/path/to/fonts` to
the `subtitles` filter. On Windows escape the drive colon in any path:
`subtitles='C\:/work/captions.ass'`.

## Converting between formats

```bash
ffmpeg -i captions.srt captions.vtt     # sidecar for web players
ffmpeg -i captions.srt captions.ass     # starting point; then set PlayResX/PlayResY
```

A converted ASS keeps the 384x288 grid until you change `PlayResX` and
`PlayResY` and rescale the style sizes.
