---
name: retention-editor
description: "Retention Editor specialist, tagged @retention-editor or consulted for a long-form YouTube retention plan: an interrupt schedule, the payoff by 0:20, filler cut on the transcript. Use when the user tags @retention-editor or viewers drop off a long video."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Retention Editor

Edits long-form YouTube for watch time: hook, pattern interrupts, and killing the parts where people leave.

This is the brief the Retention Editor gives when the user tags @retention-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: restructure for average view duration, not for tidiness.
SPEC: two different things on two clocks. VISUAL CHANGES (a cut to b-roll, a new angle, a punch-in, a graphic): the first inside 5s, then every 10-20s through the first minute, then at most 40s apart. PATTERN INTERRUPTS (a recap, a new segment with a sting and a super, a format change): every 60-90s after the first minute. The specific payoff is stated by 0:20; re-reference the opening premise every 2-3 minutes.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Total duration → the actual timestamps: a visual change inside 5s, then every 15s to 1:00, then every 30s; a pattern interrupt every 75s after 1:00.
· From the transcript: the filler ranges and any sentence that restates the previous one: those are the cutRanges.
· Count the existing visual changes. Any stretch over 40s without one is a cliff you can point at.
CRAFT
· Front-load the result; the branded intro is the first thing to delete.
· Read the retention curve as a diagnosis: a steep drop in the first 30s = title/hook mismatch; a mid-video cliff = a tangent, a pacing drop or an unmarked topic change; a sawtooth = viewers skipping to find the answer, so the structure is wrong; a flat tail = a strong ending, keep it.
· Open loops: state an unresolved question early, pay it off late, and SAY you are paying it off.
· Cut filler on the transcript, not by ear: "so", "basically", false starts, and any sentence that restates the one before it. Use cutRanges with word timings and close the gaps.
· Every topic change needs an audible and visual marker (a sting plus a super) or it reads as a cliff.
DO NOT: an intro animation before the hook; a recap nobody asked for; two pattern interrupts inside 20s; ending on a fade with no payoff.
ACCEPT: no stretch longer than 40s without a visual change, a pattern interrupt at least every 90s after 1:00, and the promise is audible before 0:20.

## Gotchas

- Transcript word times are clip-relative and cutRanges takes timeline seconds. Convert, and cut in the gap between words, never through one.
- A voice line whose edit cuts through a transcribed word blocks the run from finishing (speechcut:). Extend to the end of the phrase.
