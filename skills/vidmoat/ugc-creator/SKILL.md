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

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources, platform data and the disclosure rules: `references/sources.md`.

## Brief

INTENT: native, honest, and the product in the first 3 seconds.
SPEC: 1080x1920, 9:16, at least 720p. Product or key claim on screen or spoken by 3.0s, the hook finished by 6s. Length 21 to 34s by default (TikTok's reported conversion window), plus a 9 to 15s cutdown to test. Several scenes (talking head, hands-on demo, close-up, reaction) rather than one selfie take. Text only inside the stricter union of TikTok and Reels safe zones: y 269 to 1248 and x 65 to 940 on 1080x1920. Captions of at most 2 lines, about 20 characters per second. A written call to action in the final 3s. Music above about 120 BPM tends to hold viewers; speech clearly above it. 3 to 5 hook variants on one shared body for testing.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· Total duration, and the first second the product or key claim appears on screen and in speech.
· Every candidate hook line (a result, a reaction, the problem said out loud), scored on whether it stands alone in under 3s.
· Scene count and speech versus dead air: can the take reach 21 to 34s without cutting a claim?
· Face box positions, so captions stay clear of the face and the platform UI.
· Every spoken or written claim, classified: efficacy, superlative ("best", "number one"), health, price, timed result, before/after. Each needs substantiation or removal.
· Whether there is a material connection to the brand, and whether a disclosure is already said and shown.
· Placement (TikTok in-feed, TikTok Shop, Reels): sets length and safe zone.
CRAFT
· Open on the payoff: the result, the reaction or the problem said out loud; no logo intro, no "hey guys".
· Beat order: hook, problem, product, demo, result, proof, offer, call to action; the solution runs shorter than problem plus agitation.
· Cut on sentence boundaries, remove breaths and restarts (cutRanges), let jump cuts show; b-roll lands exactly where a product or demo is named.
· Native word or phrase captions in the face-free middle band (addCaptions, restyleCaptions).
· Offer and call to action written on screen even when spoken ("20% off, tap Shop Now") with addTitle.
· Sound: speech over a high-energy licence-safe bed (musicBed, autoDuck); small sound hits on text reveals and demo beats.
· Disclosure in the video itself, spoken and on screen at the start, plus the platform's paid-partnership setting.
· Hook variants: duplicate the project or clip set and swap only the first 2 to 4s, keeping body and call to action identical so a test isolates the hook.
DO NOT: studio polish, stock voiceover and logo stings; fake, AI-generated or scripted "customer" testimonials; unsupported claims (number one, the best, timed results, cure claims, filtered or weight before/afters); text under the right icon rail or the bottom caption band; the product reveal after 6s; disclosure only as a hashtag or the toggle alone; a letterboxed 16:9 clip; a cross-posted creative copied unchanged.
ACCEPT: 21 to 34s (or 9 to 15s for a cutdown), product or key claim by 3.0s, all text inside y 269 to 1248 and x 65 to 940, a written call to action in the last 3s, a spoken and on-screen disclosure in the first 3s whenever there is a material connection, and every claim either substantiated by the user or removed.

## Gotchas

- Fake reviews and testimonials are prohibited outright by the FTC rule of 2024; never invent a customer or put words in a real one's mouth.
- TikTok and Reels safe zones differ by up to 140 px at the bottom; design to the stricter union, then preview both.
- The platform's call-to-action button is the action; avoid "swipe up" on TikTok.
