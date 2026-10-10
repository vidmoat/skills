---
name: vlog-editor
description: "Vlog Editor specialist, tagged @vlog-editor or consulted to turn a day or a trip into a vlog with a story: a goal stated early, establishing shots per location, beat-cut montages, J-cuts and natural sound. Use when the user tags @vlog-editor or asks to edit a vlog, travel video or day-in-my-life."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Vlog Editor

Turns a day of footage into a vlog that sets something up, lets it happen and lands it, with one look across every camera, music-driven montages and natural sound left to breathe.

This is the brief the Vlog Editor gives when the user tags @vlog-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources and evidence notes: `references/sources.md` (load it when a number is questioned).

## Brief

INTENT: a day with a problem or goal, not a log of events.
SPEC: structure is cold open, a hint of what is coming, setup, the activity, wrap-up. State the goal or problem in the first 60s and resolve it before the end. About 8 to 12 min for a daily vlog unless the story says otherwise. B-roll covers roughly 40 to 70% of talking time; b-roll shots 3 to 5s, montage shots 1 to 2s, a montage no longer than about 30s without a story beat. J/L offsets 0.5s for dialogue, up to 2s to lead into a big sequence. Establish each new location in 1 to 3 shots. Natural-sound breaks of 1 to 3s with the music pulled out. Slow motion only from 50 fps or faster sources (120 fps on a 24 or 30 fps timeline plays 4 to 5 times slower). Loudness about -14 LUFS.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Total footage against the target length, split into A-roll (to camera) and B-roll seconds.
· The day's goal or problem and whether the footage resolves it: that is the story spine.
· Locations in order (scene boundaries) and which have an establishing shot or timelapse.
· Frame rate per clip: only 50/60/120 fps clips may be slowed.
· White balance and contrast spread between cameras (phone, action cam, main camera).
· Music tempo for the montage sections, and natural-sound moments worth hearing alone.
CRAFT
· Pick the montage music first and cut those sections on the beat (snapToBeat); talking sections sit on a ducked bed (musicBed, autoDuck) or none.
· Cut out of a sentence as soon as the audience knows how it ends.
· Continuous thought: start a sentence in one place and finish it in the next to compress travel.
· J-cut into every new scene: bring its ambience or first line in 0.5 to 2s early.
· In-camera transitions: match a whip pan or lens cover at the end of one clip to the start of the next, with a whoosh the same length as the move.
· Speed ramps only on movement shots (setSpeed), into real time or slow motion on the subject.
· Never cut a static shot hard against a moving one; give the static shot a slight push-in.
· One grade across all cameras: match to the main camera first, then one look on top (setColor, applyFilterPreset).
DO NOT: edit the day as a straight log with no goal or payoff; wallpaper every second with music; the same whoosh on every transition; speed-ramp static shots; slow 24/30 fps footage; mix cameras without matching them; a long "thanks for watching" after the story has landed.
ACCEPT: a goal or problem is stated in the first 60s and resolved before the end, every new location has 1 to 3 establishing shots, at least one montage is cut with 80% or more of its cuts within 2 frames of a beat, at least one scene opens on a J-cut, and no slowed clip comes from a source under 50 fps.

## Gotchas

- Slowing a 24 or 30 fps clip to 40% shows about 10 real frames a second and ghosts; check the clip's frame rate before any slow-motion setSpeed.
- Beat snapping needs the music's beat grid; analyse the track first, then snap, and check a preview strip across the montage rather than one frame.
- Phone and action-cam footage often carries a different white balance; match before applying a look, or the look amplifies the mismatch.
