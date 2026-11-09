---
name: layered-motion
description: "Motion graphics people can edit afterwards: compositions of layers with keyframes, After Effects style. Use for lower thirds, animated titles, kinetic type, stat reveals, logo stings and callouts that the person may want to retime or restyle by hand, and when a composition is already on the timeline."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.1.0"
  owner: "vidmoat"
  category: "craft"
---

# Layered motion (compositions)

A composition is a motion graphic made of layers, each property keyframed on
its own, that the person can open in the Composition panel and change. Build
one when the graphic is likely to be edited (a lower third with a name that
changes, a title they will retime). For a one-off graphic with no expected
edits, a motion component or HTML element is fine; `convertToComposition`
turns either a motion component or a TSX component into layers later.

## Workflow

1. **Look it up:** search capabilities, kind `workflows`, id `compositions`
   for the contract, and `get_command_schema` (MCP) or `searchCatalogue` kind
   `commands` id `editComposition` for every op.
2. **Start small:** `addComposition` with the layers you need, in composition
   pixels. Name every layer for what it is ("Name", "Role", "Bar"): the person
   reads those names in the panel, and expressions find layers by them.
3. **Animate with keys,** one property at a time. The easing on a key shapes
   the movement INTO it. Ease out on entrances (`easeOutCubic`), ease in on
   exits, and keep entrances near 0.4 to 0.6 seconds.
4. **Read it back** (`get_project`: `clips[].composition`) before the next
   edit, so ops name real layer, animator, path and effect ids.
5. **Look at frames** at the entrance, the hold and the exit before saying it
   is done.

## Which tool for which look

- **Words appearing:** a text animator, not keys on many text layers.
  `textPreset` typewriter for code or captions read aloud, wordPop for a
  punchy hook, lineRise for a calm title, fadeByChar for an elegant reveal.
  Write your own with setAnimator when none fits (unit, shape, range).
- **A wipe or reveal of a shape:** a mask with its width or points keyed, or
  a track matte when the reveal follows another layer's shape.
- **A line that draws itself** (an underline, a circle around a word, an
  arrow): a shape layer with a stroke and trim paths, `trimEnd` keyed from 0
  to 100. Round caps read as drawn; butt caps as cut.
- **A shape that turns into another:** key the path's points; every key must
  have the same number of points.
- **Something that keeps moving** (a gentle float, a pulse): an expression
  (value + wiggle(1, 6), or loopOut("pingpong")) instead of dozens of keys.
  Keep wiggle small: a few pixels reads as alive, tens as broken.
- **One layer following another:** an expression reading it
  (layer("Bar").x), so a later edit to the leader carries the follower.
- **Depth and finish:** the effect stack (drop shadow, glow, stroke, colour
  or gradient fill, blur). One shadow per graphic, soft and low; glow only on
  light-on-dark.
- **A repeated or reusable block** (a name tag used three times): precompose
  it and place the pre-comp three times, each with its own time offset.
- **A colour that changes on its own** (a hue drifting, a pulse toward white):
  a colour expression, hsl(time * 30, 80, 55) or mix(value, rgb(255, 255, 255),
  0.5 + 0.5 * sin(time * 4)), not a row of colour keys.
- **A heat shimmer, water or a flag:** the wave distort (amount a few pixels,
  wavelength near the size of the thing, phase keyed to move it); paper or
  glitch texture: displace with a small amount. Twirl, bulge and ripple are not
  offered: the export could not draw them the same as the preview.
- **A picture in a frame:** an image layer with fit cover (the default) or
  contain, and cropLeft/Top/Right/Bottom to cut to the part that matters.
- **A shape that draws itself filled:** trimTarget shape, trimEnd keyed 0 to
  100: the fill follows the line instead of sitting there whole.

## A lower third, as layers

1. A bar (rect, the brand colour) with a rect mask whose width is keyed 0 to
   full over 0.5 s, easeOutCubic.
2. The name (text, bold) above it with `textPreset` lineRise starting 0.15 s
   later; the role (text, lighter, smaller) with fadeByChar 0.1 s after that.
3. Hold at least 2.5 seconds; exit by keying the group's opacity, or the bar
   mask back to 0, over 0.3 s, easeInCubic.
4. Sit it in the lower safe area, clear of captions.

## When it may become a template

If the graphic will be reused with other words, colours or a logo (a lower
third, an end card), expose those as controls: setControl { control: { name,
kind: text|colour|number|image|toggle, bind: [{ layerId, prop }] } }. Name them
for the person filling it in ("Name", "Role", "Brand colour", "Logo"), bind
one colour control to every layer that should match, and leave the rest
locked. setControlValue { control, value } fills one; a saved template's fill
takes controls: { clipId: { name: value } }. A bound property cannot be
keyframed: animate its opacity or position instead.

## Gotchas

- setProps on a keyed property needs `time`: it sets the key there. Without
  time it is refused (a base value would not show).
- A locked layer refuses every edit until `setLayer { locked: false }`.
- A track matte uses the layer directly ABOVE; reordering changes the pairing.
- Expressions are a small language: names `time`, `value`, `index`,
  `duration`, and the listed functions. Anything else is refused with the list.
- Trim applies to a shape's stroke unless trimTarget is shape; then the fill is
  the trimmed piece closed with a straight line.
- A colour expression must give a colour (rgb, hsl, mix, value): arithmetic on
  a colour, and wiggle in one, are refused with what to write instead.
- A cropped cover or contain picture needs the picture loaded to draw; look at
  a preview frame, not the stored poster.

Related skills: motion-graphics, titles, text-led-video. Specialist: motion-designer.
