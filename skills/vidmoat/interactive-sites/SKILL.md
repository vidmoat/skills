---
name: interactive-sites
description: "A hosted site for someone's interactive videos: pages, blocks, theme, publishing. Use for a site, portfolio or link page."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.1"
  owner: "vidmoat"
  category: "craft"
---

# Building an interactive site

A site at `https://{prefix}.interactive.vidmoat.com` is a home for the person's own interactive videos with nothing of ours around them. The videos are the point; the site is the frame. Every page should get a visitor to a player within one screen.

The tools: `get_interactive_site`, `edit_interactive_site`, `publish_interactive_site` (MCP and the API). In the app the same calls go through `agentWorkspace` with `action: "interactive_site"` and `site: {tool, ...arguments}`.

## Workflow

1. **Read first.** `get_interactive_site` with `videos: true`. It says whether a site exists (`canCreate`), its pages and every `sectionId`, its `problems` and its `rev`. Change only what was asked, by `sectionId`, and send `rev` back.
2. **Only published, shared videos.** A site shows the account's own interactive videos whose choices are published and shared; `videos: true` lists exactly those, with ids. A video the person names that is not on the list is published first (`publish_interactive` with `share: true`, when they agree), never guessed or swapped for another.
3. **Name it once.** Check a name with `get_interactive_site` and `prefix: "name"` (limited: one or two tries, not a loop over ideas), then `edit_interactive_site` with `create: {prefix, title}`. Use the person's own name or brand; one site per account.
4. **One theme.** `setTheme`: `tone` (`dark`, `light`), `palette` (`warm`, `neutral`, `cool`, `forest`, `plum`), `font` and `headingFont` (`system`, `serif`, `mono`, `rounded`), `corners` (`soft`, `round`, `square`), `density` (`comfortable`, `compact`, `airy`), `width` (`normal`, `narrow`, `wide`), `playerAccent` (`video` keeps each video's own look, `site` uses the site's), `accent` `#RRGGBB`. Match the films: dark for cinematic or night footage, light for tutorials and courses. Leave a token out to keep its default.
5. **Home page in this order:** a `hero` (heading, a line, the strongest video as `video`, a button), then a `grid` of the rest, then whatever explains (`story` for a branching film, `text`, `about`), then a `cta` or `links` last. One featured video, not three.
6. **Few pages.** Home alone is often enough. Add `films` or `about` pages only when there is more than one screen of it. `setNav` lists them; `setHeader` gives the title, a tagline and a logo from `images: true`.
7. **Batch the edit.** One `edit_interactive_site` call with all the `ops` (applied all or none), then read the reply's `problems`.
8. **Show, then publish.** Give the person `previewUrl` (their draft at its real address, for an hour). Publish with `publish_interactive_site` only when they ask: it is a public page. `publish: false` takes it down at once.

## Examples

```json
{"create": {"prefix": "river-films", "title": "River Films"}}
```

```json
{"rev": 3, "ops": [
  {"op": "setTheme", "tone": "dark", "palette": "cool", "headingFont": "serif", "accent": "#4CC9F0"},
  {"op": "setHeader", "title": "River Films", "tagline": "Short films you play"},
  {"op": "addPage", "slug": "films", "title": "Films"},
  {"op": "setNav", "links": [{"label": "Home", "page": ""}, {"label": "Films", "page": "films"}]},
  {"op": "addSection", "page": "", "section": {"kind": "hero", "heading": "Films where you choose what happens next", "body": "Pick a path, then go back and take the other one.", "video": "<id from videos:true>", "cta": {"label": "See every film", "page": "films"}}},
  {"op": "addSection", "page": "", "section": {"kind": "grid", "heading": "Play them all", "videos": ["<id>", "<id>"], "columns": 3}},
  {"op": "addSection", "page": "", "section": {"kind": "story", "video": "<id>", "heading": "How it branches"}}
]}
```

```json
{"rev": 4, "ops": [{"op": "updateSection", "sectionId": "<from the digest>", "set": {"heading": "New films every month", "body": null}}]}
```

## Gotchas

- **No custom code.** No HTML, CSS, scripts, embeds or "custom styling" anywhere; never offer them. A refused value comes back with the allowed list: pick from it.
- **Page `""` is home.** Other pages are slugs (`films`, `about`); a renamed slug carries its links with it.
- **Buttons** (`cta`) are `{label, page}` or `{label, href}` with an `https` address. `links` are https only.
- **`text` is restricted Markdown:** `##` and `###`, lists, bold, italic, https links. No HTML, no images.
- **`about` takes a picture id** from `images: true`, never a URL.
- **An accent can be refused** when words on it, or it on the page, would be hard to read. Try a lighter accent on dark, a deeper one on light.
- **Limits are refused, never cut:** 6 pages, 12 sections a page, 12 videos a grid, 6 nav links, 10 links; a heading 90 characters, body text 600. Shorten the words yourself.
- **`null` removes** an optional field in `updateSection`; leaving it out keeps it.
- **Search engines can find a published site** (a sitemap and video data come with it). Write each page's `title` and `description` for a stranger searching; `setSettings` `indexing: false` keeps a site out when the person wants it private.
- **A story map spoils games.** By default it shows only the opening and its answers, with the scenes and endings counted. Use `reveal: "full"` only for a lesson or a guide, never for a game or mystery, and never next to copy that promises a secret.
- **Posters matter.** Players and grid cards show the video's poster until played; pick videos whose poster is a real title card, not a black first frame.
- **Renaming the address** (`edit_interactive_site` with `prefix`) holds the old name and forwards it for a while; do not rename casually.
- **Hobby accounts** are refused with the reason; say it plainly, do not work around it.
