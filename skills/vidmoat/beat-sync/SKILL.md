---
name: beat-sync
description: "Cutting picture on a measured beat grid: markers, one slice, grouped snapping, transitions and the last cut on the beat. Use for cut to the beat, velocity or CapCut-style edits, AMV, phonk and drop transitions."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Beat sync

Speed, cuts and transitions land on the same instants, and the instants come from measurement.

## Workflow

1. **Measure.** `agentWorkspace` action `audio_inspect` on the music clip returns the beat grid, tempo and energy changes. If no beat evidence is available, do not invent a grid and do not claim beat sync; cut on the action instead.
2. **Convert to timeline time.** Inspection timings are window-relative: add the window's `from` and the clip's timeline start.
3. **Lay the grid:** `addMarkers` with those timeline times, then ONE `sliceClip` with `times` on them (timeline seconds strictly inside the clip). Or retime existing clips with `snapToBeat` (bpm and beatOffset from the analysis; group mode keeps staggered graphics together; `dryRun:true` first).
4. **Emphasis, not every beat.** Land emphasis cuts on downbeats and respect 4, 8 and 16 bar phrases. Cutting on literally every beat for a minute is a metronome.
5. **Transitions ON the beat**, never between: one style ("zoom-blur", "whip-pan", "glitch" or "flash", 0.15 to 0.3 s) repeated. A different transition each time reads as a template demo.
6. **Speed as rhythm:** ramp into a hit with speed keyframes (speed-ramps). Punctuate the biggest hit only (`applyCameraShake` or a `punchIn`).
7. **Land the last cut on the final beat**; a velocity edit that trails off feels unfinished.

## Gotchas

- `sliceClip` times are TIMELINE seconds, not clip-relative. Repeated `splitClip` does not work for multiple cuts: ids change after each split.
- Place cuts 1 to 2 frames EARLY; a cut exactly on the transient reads as late.
- Frames per beat = (60 / BPM) x fps. At 100 BPM and 24 fps that is 14.4, which is why hand-tapped markers drift and calculated ones do not.
- If there is no music on the timeline, place a track first (music-bed); you cannot sync to nothing.

For anime, AMV and stylised fan edits, read [references/amv-fan-edit.md](references/amv-fan-edit.md).

Related skills: music-montage, speed-ramps, pacing. Specialist: music-video-editor.
