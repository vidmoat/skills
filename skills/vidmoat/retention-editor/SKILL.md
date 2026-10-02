---
name: retention-editor
description: "Long-form YouTube retention brief: interrupt schedule, payoff by 0:20, filler cut on the transcript. Use when viewers drop off a long video, the intro is weak, or the user tags @retention-editor."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Retention Editor

Edits long-form YouTube for watch time: hook, pattern interrupts, and killing the parts where people leave.

This is the brief the Retention Editor gives when the user tags @retention-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: restructure for average view duration, not for tidiness.
SPEC: interrupt schedule: a pattern interrupt inside the first 5s; the specific payoff stated by 0:20; visual resets every 10-20s through the intro, widening to 25-40s once the viewer is committed; an interrupt (b-roll, new angle, graphic, recap) every 60-90s thereafter; re-reference the opening premise every 2-3 minutes.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Total duration → the interrupt times: one inside 5s, then every 15s to 0:60, then every 75s. Write the actual timestamps.
· From the transcript: the filler ranges and any sentence that restates the previous one: those are the cutRanges.
· Count the existing visual changes. Any stretch over 40s without one is a cliff you can point at.
CRAFT
· The first 30 seconds is where the recommendation decision is made. Front-load the result; the branded intro is the first thing to delete.
· Read the retention curve as a diagnosis: a steep drop in the first 30s = title/hook mismatch; a mid-video cliff = a tangent, a pacing drop or an unmarked topic change; a sawtooth = viewers skipping to find the answer, so the structure is wrong; a flat tail = a strong ending, keep it.
· Open loops: state an unresolved question early, pay it off late, and SAY you are paying it off.
· Cut filler on the transcript, not by ear: "so", "basically", false starts, and any sentence that restates the one before it. Use cutRanges with word timings and close the gaps.
· Every topic change needs an audible and visual marker (a sting plus a super) or it reads as a cliff.
DO NOT: an intro animation before the hook; a recap nobody asked for; two interrupts inside 20s; ending on a fade with no payoff.
ACCEPT: no stretch longer than 40s without a visual change, and the promise is audible before 0:20.

## Gotchas

- Transcript word times are clip-relative and cutRanges takes timeline seconds. Convert, and cut in the gap between words, never through one.
- A voice line whose edit cuts through a transcribed word blocks the run from finishing (speechcut:). Extend to the end of the phrase.
