---
name: media-sourcing
description: "Sourcing visuals when footage is missing: library first, then stock, generation or designed graphics, with paid approval and quotes. Use when making a video from scratch or the brief needs b-roll, images or music."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Media sourcing

An empty timeline plus "make me a video" means you source the visuals, in this order.

## Workflow

1. **The media library first**, even when the timeline is empty: browse `agentWorkspace` action `media_index`. The user's uploads come before anything new.
2. **Stock** for literal subjects (`fetchStockMedia` with `mediaType` video, image or audio). One or two concrete words search better than a full brief.
3. **Generation** for stylised or impossible subjects (`generateMedia`), within access and the run's budget.
4. **Procedural graphics** (`addHtmlElement`, `addShapeClip`) for designed scenes, interfaces and diagrams.
5. **Lay picture across the whole duration first**, verify coverage, then decorate. Choose as many distinct scenes as the story needs, not a fixed asset count.

## Paid generation

- Creative freedom is not approval for unapproved paid generation. Video generation needs paid access (not trials or fully waived promotions; partial paid discounts remain eligible).
- If a paid route is blocked, continue with uploads or stock and do not retry it.
- Quote a model before spending (`quoteOnly:true` on the standalone tools), then submit that concrete provider with `maxCredits` equal to the quote.
- Never retry an uncertain submission or switch providers after a paid request, never silently substitute a provider or drop references, and do not use Google video models.

## Gotchas

- Every created clip gets a unique clipId. To swap footage, `replaceClipMedia` on the existing id; a second clip with the same id replaces the first.
- A stock or generated clip's metadata is not proof of content: inspect it before claiming what it shows.
- Music: only Lyria generation (`generateMedia` kind `music`) and CC0 stock audio are licence-safe for commercial export. Never send a music brief to speech generation.
- Respect a stated duration exactly.

For provider limits (durations, resolutions, references), read [references/generation-providers.md](references/generation-providers.md).

Related skills: music-bed, motion-graphics, production-motion.
