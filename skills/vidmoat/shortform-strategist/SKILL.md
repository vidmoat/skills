---
name: shortform-strategist
description: "Short-form brief for TikTok, Reels and Shorts: a 3-second hook, pixel safe zones, burned captions, a loop. Use for vertical cuts, Reels people skip, or when the user tags @shortform-strategist."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Short-Form Strategist

Cuts for TikTok, Reels and Shorts: hook, safe zones, burned captions, and an ending that loops.

This is the brief the Short-Form Strategist gives when the user tags @shortform-strategist or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line.

## Brief

INTENT: a vertical cut that survives the first three seconds and loops.
SPEC: 1080×1920. Safe zones in pixels: TikTok ~140 top, ~400 bottom, 60 left, ~180 right (the rail). Reels ~220 top, ~420 bottom. CROSS-PLATFORM: keep every face, caption and graphic inside a 900×1400 box centred on frame: that is the intersection, and it is the only safe assumption when the same file gets posted twice.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Is the canvas already 9:16? If not, the reframe is step one and everything else follows it.
· The safe box for THIS canvas: centred, 83% of width by 73% of height (that is the 900×1400 rule generalised).
· Where the first cut currently lands. If it is after 3.0s, that is the first thing to fix.
· Total duration vs the target length, so you know how much has to go.
CRAFT
· The first ~3 seconds decide distribution. The hook is a visual AND a text claim on frame one, and the claim must be specific ("I lost £4,000 doing this"), never categorical ("let me tell you about budgeting").
· Sound-off is the default: captions are burned in, two lines maximum, out of the bottom 400px.
· Cadence: 1.5-2.5s average shot; some visual change (punch-in, b-roll, graphic) at least every 3s through the first 15.
· Structure: hook (0-3s) → one line of context (3-6s) → payoff → CTA LAST. Never open on a branded intro animation.
· Loop design: the final frame should rhyme with the first, or the last line should answer the opening question. A clean loop pushes watch time past 100%.
· Reframing: never letterbox 16:9 into 9:16. Punch in and follow the subject; a blurred plate is a last resort, not a style.
DO NOT: logo intro; CTA in the first half; text in the bottom 400px; black bars; a hook that describes the video instead of making a claim.
ACCEPT: check preview frames near 0.5s, mid and end: everything inside the 900×1400 box, and the first cut lands before 3.0s.

## Gotchas

- Never letterbox 16:9 into 9:16. reframeAuto with follow:"faces" frames every shot on its measured face in one command; keyframing shots one by one drifts.
- Captions stay out of the bottom 25% of a vertical frame; platform UI sits there.
- A hook is written from this footage. Generic bait ("WATCH THIS") is the failure this brief exists to prevent.
