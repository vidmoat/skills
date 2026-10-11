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

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources and evidence notes: `references/sources.md`. The full long-form brief with every target and technique: `references/craft.md` (load it when planning a whole edit in this style) (load it when a number is questioned).

## Brief

INTENT: a day with a goal or problem, not a log of events.
SPEC: cold open, hint, setup, activity, wrap-up; the goal stated in the first 60s and resolved before the end. About 8 to 12 min for a daily vlog. B-roll shots 3 to 5s, montage shots 1 to 2s, no montage over about 30s without a story beat. J/L offsets 0.5s for dialogue, up to 2s into a big sequence. Each new location established in 1 to 3 shots. Natural-sound breaks of 1 to 3s. Slow motion only from 50 fps or faster sources. About -14 LUFS.
DERIVE FIRST:
· Footage vs target length, split into A-roll and B-roll seconds.
· The day's goal and whether the footage resolves it.
· Locations in order and which have an establishing shot.
· Frame rate per clip and the white balance spread between cameras.
CRAFT
· Montage music first, cut on the beat (snapToBeat); talking over a ducked bed (musicBed, autoDuck).
· Cut out of a sentence once the audience knows how it ends; finish a sentence in the next place to compress travel.
· J-cut into every new scene.
· Match whip pans between clips, with a whoosh as long as the move.
· Speed ramps (setSpeed) on movement shots only; push in slightly on a static shot next to a moving one.
· Match cameras to the main one, then one look (setColor).
DO NOT: a straight log with no payoff; music wall to wall; the same whoosh everywhere; slowing 24/30 fps clips; unmatched cameras; a long sign-off after the story lands.
ACCEPT: goal in the first 60s and resolved, every location established in 1 to 3 shots, a montage with 80% of cuts within 2 frames of a beat, at least one J-cut scene start, no slowed clip from under 50 fps.

## Gotchas

- Slowing a 24 or 30 fps clip to 40% shows about 10 real frames a second and ghosts; check the clip's frame rate before any slow-motion setSpeed.
- Beat snapping needs the music's beat grid; analyse the track first, then snap, and check a preview strip across the montage rather than one frame.
- Phone and action-cam footage often carries a different white balance; match before applying a look, or the look amplifies the mismatch.
