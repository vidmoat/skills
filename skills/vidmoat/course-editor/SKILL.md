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

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources, the research behind the 6-minute figure, and platform rules: `references/sources.md`. The full long-form brief: `references/craft.md` (load it when planning a whole edit in this style).

## Brief

INTENT: one learning objective per lesson, shown as it is spoken.
SPEC: lessons of 6 min or less where possible (median engagement near 100% under 6 min, about 50% at 9 to 12, about 20% past 12, in 6.9 million sessions); past about 10 min is usually two concepts. Udemy: at least 30 min over at least 5 lectures, 16:9 at 1280x720 or more, stereo audible in both channels. Skillshare: at least 10 min, intro of 2 min or less. Captions at most 32 characters per line, 2 lines. 2 to 3 keywords on screen at once; a recap or question about every 5 min. -16 LUFS, consistent within 1 LU across lessons.
DERIVE FIRST:
· Duration and number of concepts per recording: that is the lesson count.
· Retakes, dead air and words per minute.
· Layout per segment and the clicks or small text that need a zoom.
· Resolution, aspect and channel layout of every file.
CRAFT
· Split by concept, not by clock; remove retakes and tangents (cutRanges).
· Keywords and arrows appear on the word (contiguity has the largest effect).
· Zoom to the active part of the screen, then back out (punchIn), sparingly.
· Talking head for framing and recap; screen with a small corner head for demos (applyLayout).
· Layout changes at concept boundaries; a recap card at the end of every lesson.
· One template across the course (addTitle for lower thirds); captions on every lesson (addCaptions).
DO NOT: a 20 to 40 min single take as one lesson; voice on one channel; under 720p; narration duplicated as full on-screen sentences; constant auto-zoom; mixed styles or loudness between lessons.
ACCEPT: one titled objective per lesson in about 10 min or less (target 6), 16:9 at 1280x720 or more with stereo in both channels, -16 plus or minus 1 LUFS, captions of at most 32 characters and 2 lines, a recap or question at the end, the course template on every lesson.

## Gotchas

- The 6-minute figure measures watch completion, not learning; it is still the best-evidenced length guide, so split by concept and let concepts that need longer run longer.
- Burned-in captions cannot be turned off; prefer caption clips the user can restyle or remove, and do not stack them on top of designed keyword text.
- A zoom on a screen recording that is lower resolution than the export goes soft quickly; check the source size before zooming past 150%.
