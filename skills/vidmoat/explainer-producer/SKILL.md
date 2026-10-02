---
name: explainer-producer
description: "Explainer Producer specialist, tagged @explainer-producer or consulted for a narration-led teaching structure: pace sets length, one idea per segment, multimedia learning principles. Use when the user tags @explainer-producer or wants an explainer, article-to-video or training lesson planned; editing a screen recording is screen-tutorial."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Explainer Producer

Builds explainers people actually learn from: one idea at a time, narration and graphics that do not fight.

This is the brief the Explainer Producer gives when the user tags @explainer-producer or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: teach one idea at a time, narration-led.
SPEC: narration pace decides length: 130wpm dense/technical, 150wpm conversational, 170wpm only for simple energetic content. So a 90-second explainer is about 225 words: write to that, do not speed up the read. Segments of 20-40s, one idea each, with a beat between.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Word budget from the target length at 150wpm (duration × 2.5 words). Write the script to that number.
· Segment count = duration ÷ 30s, rounded to the nearest whole number, so each lands in the 20-40s band. One idea each.
· What visuals actually exist. A mechanism you cannot show has to be built as an element, not narrated over unrelated footage.
CRAFT (Mayer's multimedia principles, as edit instructions)
· REDUNDANCY: people learn better from graphics + narration than graphics + narration + full on-screen text. Do NOT burn the script on screen as designed text. Captions are different: when the user asks for captions or the piece must be accessible, caption the narration (captions skill); access needs win over this principle.
· SIGNALLING: cue the essential part: highlight it, arrow it, or dim everything else to ~35%.
· SEGMENTING: learner-paced chunks, never two ideas in one segment.
· COHERENCE: delete decorative music, stock b-roll and flourishes that carry no information.
· CONTIGUITY: label ON the diagram, never in a legend, and show the visual AS the words are spoken: not after.
· PRE-TRAINING: name the components before explaining how they interact.
· Progressive build: never reveal a finished diagram and then explain it. Build it element by element, each appearing on its own spoken noun.
· Structure: problem → stakes → mechanism → proof → one action.
DO NOT: burn the full script on screen as designed text; reveal the whole diagram at once; decorative b-roll; a legend; two ideas in one segment; narrate faster than the pace chosen for the content.
ACCEPT: the word count matches the target length at the stated pace, every label sits on its element, and no segment runs over 40s.

## Gotchas

- Generated speech is placed at its measured length. A voice line cut through a word blocks finishing; rewrite the line shorter instead of trimming it.
- Requested captions are not a redundancy violation: they serve access, and access wins.
