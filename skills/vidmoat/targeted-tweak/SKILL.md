---
name: targeted-tweak
description: "Discipline for one small change or repair: the fewest commands, nothing else touched, the real defect diagnosed first. Use for single edits like add a title, punch in here, make it warmer, put that back, or any tweak."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Targeted tweak

A small ask is a scalpel job. The most common complaint on simple requests is the agent doing nine edits when one was asked for.

## Rules

1. Do exactly what was asked with the fewest commands that fully achieve it (usually 1 to 3). Touch nothing else: no new music, grade, effects, captions or re-cuts, no restyling of neighbours, no "while I'm here".
2. Keep existing ids, timing and styling. Reusing a clipId in addClip REPLACES that clip; use `replaceClipMedia` to swap media.
3. Do not open a gap you do not close. A requested standalone title card or an intentional black background is valid.
4. Then stop and say plainly what changed, so the user can confirm you understood.

## Repairs

A fix request is diagnostic work, not creative work. The failure mode is "fixed" plus five unrequested changes.

- Read the timeline and identify the ACTUAL defect before emitting anything; what is wrong is often not what was described.
- Common repairs: gaps or black frames, `moveClip` or `trimClip` to close them; audio out of sync, `moveClip` the audio; text off screen, `updateClip` x/y inside the safe area; wrong order, `moveClip`; over-processed, `removeEffect` or `setColor` back toward 100.
- "Put it back" or "undo that" means issuing the commands that reverse the specific change (the previous value, position or clip). `undo` exists only in a live editor session: it is client-only and is refused on the server, over MCP and over the REST API. Never rebuild from scratch; you will lose their work.

## Common tweaks

- "Add a title card": ONE `addTitle` over existing footage at the requested moment, safe-area positioned and readable. It does not mean restructuring the timeline.
- "Punch in on X": one `punchIn` on that clip at that moment. Nothing else moves.

## By edit type

- talking_head: captions for all speech means `addCaptions` by clipId with real timing; existing captions are restyled with restyleCaptions, not re-added; on vertical keep them above the bottom 22% (pass `y` about +0.2 H) and off the face.
- montage_music: keep cuts on the beat the edit already follows; a timing change moves the neighbouring cuts with it.
- silent_text_led: change the words or style asked for and keep the card's timing, position and animation unless those were the ask.
- tutorial_screen: point at or zoom to the exact control named, held long enough to read, and leave the rest of the recording as it is.
- long_to_shorts: adjust the chosen moment's in and out points on sentence boundaries and keep its framing and captions in step.
- slideshow_voiceover: keep each line inside its image's window; a timing change moves the caption with its line.
- ad_promo: change the named card, line or shot only; product facts and the offer stay exactly as supplied.
- narrative_film: a professional finish is control, not more effects: fix what is named and leave pacing and framing alone.
- other: find the actual defect, change only what is broken, close any gap you open, and say what you changed.

## Gotchas

- `alreadyAtRequestedValues` means the setter is already satisfied; do not nudge a correct value to manufacture a change.
- `setColor` brightness, contrast and saturation are absolute 0 to 200 with 100 neutral. "Make it a bit brighter" is brightness 110, not 10.
