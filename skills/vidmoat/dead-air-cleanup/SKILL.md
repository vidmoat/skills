---
name: dead-air-cleanup
description: "Removing pauses, silences, filler and retakes without a machine-edited sound: trimSilence, word-timed cuts, breathing room. Use for cut the dead air, remove silences, ums and uhs, bad takes or jump-cut edits."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.1.0"
  owner: "vidmoat"
  category: "craft"
---

# Dead-air cleanup

Tighten without making it sound machine-edited, and only when the user asked for shortening.

## Workflow

1. **Silences:** `trimSilence` on the clip uses its measured `silenceRegions` (measured for you when missing). Do not hand-pass guessed regions. On MCP, `analyze_dead_air` ranks removal ranges by confidence and already leaves about 120 ms of air each side; to reach the 150 to 300 ms below, shrink each range by a further 30 to 180 ms per side before cutting.
2. **Filler and retakes:** transcribe, then `cutRanges` with word-timed ranges in TIMELINE seconds, `ripple:true` so the gaps close.
3. **Breathing room:** leave 150 to 300 ms around speech; keep 250 to 400 ms between sentences and 600 to 900 ms before a punchline, reveal or emotional answer. Vary pause lengths: uniform crushing is the tell of an auto-editor.
4. **Breaths are not filler.** Keep them, especially before an emphatic line.
5. **Hide the jumps** by rotating techniques (`punchIn`, a cutaway, a 4 to 6 frame dissolve). The same punch-in twenty times is worse than the jump cuts.
6. **Review every join** with `agentWorkspace` action `review` mode `speech` (at most 30 s per request): no word crossing a cut, every thought complete, the ending makes sense.

## Gotchas

- Silence detection is evidence, not permission. Captions or a "podcast look" alone do not authorize cutting.
- Transcript word times on a clip are clip-relative; `cutRanges` takes timeline seconds.
- `trimSilence` keeps the original id on the first kept segment and returns new ids for the rest; later commands must use them.
- Duration-changing edits come before captions and timed overlays.
- A voice line cut through a word blocks the run from finishing.

Related skills: talking-head, pacing. Specialist: interview-editor.
