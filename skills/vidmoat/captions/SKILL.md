---
name: captions
description: "Adding, mapping, styling and checking captions: real transcript words, addCaptions by clipId, presets, safe zones, restyling. Use when the user asks for captions, subtitles, CC, Hormozi, karaoke or word-by-word text."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Captions

Captions support sound-off viewing. The words come from the transcript; the craft is mapping, grouping, placement and size.

## Workflow

1. **Words.** If the clip has no transcript, `transcribe` it first and read the words on the next step. Never invent caption text or build per-word text clips by hand.
2. **Map to the edit.** `addCaptions` with `clipId` maps the cached source transcript through that clip's trim, constant speed and timeline start. `src` alone uses full-source timestamps. For several cut clips, the first call replaces captions and every later call passes `keepExisting:true`.
3. **Style with a real preset** (search the catalogue's caption_styles for the brief): "Clean" or "Minimal" for documentary and professional pieces, "Bold Yellow", "Word Box", "Karaoke" or "Neon Pop" for hype and social. `maxWordsPerLine` 3 to 4 for punchy, about 5 for readable. One `addCaptions` takes a preset AND a style override (fontSize, color, outline, uppercase, karaoke, y): never script captions.
4. **Place.** Out of the bottom 25% on vertical (platform UI), never over a face, never over an existing text card or burned-in text.
5. **Existing captions** get `restyleCaptions`, not a second `addCaptions` (which replaces them by default). Preserve unrelated captions when appending; a requested replacement must still replace.
6. **Check** consecutive caption boundaries and the final caption tail against the retained speech, on rendered frames.

## Match the ask

- "Captions" means all speech. "A title" means ONE `addTitle`. Do not turn a title request into a caption pass.
- Emphasis on key words is a preset choice plus `applyMotionPreset` "pulse" on the specific line, not a different colour per word.
- Captions follow the spoken language; the user's chat language does not change them.

## Gotchas

- Text fontSize uses a 1920-wide reference canvas: rendered pixels = fontSize x canvasWidth / 1920 x clipScale. On a 1080-wide portrait canvas fontSize 64 draws only 36 pixels.
- The caption overflow lint over-estimates width about 3.7x on the condensed caption face. Size from preview frames; do not shrink captions to satisfy the lint (76 px passed the lint and was unreadable on a phone).
- `restyleCaptions` ignores `highlightColor` on Neon Pop: its karaoke highlight stays cyan. A brand-coloured highlight needs another preset.
- A newly created clip may not carry `semanticProfile.transcript` inside `vm.doc` even when its source is cached; never emit an empty `words` array.
- Reverse, loop, freeze and speed ramps need verified timeline words or baked audio before captioning.
- A caption on screen while nobody speaks is flagged; retime it to the words.

General, tool-agnostic caption craft (line breaking, reading speed, cue timing, sizing by canvas, platform safe zones, burning captions in outside Vidmoat) is the public caption-styling skill, merged here: read [references/caption-styling.md](references/caption-styling.md) when the user needs a sidecar SRT or VTT, an accessibility standard, or captions made outside the editor. Where it differs from this skill, this skill wins.

Specialist: accessibility-lead.
