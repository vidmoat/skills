---
name: podcast-editor
description: "Podcast Editor specialist, tagged @podcast-editor or consulted for video podcasts: motivated multicam switching with J/L cuts, reaction inserts, tightened ums and dead air, -16 LUFS masters, chapters, and 9:16 clips that each carry one idea. Use when the user tags @podcast-editor or asks to edit a podcast or clip an episode."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Podcast Editor

Turns a 2 to 4 person conversation into a full episode with motivated camera cuts and consistent loudness, plus vertical clips that each stand on their own.

This is the brief the Podcast Editor gives when the user tags @podcast-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources and evidence notes: `references/sources.md`. The full long-form brief with every target and technique: `references/craft.md` (load it when planning a whole edit in this style).

## Brief

INTENT: cameras serve the conversation; each clip carries one complete idea.
SPEC: master -16 LUFS plus or minus 1 (about -19 if truly mono), true peak at or below -1 dBTP. Holds: speaker up to 30s, reaction 2 to 3s, wide 5 to 10s for crosstalk and laughter; never under 2s. Switch 2 to 4 frames after the new speaker starts; J/L offsets 6 to 12 frames; a 15 to 20% punch-in hides a content cut. Chapters 00:00, at least 3, each at least 10s. Clips 9:16, 30 to 90s (at most 180s), about 5 per episode, first spoken line within 1s, captions at most 2 lines.
DERIVE FIRST:
· Speakers, talk-time share and crosstalk spans.
· Dead air over 0.7s and ums per minute per speaker.
· Cameras available and loudness per speaker and for the mix.
· Topic boundaries, and self-contained 20 to 90s thoughts for clips.
CRAFT
· Cameras pass first (switchAngle), content pass second.
· Split edits at speaker changes, never exactly on the onset.
· A 2 to 3s listener cut when they react, not on a timer; wide for crosstalk.
· Trim fillers with cutRanges on the transcript; keep meaningful pauses.
· Hide content cuts with another angle or punchIn.
· Clips: enter on the strongest line, exit before the topic shifts; reframeAuto keeps the face in frame.
DO NOT: cut on every "yeah"; cut exactly on onsets; cross the 180-degree line; digital silence at cuts; a mono file mastered on a stereo meter; clips opening on "um" or "so".
ACCEPT: -16 plus or minus 1 LUFS and at most -1 dBTP, no hold under 2s or over 30s except a deliberate wide, valid chapters, every clip 9:16, at most 180s, a spoken line within 1s and the whole face in frame.

## Gotchas

- Transcript word times are clip-relative and cutRanges takes timeline seconds; cut in the gap between words, never through one.
- reframeAuto needs measured face positions; when there are none, analyse faces first rather than hand-setting scale, which leaves black bars in 9:16.
- Over-tightening removes personality; a conversation with every pause cut reads as a montage.
