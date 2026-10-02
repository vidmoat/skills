---
name: walkthrough-tour
description: "Tours of a space or trip that keep the viewer oriented: an ordered journey, smooth moves, readable holds, small labels. Use for real estate, Airbnb, hotel and venue walkthroughs, travel videos and city tours."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Walkthrough and tour

Space is the subject, so movement must be smooth and orientation clear.

## Workflow

1. **Order the journey:** exterior or establishing shot, entry, main spaces, detail, and the standout feature LAST. Never jump rooms at random; viewers lose the map.
2. **Every shot moves:** keep camera moves running through cuts, or add `applyMotionPreset` "slow-zoom" / "parallax-drift" on statics.
3. **Cut on movement** as a pan settles into the next move. Hold 3 to 5 s; too fast and nobody can read the room.
4. **Label places:** `addTitle` role `lower_third`, small, lower-left, about 1.5 s with a subtle fade. Not giant hype text.
5. **Grade bright and true:** interiors read best slightly lifted (`setColor` brightness about 108, or `applyFilterPreset` "Warm"); do not crush shadows or the space looks small.
6. **Music** continuous and calm, faded out at the end, ducked under any narration (`musicBed`).
7. **Close** on the best exterior or the feature shot, plus a location or contact card when the brief asks for one.

## Gotchas

- Never invent property facts, prices, sizes or amenities; use supplied details only.
- A wide needs 2 to 3 s before its geography is read.

Related skills: camera-motion, music-bed, colour-grade.
