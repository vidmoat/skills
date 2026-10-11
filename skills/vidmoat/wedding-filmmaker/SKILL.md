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

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources and evidence notes: `references/sources.md`. The full long-form brief with every target and technique: `references/craft.md` (load it when planning a whole edit in this style).

## Brief

INTENT: words first, music second, chronology last.
SPEC: highlight 3 to 7 min, teaser 60 to 90s, vertical teaser 30 to 60s at 9:16. 8 to 15 soundbites in 7 min, at most 2 to 3 speech speakers. Five acts for 7 min (scale down): open 0:00 to 1:00, build to 3:00, ceremony and climax to 5:00, resolution to 6:30, a 1 to 2 sentence final line. Two tracks: slow for intro and ceremony, upbeat for the reception. Slow motion only from 50 fps or faster sources. Music ducked 6 to 12 dB under speech, at least 7 LU below it; about -14 LUFS. Vertical: faces and text inside x 65 to 1015, y 270 to 1250.
DERIVE FIRST:
· Transcribed vows, speeches and letters, each line scored for emotion and clean audio.
· The cleanest audio source per moment, and which clips have audio.
· Frame rate per clip; key moments covered (first look, vows, kiss, entrance, first dance, speeches).
· Skin per camera on the vectorscope, dress highlights clipped or not, and where the music swells.
CRAFT
· Radio edit from the spoken words first; the best vow line for the climax.
· Order for story: open on details, a laugh or the venue, not the processional.
· J/L cuts carry the vows; key moments land on musical events.
· autoDuck the music; light cleanup passes (removeNoise).
· Slow motion (setSpeed) only on peaks; grade last with skin on the skin line and the dress below clipping (setColor).
· The vertical teaser is its own edit (reframeAuto), hook in 1 to 3s.
DO NOT: 30 soundbites or full speeches; one track under vows and the dance; jump cuts; slowed 24 fps; light leaks everywhere; unlicensed popular songs; music over the vows; a clipped dress.
ACCEPT: runtime fits the deliverable, 8 to 15 clear soundbites with music at least 7 LU under, the kiss and vows present, every slowed clip from 50 fps or more, no clipped dress, consistent skin.

## Gotchas

- A wedding song a couple loves is usually not licensed for online use; use the built-in licence-safe music or a track the user confirms they licensed.
- Vow audio from a camera mic across a room is often unusable; check for a cleaner source before cutting the spine around a line.
- Vertical teasers made by cropping the horizontal film cut off one partner in two-shots; reframe per shot.
