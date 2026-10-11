# Food Creator: the full brief

The long form of the brief, with every target and technique. The SKILL.md brief is the compact version that rides in the prompt; load this when planning a full edit in this style or when the user asks for detail.

INTENT: make them hungry in 3 seconds, then make it followable.
SPEC: the finished dish on screen by 3.0s and again in the final shot. Short-form 30 to 90s (built around 60s) with under 10 ingredients and under 6 steps; anything bigger goes long-form (cooking videos run a median of about 7 min, mean about 10). Waits sped up 2 to 4 times; satisfying actions (the pour, the cut, the first sizzle) at 1x. Slow motion only from 50 fps or faster sources (120 fps on a 24 fps timeline is 5 times slower). Every quantity in both systems (g and ml with cups, tbsp or oz) and every temperature in both (180°C/350°F, 200°C/400°F, 220°C/425°F; these are the conventional rounded pairs). Text up for at least its character count divided by 20 seconds, with a 1.5s floor, at most 2 lines of 42 characters.
DERIVE FIRST: work these out from the timeline in front of you, then apply the SPEC to those figures:
· The best finished-dish shot (plated, cut open, bite or pull), scored on sharpness, steam or motion and colour; it must exist before cutting.
· The step list with start and end times, and every quantity, temperature and time mentioned (each needs converting).
· The "nothing changes" waits (simmering, resting, rising): candidates for speed or a jump cut.
· Camera angle per clip (overhead, 45 degree, chef to camera) and whether the overhead is level and consistent.
· Frame rate per clip: only 50/60/120 fps clips may be slowed.
· White balance drift between clips against a neutral reference (white plate, board, towel), and whether meat reads grey or blue in the shadows.
· Sizzle, chop and crunch moments in the audio, measured from the waveform.
CRAFT
· Cold open on the hero (plated dish, cheese pull, a bite) for 1 to 2s with its best sound, then hard-cut to the first step; close on the same dish.
· Ingredient card right after the hook, one line per ingredient, both units, inside the safe zone (addTitle).
· One action per shot: in when the hand enters, out as the result shows; remove the hand-exit frames (trimClip, cutRanges).
· Speed the waits 2 to 4 times (setSpeed) or cut them with a match on action; keep the money shots at 1x.
· Lock overhead framing: level, consistent crop, the pan in the same screen position across steps.
· Correct, then grade: neutralise on the white plate, match all clips, warm the midtones slightly, desaturate blue shadows; targeted boosts on the food (isolateColor, an object mask) rather than global saturation; give greens their own correction.
· Fix grey meat by removing the cool cast, not by pushing saturation.
· Sound layers: sizzle, chop, pour and crunch on their own, music ducked under each hero sound (autoDuck); an ASMR cut drops the music entirely.
· Temperatures and times appear on the shot where they happen ("Bake 25 min at 200°C/400°F" over the oven), not in a list at the end.
DO NOT: open on raw ingredients or a talking intro with no finished dish in the first 3s; quantities in one unit only; text flashed shorter than it takes to read; slow motion from 24/30 fps footage or speeding the money shots; a blue kitchen cast or auto white balance drift; global saturation until reds clip, or a global hue rotation (it takes every food colour with it); music over the sizzle.
ACCEPT: the dish is on screen by 3.0s and in the final shot, every on-screen quantity and temperature appears in both metric and US units, every text event stays up at least characters divided by 20 seconds (1.5s minimum), clips match on the neutral reference, no slowed clip comes from a source under 50 fps, and the length fits the format (30 to 90s short-form, 4 to 12 min long-form).
