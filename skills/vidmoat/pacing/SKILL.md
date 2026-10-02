---
name: pacing
description: "Cut rhythm and joins: shot lengths by format, varied rhythm, strong openings, jump cuts, match cuts, b-roll and transitions that mean something. Use when an edit feels slow, boring or jumpy, or for b-roll and transitions."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.1"
  owner: "vidmoat"
  category: "craft"
---

# Pacing and cuts

Cut when information, action, emotion or rhythm changes. Shot length follows content and readability, never a universal interval.

## Shot length by format (convention, median not rule)

| format | median shot | notes |
|---|---|---|
| short-form vertical | 1.2 to 2.5 s | first shot under 1.5 s |
| YouTube talking head with b-roll | 3 to 6 s | b-roll cutaway 2 to 4 s |
| product demo or explainer | 2.5 to 5 s | hold on the thing being explained |
| cinematic or mood | 4 to 8 s | earn the length with movement |

## Rules

- **Vary it.** Three quick shots then one that breathes is rhythm; thirty identical shots is a metronome. The medians above are averages over varied lengths: an unvarying cut every 2 s for a minute is exhausting, not fast, even though 2 s sits inside the short-form median.
- **The first three seconds decide short form.** Open on the most arresting frame, not a title card, logo or slow fade from black; a hook line is on screen by 0.5 s.
- **Cut on motion** (a hand leaving frame, a head turn, a pan settling into the next move); cutting on a static frame draws attention to the cut.
- **Never cut mid-word.** Cut in the gap after a complete thought (dead-air-cleanup for the mechanics).
- **Jump cut:** `cutRanges` on the dead ranges of ONE clip with `ripple:true` so the gaps close; hide repeated jumps with a `punchIn` or a cutaway.
- **Match cut:** cut between shots whose composition or motion aligns; land it with `sliceClip` on the matching frame. If the shapes nearly align, a 0.15 to 0.25 s "whip-pan" or "blur" transition hides the residual.
- **B-roll / cutaway:** the cutaway on a later track so it covers the main shot while the underlying audio keeps running; that is what makes it read as b-roll rather than a scene change.
- **Transitions carry meaning:** hard cut is continuous, dissolve (about 24 frames) is time passing, fade to black is an act break. `setTransition` belongs to the OUTGOING clip; `setTransitions` applies one style to every cut. There is no `addTransition`.

## Gotchas

- `transitionOutType` and `transitionOutDuration` are read-only summaries, not `updateClip` fields.
- Several cuts in one clip use ONE `sliceClip` with `times` (timeline seconds); repeated `splitClip` invalidates ids.
- Read new ids and timing after structural changes before placing overlays.
- Energetic does not automatically mean more cuts or zooms; quiet footage can be the peak.

Related skills: beat-sync, j-l-cuts, dead-air-cleanup, camera-motion. Specialists: film-editor, retention-editor.
