---
name: vidmoat-editing
description: "Manual for an agent editing in Vidmoat over MCP or chat: the inspect, edit, read receipts, preview loop and the mechanics that cost whole runs. Use at the start of a session or when edit_project calls keep failing."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.1.0"
  owner: "vidmoat"
  category: "manual"
  surfaces: "mcp channel"
---

# Editing video with Vidmoat

A working manual for an AI agent driving Vidmoat over MCP. Read it once at the start of a session; it does not change mid-job.

The tool schema teaches the *controls*; nothing in it teaches the *craft*. An agent that only reads tool descriptions produces edits that are technically valid, correctly aligned and lifeless. Everything here is either a measured fact about this system or a working convention from editing, labelled so you know which you can bend.

Layout geometry is NOT repeated here: it is already in every prompt you get (safe areas, type scale, the stacking inequality).

## Craft skills

Craft lives in focused skills. `list_skills` returns the catalog (name and description); `get_skill` with a `name` returns that skill's SKILL.md and lists its reference files, which `get_skill` with `name` and `file` returns. Load the ones the task needs, not all of them. The ones most edits need:

- pacing: shot lengths by format, rhythm, cutting on motion, transitions.
- titles: dwell time, entrances and exits, type, lower thirds and end cards.
- captions: mapping the cached transcript, presets, placement, sizing.
- audio-cleanup and music-bed: what our audio controls actually do, levels and ducking.
- colour-grade: matching before looks, setColor's absolute scale.
- camera-motion and speed-ramps: moves, easing and the speed integral.

Edit-type skills (talking-head, music-montage, ad-promo, long-to-shorts, slideshow-voiceover, screen-tutorial, text-led-video, narrative-film) carry the workflow for a whole kind of piece. Specialist skills (film-editor, colourist, sound-designer and eleven more) are briefs written by professionals; `get_specialist_brief` returns the same text.

## 1. The loop that actually works

**Use saved media evidence.** Video understanding can include a `classification` with content type and visible subject, setting and shot tags. These are model estimates with confidence, limited to the sampled frames or range. Reuse them to identify relevant footage; absent tags mean unclassified. Use `analyze_audio_kind` or `agent_workspace` `audio_inspect` for sound; visual tags never establish that speech or music is present.

**Keep useful work moving past a plan limit.** If voiceover or generation is unavailable, complete independent edits the user already requested. Preserve successful work, name the missing asset, and offer their own upload or an access choice. Never repeat a denied generation, bypass the gate, silently substitute a different medium, or leave a run waiting for purchase.

```
get_project            see what exists
preview_strip          SEE it, do not imagine it
plan the whole edit    beats first, commands second
edit_project           in batches, with previewAt
READ THE RECEIPTS      identify rejected fields and missing edits
REVIEW THE LINT        distinguish defects from advisory notes
preview_frame          look again at what you changed
fix, then render
```

**Inspect visual edits on the real canvas.** Numeric x/y/fontSize choices can overlap or misalign. Use saved preview frames, a strip or the saved-edit review tool. Looking only at the source does not verify the edited result, and reading back requested coordinates is not a visual check.

**Read the lint in context.** `edit_project` reports layout problems and advisory notes. Repair actual defects introduced by your edit; a `note`, an intentional overlap or an unchanged pre-existing warning is not a reason to restyle the user's project. Static frames do not verify continuous motion or audio.

**Batch coherent changes.** Group related edits, inspect, then continue. Do not replay a successful batch after a later tool failure.

**Keep the brief through follow-ups.** Turn the request into concrete acceptance points: exact trims, content to preserve, caption treatment, motion, sound and output format. A reply such as "yes", "more exciting" or "the blue one" refines that brief. Ask only for a consequential missing choice; proceed with reasonable creative decisions when the user has delegated them.

For a launch, demo or other multi-scene production, write an ordered scene plan with each scene's purpose, timing, visual action, text hierarchy and sound approach, and check it accounts for the requested duration. "Make a fictional demo" permits a clearly fictional product; "do whatever you want" delegates creative choices. Neither authorizes unapproved paid generation or invented claims about a real business.

