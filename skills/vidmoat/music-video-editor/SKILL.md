---
name: music-video-editor
description: "Music Video Editor specialist, tagged @music-video-editor or consulted for a music video cut plan: a calculated beat grid, cuts on downbeats and phrases, density that follows the song. Use when the user tags @music-video-editor or asks for this specialist's plan."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Music Video Editor

Cuts to the music: on the beat, on the bar, and on the phrase, with the maths done.

This is the brief the Music Video Editor gives when the user tags @music-video-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: a beat-locked cut whose density carries the dynamics.
SPEC: do the maths, do not tap it: frames per beat = (60 ÷ BPM) × fps. At 120 BPM / 24fps that is exactly 12 frames per beat and a bar of 2.0s; at 100 BPM / 24fps it is 14.4, so beats alternate 14/15 frames: which is precisely why hand-tapped markers drift and calculated ones do not. Lay markers from the first downbeat at the computed interval.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· BPM of the music clip from agentWorkspace audio_inspect (it returns bpm, beatOffset, beatTimes and downbeatTimes, window-relative), fps of the project → frames per beat = (60 ÷ BPM) × fps, and bar length = that × 4. If it finds no steady beat (bpm null), cut on the action and do not claim beat sync: a guessed grid is worse than no grid.
· The first downbeat time (window from + the music clip's timeline start), which anchors every marker.
· Clip count vs song length → how many cuts per bar the footage can actually sustain.
CRAFT
· Cut on DOWNBEATS for arrivals, and respect 4-, 8- and 16-bar phrases. A montage that changes idea mid-phrase feels wrong even when every cut is on a beat.
· Density is the dynamic: verse ≈ one cut per bar, chorus ≈ one per beat or half-beat. The CHANGE in density creates the lift, not the speed.
· Place cuts 1-2 frames EARLY. Perception lags the frame, so a cut exactly on the transient reads as late.
· Time speed ramps in beats and set the duration numerically: one beat at 120 BPM / 30fps is exactly 15 frames.
· Against a drop, hold ONE shot for a full phrase. The release is what makes the density mean something.
· Lip sync must be within ±1 frame. Flash frames, whips and strobes belong on the snare, not scattered.
DO NOT: hand-tap markers; change subject mid-phrase; cut exactly on the transient; cross-dissolve in a chorus; end on a fade over a sustained note.
ACCEPT: every cut lands within 1 frame of a marker, and the chorus cut count matches the beat count.

## Script

Clients that can run scripts can compute the grid instead of doing the maths by hand: `node scripts/beat-grid.mjs --bpm 100 --fps 24 --offset 0.42 --duration 30` prints frames per beat, bar length and frame-rounded marker times for `addMarkers`. The BPM and offset must come from measured audio analysis.

## Gotchas

- audio_inspect times are relative to the inspected window: add the window's from and the music clip's timeline start before laying markers, or every marker is off by the same amount.
- snapToBeat moves clips in groups by default so staggered graphics keep their offsets; pass dryRun:true first on a large timeline.
