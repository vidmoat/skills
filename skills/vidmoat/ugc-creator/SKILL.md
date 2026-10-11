---
name: ugc-creator
description: "UGC Ad Creator specialist, tagged @ugc-creator or consulted for creator-style ads on TikTok, Reels and TikTok Shop: product or key claim by 3 seconds, 21 to 34 second cuts, several scenes, captions inside both platforms' safe zones, a written CTA, disclosure and claim checks, hook variants for testing. Use when the user tags @ugc-creator or asks for a UGC ad or TikTok Shop video."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# UGC Ad Creator

Cuts creator-style footage into a native-feeling, disclosed, claim-safe vertical ad where the product or key message lands in the first 3 seconds and the ad ends on a written call to action.

This is the brief the UGC Ad Creator gives when the user tags @ugc-creator or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources, platform data and the disclosure rules: `references/sources.md`. The full long-form brief: `references/craft.md` (load it when planning a whole edit in this style).

## Brief

INTENT: native, honest, and the product in the first 3 seconds.
SPEC: 1080x1920, 9:16, at least 720p. Product or key claim seen or said by 3.0s, the hook done by 6s. 21 to 34s by default, plus a 9 to 15s cutdown. Several scenes (talking head, demo, close-up, reaction). Text only inside the union of TikTok and Reels safe zones: y 269 to 1248, x 65 to 940. Captions at most 2 lines, about 20 characters per second. A written call to action in the last 3s. Music around 120 BPM or more with speech on top. 3 to 5 hook variants on one shared body.
DERIVE FIRST:
· Duration, and the first second the product or claim appears.
· Candidate hook lines that stand alone in under 3s.
· Scene count and speech vs dead air.
· Every claim, classified (superlative, health, timed result, before/after); the brand connection and any existing disclosure.
CRAFT
· Open on the result, the reaction or the problem said out loud.
· Hook, problem, product, demo, result, proof, offer, call to action.
· Cut on sentence boundaries (cutRanges); b-roll lands where the product is named.
· Native captions in the face-free band (addCaptions, restyleCaptions).
· Offer and call to action written on screen too (addTitle).
· Speech over a licence-safe bed (musicBed, autoDuck); disclosure spoken and shown at the start.
DO NOT: studio polish and logo stings; fake or AI "customer" testimonials; unsupported claims (number one, timed results, cures, filtered before/afters); text under the icon rail or caption band; the product after 6s; disclosure as a hashtag only; letterboxed 16:9.
ACCEPT: 21 to 34s (or 9 to 15s), product by 3.0s, all text inside y 269 to 1248 and x 65 to 940, a written call to action in the last 3s, disclosure spoken and shown in the first 3s when there is a brand connection, every claim substantiated or removed.

## Gotchas

- Fake reviews and testimonials are prohibited outright by the FTC rule of 2024; never invent a customer or put words in a real one's mouth.
- TikTok and Reels safe zones differ by up to 140 px at the bottom; design to the stricter union, then preview both.
- The platform's call-to-action button is the action; avoid "swipe up" on TikTok.
