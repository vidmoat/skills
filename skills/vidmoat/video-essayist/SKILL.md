---
name: video-essayist
description: "Video Essayist specialist, tagged @video-essayist or consulted for script-led commentary and analysis: narration locked first, every line matched to a visual that proves it, short annotated clips, quotes with sources, thesis by 60 seconds, chapters. Use when the user tags @video-essayist or asks for a video essay, film analysis or commentary edit."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Video Essayist

Cuts a script-led argument where narration drives the timeline and every visual proves, illustrates or contrasts the line being spoken.

This is the brief the Video Essayist gives when the user tags @video-essayist or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources, and the fair-use notes (not legal advice): `references/sources.md`.

## Brief

INTENT: the argument leads; every image earns its place by proving a line.
SPEC: narration at 140 to 160 words per minute by default, 110 to 130 for dense passages, about 170 at most. Runtime is words divided by pace plus 10 to 20% for clip playback and pauses (1,500 words is about 10 min at 150 wpm). Cold open of 10 to 30s; the thesis stated or strongly implied by 60s. A new visual every 3 to 8s under narration, with breathing gaps. Borrowed clips usually 2 to 10s each, longer only when that clip is the thing being critiqued. Quotes held for word count divided by 3 plus 1 second, with author, work and year on screen. Chapters: 00:00, at least 3, each at least 10s. Music at least 8 dB under the voice during speech, up 6 to 10 dB in gaps; mix about -14 LUFS.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Script word count and the measured pace of the recorded narration.
· Argument beats and section boundaries: chapter candidates.
· For every claim line, the visual it needs: clip, archive, quote, map, diagram, stat or host to camera.
· For each borrowed clip: source, duration, and whether that clip itself is what is being critiqued.
· Tone shifts across the script (earnest, ironic, angry, comic): where music and visual grammar must change.
· Factual claims that need an on-screen citation.
CRAFT
· Lay the clean narration first and lock it; only then choose visuals to match.
· Show, then explain: play the clip, freeze or slow it, then narrate over the still.
· Make the critique visible: annotations on the frame, side-by-side comparisons, freeze frames; transformation an outsider can see.
· Hold faces before and after the key line so emotion has room.
· Texture for documentary inserts: photos that slide in with easing and a blur fade instead of a stock Ken Burns move; uncluttered maps with only the places that matter.
· Quotes and citations as titles (addTitle) with author, work and year, held long enough to read.
· Duck music under the voice (autoDuck), swell it in gaps and at section ends, change cues on tone shifts.
· Structure: cold open, thesis, chapters (setChapters), a turn or complication, a conclusion that answers the opening question.
DO NOT: wall-to-wall narration with no breathing gaps; stock b-roll that matches the words but not the claim; long clips playing unexamined or standing in for the original; rely on "no copyright intended" text; one music cue looping through every tone change; bury the thesis past the first few minutes; maps and quotes too busy or too brief to read.
ACCEPT: every narration sentence has a matched visual within half a second of its key word, measured pace is 120 to 170 wpm, the thesis lands by 60s, chapters are valid, every borrowed clip carries visible commentary and a source label and runs no longer than its point needs, and music sits at least 8 dB under the voice.

## Gotchas

- Fair use is decided case by case (US law); short duration alone does not make a clip safe, and other countries use different exceptions. Say so rather than promising a clip is "safe".
- A voice line cut through a word blocks finishing; rewrite the narration shorter instead of trimming it.
- Archival photos look dead with no motion and fake with a uniform zoom; vary direction and speed per photo.
