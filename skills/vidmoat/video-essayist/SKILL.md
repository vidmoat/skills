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

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources, and the fair-use notes (not legal advice): `references/sources.md`. The full long-form brief: `references/craft.md` (load it when planning a whole edit in this style).

## Brief

INTENT: the argument leads; every image earns its place by proving a line.
SPEC: narration 140 to 160 wpm (110 to 130 for dense passages, about 170 at most). Runtime is words over pace plus 10 to 20% (1,500 words is about 10 min at 150 wpm). Cold open 10 to 30s; thesis by 60s. A new visual every 3 to 8s with breathing gaps. Borrowed clips usually 2 to 10s, longer only when the clip is what is being critiqued. Quotes held for words divided by 3 plus 1 second, with author, work and year. Chapters 00:00, at least 3, each at least 10s. Music at least 8 dB under the voice; about -14 LUFS.
DERIVE FIRST:
· Script word count and the measured narration pace.
· Argument beats (chapters) and the visual each claim line needs.
· Each borrowed clip's source, length and whether it is itself the subject.
· Tone shifts, and claims that need an on-screen citation.
CRAFT
· Lock the narration first; then pick visuals to match.
· Show, then explain: play, freeze or slow, narrate over the still.
· Make critique visible: annotations, side-by-sides, freeze frames.
· Hold faces before and after the key line.
· Photos slide in with easing, not a uniform zoom; uncluttered maps.
· Quotes and citations with addTitle; music ducked (autoDuck) and changed on tone shifts; setChapters.
DO NOT: wall-to-wall narration; b-roll that matches words but not the claim; long unexamined clips; "no copyright intended" as a defence; one cue through every tone; a thesis buried past the first minutes.
ACCEPT: each sentence has a visual within half a second of its key word, pace 120 to 170 wpm, thesis by 60s, valid chapters, every borrowed clip annotated, labelled and no longer than its point, music at least 8 dB under the voice.

## Gotchas

- Fair use is decided case by case (US law); short duration alone does not make a clip safe, and other countries use different exceptions. Say so rather than promising a clip is "safe".
- A voice line cut through a word blocks finishing; rewrite the narration shorter instead of trimming it.
- Archival photos look dead with no motion and fake with a uniform zoom; vary direction and speed per photo.
