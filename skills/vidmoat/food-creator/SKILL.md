---
name: food-creator
description: "Food Creator specialist, tagged @food-creator or consulted for recipe and cooking videos: the finished dish by 3 seconds, one action per shot, waits sped up 2 to 4 times, quantities and temperatures in both units, appetising colour without global hue shifts, and sizzle you can hear. Use when the user tags @food-creator or asks to edit a recipe, cooking or food video."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "specialist"
---

# Food Creator

Cuts cooking footage into an appetising, followable recipe video that opens on the finished dish, keeps every quantity readable in both units, and speeds the waiting so the format fits.

This is the brief the Food Creator gives when the user tags @food-creator or the planner activates this skill. It is professional advice inside the user's brief: the user's goal, explicit exclusions, brand rules, access and spending limits win. Its numbers are proposed targets; check that each applies and can be measured before using it. For an evidence-grounded shot plan from this specialist, use the specialist-consultation workflow (agentWorkspace action specialist_consult) instead of reading the brief alone.

Work the DERIVE list out first, from the clips actually on the timeline, and say the figures you derived. Before calling a step done, check it against the ACCEPT line. Sources and evidence notes: `references/sources.md`. The full long-form brief with every target and technique: `references/craft.md` (load it when planning a whole edit in this style).

## Brief

INTENT: make them hungry in 3 seconds, then make it followable.
SPEC: the finished dish by 3.0s and in the final shot. Short-form 30 to 90s with under 10 ingredients and under 6 steps; bigger recipes go long-form (median about 7 min). Waits sped 2 to 4 times; money shots at 1x. Slow motion only from 50 fps or faster sources. Every quantity in both systems and every temperature in both (180°C/350°F, 200°C/400°F, 220°C/425°F). Text up for at least characters divided by 20 seconds, 1.5s minimum, 2 lines of 42.
DERIVE FIRST:
· The best finished-dish shot (plated, cut open, bite or pull).
· Steps with times, and every quantity, temperature and time mentioned.
· The waits (simmer, rest, rise) to speed or cut.
· Frame rate per clip; white balance against the white plate; grey or blue meat.
CRAFT
· Cold open on the hero for 1 to 2s with its sound, then the first step; close on the same dish.
· Ingredient card after the hook, both units (addTitle).
· One action per shot: in as the hand enters, out as the result shows (cutRanges).
· Speed the waits (setSpeed); keep pours and cuts at 1x.
· Neutralise, match, warm midtones slightly, desaturate blue shadows; targeted boosts (isolateColor) not global saturation.
· Sizzle and crunch audible; music ducked under them (autoDuck); temperatures shown on the shot where they happen.
DO NOT: open on raw ingredients; one unit only; text shorter than reading time; slowed 24/30 fps footage; a blue cast; global saturation or a global hue rotation; music over the sizzle.
ACCEPT: dish by 3.0s and in the last shot, both units for every quantity and temperature, text held at least characters over 20 seconds (1.5s minimum), clips matched on the neutral reference, no slowed clip under 50 fps, length fits the format.

## Gotchas

- Oven temperature pairs are conventions, not exact conversions (180°C is 356°F); round consistently and say so if asked.
- "Warm reds make food appetising" is folklore when the footage is already neutral; the evidenced part is that unnatural colour and a cool cast hurt.
- Speed changes on a clip with live sound change its pitch; detach or mute the sped-up audio and lay the sizzle from the real-time moment.
