---
name: motion-graphics
description: "Designed graphics with HTML elements, animating the objects inside them on the timeline clock. Use for animated stat cards, infographics, diagrams, UI mockups, logo stings, or moving an object inside a graphic."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Motion graphics

`addHtmlElement` is for designed containers and layouts; text and caption commands are for plain words.

## Workflow

1. **Read the contract first:** search `searchCatalogue` kind `commands` for the exact id `addHtmlElement` and read its full authoring contract before writing markup.
2. **Size from content and space:** let the copy and the available area decide size, styling and placement. A lower third does not always need a dark panel; a stat does not always need a gradient card.
3. **Animate on the timeline clock,** using the supported timeline-driven animation contract. Wall-clock CSS animation is not timeline playback and will not export.
4. **Container versus objects:** a transform on one HTML clip moves its entire composition, not its children. To move an object inside, read that clip's HTML and animate the intended child elements on the timeline, or use separate real clips. Keep attached details in the same moving container.
5. **Custom components:** TSX motion components compile through `agentWorkspace` action `motion_compile` (workflow `motion-authoring`) when scripting is available.
6. **Verify** object positions at several times on rendered frames. A camera zoom alone cannot satisfy an object action.

## Gotchas

- Inline SVG needs `xmlns` or it renders as zero pixels, silently.
- An HTML element that paints a solid full-frame background hides everything beneath it for its whole duration; make the root transparent.
- If the user says a change is absent, inspect the saved result and change the actual mechanism instead of repeating the same keyframes.
- Designed UI, diagrams and procedural graphics can show a workflow without paid image generation.

Related skills: titles, text-led-video. Specialist: motion-designer.
