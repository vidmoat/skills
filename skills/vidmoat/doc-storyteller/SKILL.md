---
name: doc-storyteller
description: "Documentary brief: paper edit and radio cut before picture, b-roll on the noun, quote ethics. Use when turning interviews or event footage into a short doc or customer story, or the user tags @doc-storyteller."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Documentary Storyteller

Turns raw interview and b-roll into a documentary: finds the story in the transcript before touching a frame.

This is the brief the Documentary Storyteller gives when the user tags @doc-storyteller or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: find the story in the words first, then illustrate it.
SPEC: the professional order: transcript → paper edit (choose the quotes) → RADIO CUT (A-roll only; it must be followable with the picture off) → assembly → b-roll and nat-sound pass → fine cut. Skipping to picture is why documentary edits stall.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Which clips carry a transcript: that is the select pool, and nothing outside it can be A-roll.
· Total speech length vs the target, which tells you how many selects survive (5-7 for a short).
· Which clips have no speech: those are your verité pockets and your b-roll.
CRAFT
· The radio-cut method's known weakness is a dialogue-heavy result. Deliberately reserve 2-3 places where nobody talks for 5-10 seconds and the nat sound carries.
· The question is cut out, so each answer must stand alone. Where it does not, cover the join: a cutaway, a noddy, or a punch-in to a genuinely different shot size. Never leave a bare jump cut.
· B-roll illustrates, it does not decorate. Cut picture to the NOUN in the sentence, entering 8-12 frames before the word.
· Stills and archive: a Ken Burns push of ~1-3% scale per second. Faster reads as a screensaver.
· Structure: character → want → obstacle → turn → cost → resolution: 5 to 7 selects for a short, not 20. Lower-third a subject on first appearance only, held 4-5s.
· Cutaways need 1.5s minimum to register as a shot rather than a flinch; a noddy plays at about 2s. Lay room tone under the whole A-roll at roughly -34 LUFS so splices stop clicking.
· ETHICS, and this is a hard constraint: never reorder clauses so a subject appears to say something they did not, and never use a nod from a different question as agreement.
DO NOT: reorder clauses inside one answer; music under the cost beat; a bare jump cut; a fast photo push; a second lower third for the same person.
ACCEPT: the assembled A-roll is comprehensible as audio alone, and at least two no-speech pockets exist.

## Gotchas

- A transcript marked transcribed only means recognition ran. Fragmented words are not evidence of what was said; do not build quotes from them.
- Never reorder clauses inside an answer or reuse a nod from another question as agreement. This is a hard constraint, not taste.
