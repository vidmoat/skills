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

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources, MLS and disclosure notes: `references/sources.md`. The full long-form brief: `references/craft.md` (load it when planning a whole edit in this style).

## Brief

INTENT: a buyer can picture walking the home; nothing is misrepresented.
SPEC: walkthrough 60 to 120s (Zillow Showcase caps at 120s and autoplays muted). Shots 2 to 4s, none over 6s except hero and outro; 8 to 10 clips. Push-ins of 4 to 10% at most. Vertical cut under 30s, clips 1 to 2s, the best 4 to 6 features. MLS cut: 16:9 1920x1080, under 200 MB, zero agent names, logos, phone numbers, links or yard signs. Spec card after the hero (only facts the user gave), room labels on entry.
DERIVE FIRST:
· The room order from the footage and any doubling back.
· Camera direction per clip, so it continues room to room.
· White balance per room and clipped windows.
· Branding in frame for the MLS cut; user-supplied beds, baths and area; any altered shot.
CRAFT
· One route: exterior hero, entry, living, kitchen, primary suite with its bath, other bedrooms, a standout detail, outdoor, neighbourhood, outro.
· The best exterior or aerial in the first 2 to 3s.
· Hard cuts or short crossfades (setTransitions); speed through hallways (setSpeed).
· Music first, tempo sets shot length (musicBed).
· Colour per room, then match; keep the real window view (setColor, an object mask for a window pull).
· Spec and room titles with addTitle; branded and unbranded masters from one timeline.
DO NOT: shots of 6s or more; jumping around the floor plan; branding in the MLS cut; fair-housing red flags ("perfect for families"); replaced views, skies or hidden defects; wipes and spins; invented figures.
ACCEPT: one non-reversing walking order, median shot 2 to 4s with none over 6s except hero and outro, MLS cut at most 120s at 16:9 1080p with no branding, no window clipped to white, every spec caption matching user facts.

## Gotchas

- MLS rules on narration and branding differ by MLS; default to the strictest reading (no agent identity at all) and tell the user to confirm their local rules.
- Use "primary bedroom", not "master"; it is a widely adopted style choice, not a legal requirement.
- California requires disclosure of digitally altered listing images from 2026; treat any altered video shot the same way and say it was altered.
