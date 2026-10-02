# Vidmoat skills

The skills the Vidmoat editor loads: its specialists (the editors its agent
consults), its editing craft, the glossary and the manual for agents that edit
in Vidmoat over MCP. This folder is their master copy. The editor imports it
at a pinned, reviewed commit; nobody edits these skills inside the product.

They are written for Vidmoat's editing commands (`addTitle`, `musicBed`,
`punchIn` and so on), and the craft in them (pacing, J and L cuts, colour,
caption timing) carries to any editor. Install them with the
`vidmoat-editor` plugin, or copy a folder; see the [README](../../README.md).

## Changing one

1. Open a pull request against `skills/vidmoat/<name>/`, signed off.
2. Keep to the product format, which the linter checks here (SK029):
   `SKILL.md`, `references/*.md`, `scripts/` and `assets/`, one level deep;
   no `evals/` folder (the product evaluates these skills itself);
   `metadata.owner` and `metadata.category`; no em dashes. Bump
   `metadata.version`.
3. Name only commands that exist in the editor. The product checks this at
   import and refuses a skill that teaches an invented command.
4. After merge, a maintainer imports the commit into the product and it ships
   with the next deploy. See [docs/product-import.md](../../docs/product-import.md).

Only skills in this folder may carry `vidmoat` in their name (SK005).
