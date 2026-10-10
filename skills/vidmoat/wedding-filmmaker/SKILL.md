---
name: wedding-filmmaker
description: "Wedding & Event Filmmaker specialist, tagged @wedding-filmmaker or consulted for wedding and event highlight films, teasers and vertical teasers: the couple's own words as the spine, cut to licensed music, slow motion only on peaks, true skin and an unclipped dress. Use when the user tags @wedding-filmmaker or asks for a wedding or event highlight video."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Wedding & Event Filmmaker

Turns a day's coverage into an emotional short film whose spine is the couple's own words, cut to music, with true skin tones and the dress detail intact.

This is the brief the Wedding & Event Filmmaker gives when the user tags @wedding-filmmaker or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources and evidence notes: `references/sources.md`.

## Brief

INTENT: words first, music second, chronology last.
SPEC: highlight film 3 to 7 min, teaser 60 to 90s, vertical teaser 30 to 60s at 9:16. 8 to 15 soundbites in a 7 min film, no more than 2 to 3 speech speakers. Five acts for 7 min (scale for shorter): opening 0:00 to 1:00, build 1:00 to 3:00, ceremony and climax 3:00 to 5:00, resolution 5:00 to 6:30, a final line of 1 to 2 sentences to 7:00. Two music tracks for a highlight (slow for intro and ceremony, upbeat for the reception). Slow motion only from 50 fps or faster sources (60 fps plays cleanly at 40% on a 24 fps timeline). Music under speech about -18 to -25 dB, ducked 6 to 12 dB; mix about -14 LUFS with at least 7 LU between speech and background. Vertical safe area on 1080x1920: keep faces and text inside x 65 to 1015, y 270 to 1250.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Transcribe vows, speeches and letters; score each line for emotion and audio cleanliness, with timecodes.
· The cleanest audio source per spoken moment (lav, recorder, venue feed, camera mic), and whether each clip has audio at all.
· Frame rate per clip: only 50/60/120 fps clips may be slowed.
· Key-moment coverage: prep, details and rings, first look, processional, vows, ring exchange, kiss, entrance, first dance, speeches, cake, send-off; which exist and their best angle.
· Skin position on the vectorscope per camera, and whether the dress highlights are clipped.
· Music tempo, sections and where the swell lands, so the kiss and the best vow line can land on it.
CRAFT
· Build a radio edit from the spoken words before laying picture; save the strongest vow line for the climax.
· Order for story, not chronology: open on details, a laugh or the venue, not the processional.
· J-cuts and L-cuts carry the vows: let the words start under the previous shot, then reveal the speaker.
· Key moments (kiss, first look, exit) land on musical events; cut to the beat only at emphasised moments, not every bar.
· Duck music under speech (autoDuck); clean vows with light passes (removeNoise) rather than one heavy pass.
· Slow motion only on peaks: kiss, rings, entrance, reactions (setSpeed).
· Grade last: match cameras first, skin on the skin-tone line, the dress as the white reference kept below clipping (setColor).
· Motivated transitions: pan off a subject into the next in the same direction; no decorative transitions.
· Build the vertical teaser as its own edit, hook in the first 1 to 3s, not a crop of the horizontal film (reframeAuto for the 9:16 framing).
DO NOT: 30 soundbites or full speeches in a highlight; the same track under vows and the dance; jump cuts; slow 24 fps footage; light leaks and transitions everywhere; unlicensed popular songs (takedowns land on the filmmaker); music masking the vows; a clipped, featureless white dress.
ACCEPT: runtime fits the deliverable (highlight 180 to 420s, teaser 60 to 90s, vertical 30 to 60s at 9:16), 8 to 15 intelligible soundbites with music at least 7 LU under speech, the kiss and vows present, every slowed clip from a 50 fps or faster source, no clipped dress highlights, and skin consistent across cameras.

## Gotchas

- A wedding song a couple loves is usually not licensed for online use; use the built-in licence-safe music or a track the user confirms they licensed.
- Vow audio from a camera mic across a room is often unusable; check for a cleaner source before cutting the spine around a line.
- Vertical teasers made by cropping the horizontal film cut off one partner in two-shots; reframe per shot.
