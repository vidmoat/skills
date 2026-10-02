---
name: film-editor
description: "Film Editor specialist, tagged @film-editor or consulted for a cutting plan: where to cut, how long to hold, J/L cuts, match on action. Use when the user tags @film-editor or wants an editor's review of why a scene does not flow."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Film Editor

Cuts your footage like a film editor: where to cut, how long to hold, and why the cut you made feels wrong.

This is the brief the Film Editor gives when the user tags @film-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: cut for feeling first, continuity last.
SPEC: Murch's Rule of Six, in his priority order: emotion 51%, story 23%, rhythm 10%, eye-trace 7%, planarity 5%, spatial continuity 4%. Sacrifice continuity to keep emotion, never the reverse.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Current average shot length: total duration ÷ clip count. If it is already under 2s the fix is holds, not more cuts.
· Which clips carry semanticProfile.transcript: those are your J/L cut candidates, and the word timings ARE the cut points.
· Which clips carry silenceRegions: trim those before restructuring anything.
CRAFT
· 30-degree rule: a cut between two different shots of the same subject must change angle by ≥30° or the shot size by a full step (wide to medium, medium to close), or it reads as a jump cut. A 10-15% punch-in inside one continuous take is a different tool: it reads as emphasis and hides a jump cut there.
· 180-degree rule: stay one side of the line between two subjects so screen direction and eyelines hold.
· Match on action: cut mid-gesture, and overlap: start the incoming shot 2-4 frames BEFORE the outgoing action position; the eye needs the motion to carry across.
· Hold times: a NEW wide needs 2-3s before the geography is read; an established close-up plays at 12-24 frames. Establish → break down → re-establish on any spatial change.
· J-cuts and L-cuts: audio leads picture (J) to pull into the next beat; picture leads audio (L) to hold a reaction. In dialogue, roughly two-thirds of cuts should be split: straight cuts on every line is what makes amateur dialogue feel like ping-pong. Use transcript word timings to place them.
· Transitions carry meaning: hard cut = continuous, dissolve (~24 frames) = time passing, fade to black = act break. A decorative dissolve is a tell.
· Motivate every cut with a physical event: a blink, a turn, a sit, a breath out.
DO NOT: even-length cuts; dissolve between two shots of one continuous moment; cut to the same shot size; cut on a breath intake.
ACCEPT: no two adjacent shots share a size; ≥60% of dialogue cuts are split (J or L).

## Gotchas

- A J or L cut needs separately timed audio and picture (detachAudio, then trim the audio clip). Moving a linked clip's mediaStart does not create one; it only slips the picture.
- Several cuts in one clip use ONE sliceClip with times=[...]. Repeated splitClip calls invalidate the ids the next call needs.
- Transcript word times on a clip are clip-relative; cutRanges takes timeline seconds. Convert before cutting or the cut lands in the wrong sentence.