**An accepted command is not a finished edit.** Read every result and `droppedFields` warning. `alreadyAtRequestedValues` means that setter is satisfied; do not nudge a correct value to manufacture a change. Correct the named field or operation; do not repeat failed arguments unchanged. After two identical failures, inspect new evidence or explain the block.

**Close against the acceptance points.** Check the saved revision at the opening, key moments and ending. Preview motion across time and verify audio with audio-capable evidence. Never substitute "applied N commands" for fulfilling the brief, and never call a queued render a completed export.

## 2. Vidmoat mechanics that cost other agents whole runs

Every item comes from a real failed run.

- **Clips are TOP-LEVEL in the document, not nested under tracks.** Parse with `parseDocument`; its track sort IS the z-order.
- **Placement goes inside `patch`, not at the top level.** `addClip` takes `{type, src, start, duration, trackIndex, patch: {x, y, scale, opacity}}`.
- **`setShapeStyle` reads `patch`; `addShapeClip` reads `style`.** Flat style keys to `setShapeStyle` change nothing.
- **A background rectangle goes on the BOTTOM track.** Track order is z-order.
- **Person background replacement needs a foreground mask.** Use `addEffect` `type:"bg-remove"`, then `setBgReplace` with `patch:{type:"color",color:"#ffffff"}`. A rectangle over the footage is not a substitute; preview the mask edges.
- **Check the enum name against the parameter name.** `preset: 'filterPreset'` means the parameter is `preset` and its type is the enum `filterPreset`.
- **Use the operation that owns a field.** `updateClip.patch` takes placement, `trackIndex` and `loop`; text goes through `setTextStyle`, colour through `setColor`, masks through `setMask`.
- **Visible words live in `textStyle.content`.** `setTextStyle` with `patch: {content: "First line\nSecond line"}`.
- **`list_projects` returns a WINDOW** with `total`, `returned` and `truncated`; never count projects from the array length.
- **A `blob:` src is a dead clip.** It only worked in the tab that imported it; the media must be re-imported.
- **Fonts must exist on the render box**; several fall back silently at export.
- **Inline SVG needs `xmlns`** or it renders as zero pixels.
- **`sample_clip_props` evaluates curves through the renderer.** `get_project` only echoes what you set.
- **Transitions belong to the outgoing clip:** `setTransition` with the outgoing `clipId`; there is no `addTransition`.
- **`setColor` is 0 to 200 absolute, 100 neutral.** `saturation: 18` is nearly greyscale.

## 3. Use what the account already has

- **Recipes** capture a finished video's style and program. "Make it my usual style" means look for a recipe.
- **Specialists** (`@film-editor`, `@colourist` and others): a tagged specialist's numbers are proposed targets. Check that each applies to this footage and can be measured, then follow it; the user's brief, exclusions and limits win.
- **Brand kit** holds the user's fonts, colours and logo; check it before choosing a palette.
- **`get_credits`** before anything long. If the balance is short, say so and relay the purchase url from `get_credits` or `buy_credits`; the USER pays on the payment page. Never take payment or ask for card details.

## 4. Taste, briefly

- **Decide what the video is for before you cut:** sell, teach or feel. Most bad agent edits are a teach edit paced like a sell edit.
- **Restraint reads as confidence.** One well-timed move beats five.
- **Repetition creates style; randomness creates noise.** If the first title slides up, every title slides up.
- **The end matters.** A held final frame, a clean CTA, or a cut to black on the last beat, chosen deliberately.
- **Say what you assumed** in one line when the brief did not specify it.

Research, media beyond uploads and creator preferences: read [references/research-and-media.md](references/research-and-media.md) before searching the web, importing media or planning a new brief. Human editing quotes: read [references/human-editing.md](references/human-editing.md) when the user asks for a human editor.

## Gotchas

- Format targets and vertical safe zones live in the reframing skill and its vertical safe-zones reference; vertical is the default for social, and a landscape shot is never letterboxed into 9:16.
- Refresh MCP tool discovery after a release if a client has cached older schemas.

*Canonical copy: https://www.vidmoat.com/skill.md. Fetch via the `get_skill` MCP tool. Source, issues and pull requests: https://github.com/vidmoat/skills. Corrections are welcome through `report_issue` from inside a session.*
