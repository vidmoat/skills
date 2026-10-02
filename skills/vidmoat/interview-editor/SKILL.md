---
name: interview-editor
description: "Interview & Podcast Editor specialist, tagged @interview-editor or consulted for a natural-sounding tightening plan: filler cut on the transcript, breaths kept, varied pauses, hidden splices. Use when the user tags @interview-editor or asks for this specialist's plan; a plain request to remove ums is dead-air-cleanup."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Interview & Podcast Editor

Cleans up podcasts, interviews and talking heads: filler, breaths, dead air, and cuts you cannot see.

This is the brief the Interview & Podcast Editor gives when the user tags @interview-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: tighten without making it sound machine-edited.
SPEC: exports are loudness-normalised to -14 LUFS integrated, -1.5 dBTP true peak, by default, so the job here is balance: every speaker matched to the same anchor. Pause floor 250-400ms between sentences; PRESERVE 600-900ms before a punchline, a reveal or an emotional answer.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Which clips carry silenceRegions: call trimSilence on those rather than hand-cutting.
· From the transcript: filler tokens and false starts, as ranges.
· Each speaker's source loudness: agentWorkspace audio_inspect returns integratedLufs and truePeakDbtp for a source window. The gap between speakers is what compress and volume must close.
· Clip count and whether angles exist. One clip means punch-ins and dissolves are your only masking; two or more means a multicam switch.
CRAFT
· Cut on the transcript: filler, false starts, restatements. A ripple cut closes the gap, so a removal leaves no silence; where a gap stays open, fill it with a quiet stretch of the same recording (detachAudio, then an audio clip of that source at a measured pause). No command makes room tone; never claim you laid it.
· BREATHS ARE NOT FILLER. Deleting them makes speech sound robotic. Keep them, especially the breath before an emphatic line; it is the anticipation.
· Uniform pause-crushing is the tell of an auto-editor. Vary it deliberately.
· Hide the splice on a single camera by ROTATING technique: a 10-15% punchIn (1.10-1.15) inside the take, which reads as emphasis rather than a new shot, a 4-6 frame dissolve, a cutaway, a noddy. The same punch-in twenty times is worse than the jump cuts were.
· Multicam: switch on the speaker change but lead the audio by 6-12 frames so picture arrives with the voice; hold at least 3s before switching back.
· Markers at every topic change. An intro states the guest's claim, not their CV.
DO NOT: delete breaths; use one masking technique throughout; crush every pause equally; clip a laugh at its head; leave two speakers at different loudness.
ACCEPT: agentWorkspace review mode audio on the edited mix shows no speaker clearly louder than another and no clipping, no visible jump cut, and the protected pauses survive.

## Gotchas

- trimSilence uses the clip's measured silenceRegions and measures them when missing; do not hand-pass guessed regions.
- normalize is peak, not loudness, so two speakers normalised to the same peak can still differ by 15 dB. Level them with compress and volume, and quote audio_inspect's source readings rather than a mix figure you did not measure.
