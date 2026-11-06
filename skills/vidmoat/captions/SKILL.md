---
name: captions
description: "Adding, mapping, styling and checking captions: real transcript words, addCaptions by clipId, presets, safe zones, restyling. Use when the user asks for captions, subtitles, CC, Hormozi, karaoke or word-by-word text."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "3.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Captions

Captions support sound-off viewing. The words come from the transcript; the craft is mapping, grouping, placement and size.

## Workflow

1. **Words.** If the clip has no transcript, `transcribe` it first and read the words on the next step. Never invent caption text or build per-word text clips by hand.
2. **Map to the edit.** `addCaptions` with `clipId` maps the cached source transcript through that clip's trim, constant speed and timeline start. `src` alone uses full-source timestamps. For several cut clips, the first call replaces captions and every later call passes `keepExisting:true`.
3. **Style comes from the direction.** The video's creative direction (`setDirection`, stored on the project) names a caption style and `addCaptions` applies it, so a production leaves `preset` and `style.fontFamily` out and two videos look different. Name a preset only when the brief names a look or the user names one ("Hormozi"), or when a small change must match captions already there. There are 31 presets: when the brief does name a look, search the catalogue's caption_styles for it rather than reaching for one you remember. `maxWordsPerLine` 3 to 4 for punchy, about 5 for readable. One `addCaptions` takes a preset AND a `style` override (fontSize, color, outline, uppercase, karaoke, karaokeColor) plus `y`: never script captions. On a portrait canvas, leave `style.fontSize` out: addCaptions sizes captions for a phone (74 to 110 px per 1080 of width for lines, 110 to 150 px with `maxWordsPerLine: 1`, which also autoFits). Pass a fontSize only to go larger, and read the result's `warning` if you do.
4. **Place.** On 9:16 addCaptions already defaults to +0.2 H (384 on a 1920-high canvas, `y` is pixels from the frame centre, positive down); pass `y` only to move the caption elsewhere, then check a frame. Keep the caption box above the bottom 22% (about 420 px of 1920: TikTok's UI covers about 400, Reels about 420) and below the top 12%. The editor's caption check flags any caption reaching the bottom 20%, top 12%, right 12% or left 6% of a vertical frame; treat that as the hard floor, not the target. Never over a face, an existing text card or burned-in text.
5. **Existing captions** get `restyleCaptions`, not a second `addCaptions` (which replaces them by default). Preserve unrelated captions when appending; a requested replacement must still replace.
6. **Check** consecutive caption boundaries and the final caption tail against the retained speech, on rendered frames.

## Match the ask

- "Captions" means all speech. "A title" means ONE `addTitle`. Do not turn a title request into a caption pass.
- Emphasis is by meaning: the key word of each line, the one the speaker leans on (a figure, a name, the turn of the sentence). Pass `emphasis: {words, style}` on `addCaptions` or `restyleCaptions`, your chosen words in priority order. The code styles the first one each line says (`style`: color, highlight, highlightStyle box, marker or underline, fontWeight, scale; leave `style` out for the direction's accent) and never changes the text. A second pass replaces the first. Do not hand-style words with `setTextStyle`, and do not colour words at random or every word: that is noise, not emphasis.
- Captions follow the spoken language; the user's chat language does not change them.

## Gotchas

- Text fontSize uses a 1920-wide reference canvas: rendered pixels = fontSize x canvasWidth / 1920 x clipScale. On a 1080-wide portrait canvas fontSize 112 draws only 63 pixels, too small for one-word captions; a one-word caption needs fontSize 196 or more there. Omitting fontSize on portrait gets a readable size.
- The caption overflow lint over-estimates width about 3.7x on the condensed caption face. Size from preview frames; do not shrink captions to satisfy the lint (76 px passed the lint and was unreadable on a phone).
- `emphasis` reports `notInAnyCaption`: words you chose that no caption says. Read it, and choose again from the transcript instead of assuming the emphasis landed.
- There is no `highlightColor` field: `restyleCaptions` accepts it without an error and nothing changes. The spoken-word colour is `karaokeColor` (`karaokeBg` for a box behind the word). Neon Pop also draws its cyan from `glow`, so a brand-coloured Neon Pop needs both `karaokeColor` and `glow` in `style`; a style passed with the preset overrides the preset's fields.
- A newly created clip may not carry `semanticProfile.transcript` inside `vm.doc` even when its source is cached; never emit an empty `words` array.
- Reverse, loop, freeze and speed ramps need verified timeline words or baked audio before captioning.
- A caption on screen while nobody speaks is flagged; retime it to the words.

General, tool-agnostic caption craft (line breaking, reading speed, cue timing, sizing by canvas, platform safe zones, burning captions in outside Vidmoat) is the public caption-styling skill (`skills/core/caption-styling` in vidmoat/skills), which the editor merges into this skill as `references/caption-styling.md`: read that file when the user needs a sidecar SRT or VTT, an accessibility standard, or captions made outside the editor. Where it differs from this skill, this skill wins.

Specialist: accessibility-lead.
