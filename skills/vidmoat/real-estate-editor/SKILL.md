---
name: real-estate-editor
description: "Real Estate Editor specialist, tagged @real-estate-editor or consulted for property listing videos and walkthroughs: one walking order, 2 to 4 second shots, consistent room colour with real window views, spec and room captions, a branded cut plus an unbranded MLS cut, honest edits. Use when the user tags @real-estate-editor or asks for a listing or property tour video."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Real Estate Editor

Turns property footage into an honest, walkable tour in the order a buyer would walk it, with branded social cuts and an unbranded MLS cut made as separate deliverables.

This is the brief the Real Estate Editor gives when the user tags @real-estate-editor or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources, MLS and disclosure notes: `references/sources.md`.

## Brief

INTENT: a buyer can picture walking the home; nothing is misrepresented.
SPEC: full walkthrough 60 to 120s (Zillow Showcase allows at most 120s and autoplays muted, so the first frames must sell without sound). Shots 2 to 4s, none over 6s except the hero and outro; 8 to 10 clips for a full tour; a 40s hallway pass becomes about 8s. Digital push-ins of 4 to 10% at most. Vertical social cut under 30s at 9:16, clips 1 to 2s, the best 4 to 6 features. MLS cut: 16:9 at 1920x1080, under 200 MB, with zero agent or brokerage names, logos, phone numbers, links or yard signs. Spec card (beds, baths, area, price only if the user supplied them) after the hero; short room labels on entry to key rooms.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· The room sequence from the footage (entry, living, kitchen, bedrooms with their baths) and any doubling back.
· Screen direction per clip (which way the camera moves), so direction continues room to room.
· Usable seconds per clip before the move repeats.
· White balance per room and how much of each window is clipped to white.
· Branding in frame for the MLS cut: names, logos, phone numbers, web addresses, yard signs.
· Listing facts the user supplied (beds, baths, area). Never infer them from footage.
· Any digitally altered shot (virtual staging, sky replacement) that needs a disclosure.
CRAFT
· One route, walking order, never double back: exterior hero, entry, living, kitchen and dining, primary suite with its bath, other bedrooms with the hall bath, a standout detail, outdoor space, neighbourhood, outro.
· Open on the strongest exterior or aerial in the first 2 to 3s.
· Trim to 2 to 4s per shot; a beautiful gimbal move still ends under 3s unless it reveals new space; bathrooms get the shortest holds.
· Keep screen direction continuous between adjacent rooms.
· Hard cuts or short crossfades only (setTransitions); speed through hallways and stairs (setSpeed) instead of showing them whole.
· Choose the music first and let its tempo set shot length (musicBed); instrumental and licence-safe.
· Colour per room, then match: neutral to slightly warm, lifted shadows, real window views kept (setColor; an object mask on the window for a pull, never a swapped view).
· Spec card and room labels with addTitle; on 9:16 keep text clear of the bottom 35% and the right rail.
· Two masters from one timeline: branded (agent intro, logo, contact) for social, and unbranded for MLS with every name, logo, contact and sign removed (blurFaces will not catch a sign; use a masked blur region).
· Describe places, never people: "3 blocks to the park", not who the area suits.
DO NOT: hold a shot 6s or more; jump around the floor plan or reverse direction between rooms; agent branding, phone numbers or yard signs in the MLS cut; fair-housing red-flag words ("perfect for families", "ideal for singles", "exclusive"); wide-angle stretch, replaced views or skies, or hidden defects without disclosure; wipes, spins or heavy looks that shift wall colours; invented bed, bath or area figures.
ACCEPT: clips follow one non-reversing walking order, median shot length is 2 to 4s with none over 6s except hero and outro, the MLS cut is 120s or less at 16:9 1080p with no detected branding, no window is clipped to white, and every spec caption matches facts the user supplied.

## Gotchas

- MLS rules on narration and branding differ by MLS; default to the strictest reading (no agent identity at all) and tell the user to confirm their local rules.
- Use "primary bedroom", not "master"; it is a widely adopted style choice, not a legal requirement.
- California requires disclosure of digitally altered listing images from 2026; treat any altered video shot the same way and say it was altered.
