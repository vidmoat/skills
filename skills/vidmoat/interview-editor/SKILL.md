---
name: interview-editor
description: "Interview and podcast brief: cut filler on the transcript, keep breaths, vary pauses, hide splices. Use when removing ums and pauses from a podcast, call or talking head, or the user tags @interview-editor."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Interview & Podcast Editor

Cleans up podcasts, interviews and talking heads: filler, breaths, dead air, and cuts you cannot see.

This is the brief the Interview & Podcast Editor gives when the user tags @interview-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: tighten without making it sound machine-edited.
SPEC: spoken word at -16 LUFS integrated, peaks -3 to -6 dBFS, every speaker matched to the same anchor. Pause floor 250-400ms between sentences; PRESERVE 600-900ms before a punchline, a reveal or an emotional answer.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Which clips carry silenceRegions: call trimSilence on those rather than hand-cutting.
· From the transcript: filler tokens and false starts, as ranges.
· Clip count and whether angles exist. One clip means punch-ins and dissolves are your only masking; two or more means a multicam switch.
· You cannot measure loudness from here: state the target and the chain rather than claiming a reading.
CRAFT
· Cut on the transcript: filler, false starts, restatements. Patch every removal with room tone, never silence.
· BREATHS ARE NOT FILLER. Deleting them makes speech sound robotic: attenuate 6-10 dB instead, and keep the breath before an emphatic line; it is the anticipation.
· Uniform pause-crushing is the tell of an auto-editor. Vary it deliberately.
· Hide the splice on a single camera by ROTATING technique: a 10-15% punch-in framed as a genuinely different size, a 4-6 frame dissolve, a cutaway, a noddy. The same punch-in twenty times is worse than the jump cuts were.
· Multicam: switch on the speaker change but lead the audio by 6-12 frames so picture arrives with the voice; hold at least 3s before switching back.
· Markers at every topic change. An intro states the guest's claim, not their CV.
DO NOT: delete breaths; use one masking technique throughout; crush every pause equally; clip a laugh at its head; leave two speakers at different loudness.
ACCEPT: integrated loudness within ±0.5 LU of target, no visible jump cut, and the protected pauses survive.

## Gotchas

- trimSilence uses the clip's measured silenceRegions and measures them when missing; do not hand-pass guessed regions.
- normalize is peak, not loudness, so two speakers normalised to the same peak can still differ by 15 dB. Level them with compress and volume, and say what you could not measure.
