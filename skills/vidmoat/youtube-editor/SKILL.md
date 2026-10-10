---
name: youtube-editor
description: "YouTube Editor specialist, tagged @youtube-editor or consulted to cut long-form YouTube: payoff on screen by 0:30, re-engagement beats at 3:00 and 6:00, punch-ins over jump cuts, chapters and an end screen. Use when the user tags @youtube-editor or asks to edit a video for YouTube."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# YouTube Editor

Cuts long talking or story footage into a YouTube video that pays off its title in the first 30 seconds, keeps adding something new, and ends on a clean end screen.

This is the brief the YouTube Editor gives when the user tags @youtube-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources and which claims are evidence versus folklore: `references/sources.md` (load it when the user asks why, or when a number is disputed). The full long-form brief: `references/craft.md` (load it when planning a whole edit in this style).

## Brief

INTENT: pay off the title fast, then keep paying it off; structure beats raw cut speed.
SPEC: the promised subject on screen by 0:30. No branded intro (or under 5s). A visual change at least every 15s in talking stretches; shots about 2 to 6s. Re-engagement beats near 3:00 and 6:00; long explanations in the back half. Chapters: 00:00, at least 3, each at least 10s. End screen: the last 5 to 20s, room for up to 4 elements. About -14 LUFS, true peak at or below -1 dBTP, 16:9 at source fps.
DERIVE FIRST:
· Raw duration vs target, and the share to remove (45 min into 12 min removes about 73%).
· The second the title/thumbnail promise appears; if after 30s, flash it forward as the cold open.
· Silences over 0.4s and retakes; the longest talking span without a visual change.
· Topic boundaries (chapters) and where the last real sentence ends (end-screen window).
CRAFT
· Cold open on the payoff or stakes in the first 5s.
· Tighten A-roll first (cutRanges), then b-roll, text, music, sound, colour.
· punchIn 110 to 120% to hide jump cuts within a take.
· B-roll follows the words; hold the face for emotion and claims.
· Stair-step the stakes; music changes at section boundaries (autoDuck under speech).
· setChapters on real topic boundaries.
DO NOT: greeting or channel intro first; an opening the thumbnail did not promise; a whooshed zoom every 1.5s for a whole video; 30s of talking head with no change; signal the end early; master above -14 LUFS.
ACCEPT: promise on screen by 0:30, no talking span over 15s without a visual change, a new beat by 3:00, valid chapters, the last 5 to 20s end-screen ready, -14 plus or minus 1 LUFS.

## Gotchas

- The 1.3s "retention editing" cut rate is outdated as a default; MrBeast publicly slowed his own videos in 2024. Measure the creator's own retention instead of copying a cut rate.
- Transcript word times are clip-relative and cutRanges takes timeline seconds. Convert, and cut in the gap between words, never through one.
- A chapter list that breaks any rule (no 00:00, fewer than 3, one under 10s) silently disables chapters on YouTube.
- A 16:9 video stays long-form at any length; reframing to 9:16 makes a Short, which needs its own cut (use reframeAuto, never hand-set scale, which leaves black bars).
