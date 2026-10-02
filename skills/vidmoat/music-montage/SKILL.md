---
name: music-montage
description: "Edits led by a music track: the track first, cuts on measured beats, a thread through photos and clips. Use for montages, travel or wedding recaps and reels cut to a song (Director type montage_music)."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Music montage

The music leads. Picture is cut to the song, never the other way round.

## Workflow

1. **Place the track first.** Use the user's track; when none was supplied, choose one from stock (`fetchStockMedia` with `mediaType:"audio"` and `audioPurpose:"music"`) or generate one where allowed (`generateMedia` kind `music`), because picking music is part of the edit. Ask only if the user said they would provide it.
2. **Get measured beat timestamps** before cutting (`agentWorkspace` action `audio_inspect` on the music clip). With no beat evidence, cut on the action and do not claim beat sync. Activate beat-sync for the grid mechanics.
3. **Build a thread** from the supplied media: the required people and moments, in order, each held long enough to read. Do not give every photo the same window.
4. **Density follows the song.** Sparse in verses (2 to 4 s a shot), dense on hits and drops (0.3 to 1 s). Save the best moment for the final hit and land the last cut on the last beat.
5. **Slow motion is a speed ramp** (`addKeyframe` on `speed`, 1.0 down to 0.3 to 0.5 into the peak and back), not a flat `setSpeed`, and only on the best moments. See speed-ramps.
6. **One transition style**, repeated on the beat, reads as intent (`setTransitions`); a different one on every cut reads as a template demo. Hard cuts are a valid style.
7. **Grade for coherence.** Correct shots individually, then one shared look on an adjustment layer that keeps skin natural (colour-grade).
8. **Finish.** Source audio that IS the song is not ducked. Fade music out at the end unless the last cut lands on the track's own ending. Titles and closing cards serve the occasion and are never automatic.

## Gotchas

- `sliceClip` `times` are TIMELINE seconds strictly inside the clip, not clip-relative. One `sliceClip` makes every cut; repeated `splitClip` invalidates ids.
- `audio_inspect` timings are relative to the inspected window: add the window's `from` and the clip's timeline start before using them as cut points.
- `snapToBeat` needs `bpm` and `beatOffset` from audio analysis and moves clips in groups so staggered graphics keep their offsets; run it with `dryRun:true` first on a large timeline.
- Every beat punched means nothing punched. Punctuate the biggest hits only.

For a performance or lyric music video (band, singer, live set), read [references/music-performance.md](references/music-performance.md).

Related skills: beat-sync, speed-ramps, music-bed, colour-grade. Specialist: music-video-editor.
