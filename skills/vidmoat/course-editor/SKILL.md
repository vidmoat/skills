---
name: course-editor
description: "Course Editor specialist, tagged @course-editor or consulted to turn lecture and screen recordings into course lessons: one objective per lesson of 6 minutes or less, zooms on the action, keywords on cue, recaps, captions and platform-ready exports. Use when the user tags @course-editor or asks to edit an online course, lesson or tutorial series."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Course Editor

Turns raw lesson recordings (talking head, screen capture or both) into short single-concept lessons that pass platform review and keep learners watching.

This is the brief the Course Editor gives when the user tags @course-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources, the research behind the 6-minute figure, and platform rules: `references/sources.md`.

## Brief

INTENT: one learning objective per lesson, shown as it is spoken.
SPEC: lessons of 6 min or less where the content allows (median engagement was near 100% under 6 min, about 50% at 9 to 12 min, about 20% past 12 min in a study of 6.9 million sessions); over about 10 min usually means two concepts. Udemy: at least 30 min across at least 5 lectures, 16:9 at 1280x720 or more (1920x1080 recommended), stereo audio heard in both channels. Skillshare: at least 10 min total, an intro of 2 min or less. Captions: at most 32 characters per line, 2 lines, each shown at least 2s. 2 to 3 keywords on screen at a time. A question or recap about every 5 min and a 15 to 30s recap at the end. Speech loudness -16 LUFS, true peak at or below -1 dBTP, consistent within 1 LU across lessons.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Each recording's duration and the number of distinct concepts in it (topic shifts in the transcript): that is how many lessons it should become.
· Speaking rate in words per minute, retakes ("let me try that again"), and dead air.
· Layout per segment: talking head, screen only, slides, or picture-in-picture.
· Clicks, typing and small text in screen recordings that need a zoom.
· Resolution, aspect and audio channel layout of every file (a voice on one channel fails Udemy's rule).
· The recurring elements across lessons (intro, lower thirds, outro) that must match.
CRAFT
· Split by concept, not by clock; restructure a long lecture rather than chopping it at even intervals.
· Remove retakes, dead air and tangents with cutRanges; no decorative music under explanation (coherence).
· Signal: keywords and arrows appear on the word, never seconds after (contiguity has the largest effect of Mayer's principles).
· Zoom to the active part of the screen for any click or small text, then zoom back out to re-establish (punchIn or keyframed scale), sparingly and consistently.
· Layout grammar: talking head full frame for framing and recap; screen full frame with a small picture-in-picture head (about 15 to 20% of the width) for demos (applyLayout).
· Put layout changes at concept boundaries: most viewer interaction peaks line up with visual transitions.
· End every lesson with a recap card of its 2 to 3 key points or a question.
· One template across the course: the same intro (5s or less), lower thirds (addTitle), colours and loudness in every lesson.
· Captions on every lesson (addCaptions), technical terms and code checked by hand.
DO NOT: ship a 20 to 40 min single take as one lesson; voice on one channel only; export below 720p or squeeze a vertical phone recording into a course; full sentences on screen identical to the narration beside a diagram; wave the mouse at things or auto-zoom constantly; mix lower-third styles or loudness between lessons; leave in "can you hear me" or references to a slide the learner cannot see.
ACCEPT: each lesson covers one titled objective in about 10 min or less (target 6), is 16:9 at 1280x720 or more with stereo audio in both channels, measures -16 plus or minus 1 LUFS, carries captions of at most 32 characters and 2 lines, ends on a recap or question, and shares the course's intro, outro and lower-third style.

## Gotchas

- The 6-minute figure measures watch completion, not learning; it is still the best-evidenced length guide, so split by concept and let concepts that need longer run longer.
- Burned-in captions cannot be turned off; prefer caption clips the user can restyle or remove, and do not stack them on top of designed keyword text.
- A zoom on a screen recording that is lower resolution than the export goes soft quickly; check the source size before zooming past 150%.
