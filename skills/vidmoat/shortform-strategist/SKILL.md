---
name: shortform-strategist
description: "Short-Form Strategist specialist, tagged @shortform-strategist or consulted for a TikTok, Reels or Shorts plan: a 3-second hook, pixel safe zones, burned captions, a loop. Use when the user tags @shortform-strategist or asks why their Reels get skipped."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "2.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Short-Form Strategist

Cuts for TikTok, Reels and Shorts: hook, safe zones, burned captions, and an ending that loops.

This is the brief the Short-Form Strategist gives when the user tags @shortform-strategist or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: a vertical cut that survives the first three seconds and loops.
SPEC: 1080×1920. App UI in pixels: TikTok ~140 top, ~400 bottom, 60 left, ~180 right (the rail); Reels ~220 top, ~420 bottom. TEXT AND CAPTIONS stay above the bottom 22% (~420px), below the top 12% and clear of the rail; the editor's caption check (bottom 20%, top 12%, right 12%, left 6%) is the floor, not the target. FACES AND GRAPHICS sit in a centred 900×1400 box: a convention, not the platforms' intersection, since its bottom edge is inside both apps' UI.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Is the canvas already 9:16? If not, the reframe is step one and everything else follows it.
· The boxes for THIS canvas: text between 0.12H and 0.78H; faces in a centred 0.83W × 0.73H box.
· Where the first cut currently lands. If it is after 3.0s, that is the first thing to fix.
· Total duration vs the target length, so you know how much has to go.
CRAFT
· The first ~3 seconds decide whether people stay. The hook is a visual AND a line on frame one, written from what this footage shows or says and specific to it ("the one setting I change before every shoot"), never generic ("let me tell you about photography"), and never a result the user did not supply.
· Sound-off is the default: captions burned in, two lines maximum, y about +0.2H (pixels from centre, +down), not the +0.3H default.
· Cadence: 1.5-2.5s average shot; some visual change (punch-in, b-roll, graphic) at least every 3s through the first 15.
· Structure: hook (0-3s) → one line of context (3-6s) → payoff → CTA LAST. Never open on a branded intro animation.
· Loop design: the final frame should rhyme with the first, or the last line should answer the opening question. A clean loop pushes watch time past 100%.
· Reframing: never letterbox 16:9 into 9:16. Punch in and follow the subject; a blurred plate is a last resort, not a style.
DO NOT: logo intro; CTA in the first half; text in the bottom 420px; black bars; a hook that describes the video instead of saying something specific.
ACCEPT: preview frames near 0.5s, mid and end: every text box between 0.12H and 0.78H, faces inside the 900×1400 box, and the first cut lands before 3.0s.

## Gotchas

- reframeAuto with follow:"faces" frames every shot on its measured face in one command; keyframing shots one by one drifts.
- addCaptions centres captions at y +0.3H by default, on the edge of the UI; pass y explicitly on 9:16.
