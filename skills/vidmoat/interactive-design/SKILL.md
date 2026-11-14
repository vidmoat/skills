---
name: interactive-design
description: "What sits over an interactive video: hotspot marks, panels, placement, timing, wording. Use for styling choices, quizzes, polls or hotspots."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.2"
  owner: "vidmoat"
  category: "craft"
---

# Designing interactive video

The picture is the content. Everything drawn over it (a question, a card, a hotspot's mark) should take as little of it as it can, and the footage should do the inviting.

## Workflow

1. **Look before you place.** Take a preview frame of the scene's brightest and darkest moment. Find the third the shot leaves empty: nothing may sit on a face, on-screen text, captions or the thing being asked about.
2. **Invite in the footage, confirm with the mark.** Someone looks at the thing, points, reaches; it is lit or framed alone; the narration asks. A hotspot's `label` is never drawn: it is the name a screen reader says, so write what the thing is ("The red door"), never "Tap here".
3. **Pick the quietest mark that still gets found** (`mark` on the hotspot, or video-wide): `dot` covers least and suits a busy shot; `outline` when the thing has clear edges; `ring` when it is round or moves; `glow` in a dark, cinematic shot; `none` only when the footage itself asks for the tap.
4. **Choose one look for the whole video** with `setInteractiveSettings`: `tone` (`dark`, `light`, `brand`), `panel` (`card`, `glass`, `bar`, `bare`), `corners` (`round`, `soft`, `square`), `accent` (`#RRGGBB`), `layout` (`row`, `stack`, `grid`), `scrim` (`auto`, `none`, `strong`), `font` (`inherit`, `serif`, `mono`, `rounded`), `motion` (`rise`, `fade`, `none`), `position` (`bottom`, `centre`, `top`). Leave a token out to keep its default.
5. **Move one item, not the subject.** When a single question would cover its own shot, set `position` on that item with `addInteractiveItem` or `updateInteractiveItem`. On a hotspot, `position` is where its card opens: a hotspot low in the frame opens its card at the top.
6. **Give the shot a beat, then ask.** Not during fast cuts or over speech that matters. Leave time to read: about a second for every three words, never under three seconds.
7. **One thing to decide at a time.** Two answers is a choice, three is a menu, four is a quiz. Never a question and a hotspot that matters at the same moment.
8. **Few words, and verbs.** A question is one line; an answer is two to four words and starts with a verb when it is an action ("Open the door"). Leave the question out when the scene already asked it.
9. **Do not confirm twice.** The player already shows what was picked, the score and right or wrong. Write the next scene as the consequence, not a receipt.
10. **Put the answer the plain video should follow first.** The MP4 for other platforms has no choices and follows the first option. Nothing may depend on sound: most feeds start muted.
11. **Check it as the viewer** on preview frames over the brightest and the darkest scene before publishing.

## Examples

```json
{ "op": "setInteractiveSettings", "tone": "dark", "panel": "glass", "corners": "round", "accent": "#1F4FD8", "layout": "stack", "mark": "dot" }
{ "op": "addInteractiveItem", "kind": "hotspot", "scene": "sc_opening", "at": { "t": 1 }, "until": 5, "box": { "x": 0.3, "y": 0.3, "w": 0.25, "h": 0.25 }, "label": "The red door", "mark": "dot", "position": "top", "action": { "card": { "title": "The red door", "body": "It has not been opened since the flood." } } }
{ "op": "updateInteractiveItem", "itemId": "it_door0001", "mark": "glow", "position": null }
{ "op": "setInteractiveSettings", "accent": null, "layout": null, "mark": null }
```

## Gotchas

- Tokens are flat keys on `setInteractiveSettings`. A nested `style` object, `css`, `color` or `colour` is refused.
- The answers' layout is `layout`. `options` only ever means an item's answers and is refused as a setting; the mark token is `mark`, not `hotspot`.
- `accent` is exactly `#RRGGBB`: no names, no `rgb()`, no 3 or 8 digit hex. A few mid-tones are refused for contrast, with the ratio they reach; go a little lighter or darker.
- The accent fills the answers only in `tone: "brand"`. In `dark` and `light` it colours the lines, the timer and the marks.
- `panel: "bare"` with `scrim: "none"` is refused, whichever is sent second: nothing would be left behind the words.
- `mark` belongs to hotspots only; on a choice, quiz or poll it is refused. `position` is fine on all four.
- `mark: "none"` is accepted with the warning `hotspot_invisible`. Keep it only when the footage does the inviting; otherwise use `dot`.
- It is `centre`, not `center` or `middle`.
- `null` puts a token back to its default. Sending the default's name works but stores it.
- There is no per-item tone, panel or accent: one look per video, on purpose.
- A feed card always draws questions in the middle, whatever `position` says.
- A hotspot drawn smaller than 11% of the frame is warned about; the tap area is never under 44px, but two small targets side by side still get mis-tapped. Keep targets apart and off the bottom edge.

Related skills: titles, captions, pacing, accessibility-lead.
