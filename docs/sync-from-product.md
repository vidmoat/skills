# Syncing skills from the product repository

Vidmoat's product repository keeps its own `skills/` folder: the editing craft
and the specialists written as Agent Skills, some of which mention product
internals (command names, internal services, project data shapes). This
repository publishes the subset that is useful outside the product, rewritten
so it works in any editor or with ffmpeg.

Nothing syncs automatically. There is no cross-repository automation with
credentials, by design.

## Direction of travel

```
product repo skills/<name>/      (private, may reference engine internals)
        |
        |  export script, run by a maintainer, approved skills only
        v
vidmoat/skills  skills/core/<name>/   (public, tool-agnostic, linted, evaluated)
        |
        |  pinned commit or release digest
        v
product production loads skills/core/ at the pin
```

Changes that start here (community gotchas, fixes from outside contributors)
flow back by a normal pull request in the product repository, reviewed there.

## The export script (lives in the product repository)

A script in the product repository, for example
`scripts/export-public-skills.mjs`, should:

1. **Read an allowlist**, such as `skills/PUBLIC.json`, naming the skills that
   are approved for publication and who approved them. Nothing outside the
   allowlist is copied.
2. **Copy each approved skill** into a fresh clone of `vidmoat/skills` on a new
   branch, under `skills/core/<name>/`.
3. **Strip private material**:
   - drop files or sections marked private (for example a
     `references/internal-*.md` naming convention, or fenced blocks marked
     `private`);
   - fail, rather than silently remove, if the remaining text contains a
     denylisted term: internal host names and URLs, product-only command or
     tool names without an explanation, environment variable names,
     project or customer identifiers, file paths from the product tree;
   - keep `metadata.version` and bump it if the public text changed.
4. **Run this repository's checks** in the clone: `npm test`, plus
   `npm run evals -- <name>` when a key is available locally.
5. **Commit with a sign-off** (`git commit -s`) and push the branch using the
   maintainer's own credentials, then open a pull request (for example with
   `gh pr create`). The pull request description lists the source commit in the
   product repository and the stripped sections.
6. **Never push to `main`**. The pull request goes through the same review,
   CODEOWNERS and CI as any other change.

The denylist belongs in the product repository, next to the script, because
it is itself sensitive.

## Rewriting for the public

Product skills can lean on the product's tools. Before a skill is approved for
export, its public version must:

- give a tool-agnostic procedure and an ffmpeg (or other free tool) path for
  every action the product does with its own commands;
- explain any product term it keeps ("a caption preset, meaning a saved
  style");
- carry evals that run without the product (no tool calls into the engine);
- keep the gotchas, generalised from the incident that produced them, without
  project names, customer data or internal identifiers.

The two seed skills, `caption-styling` and `audio-ducking`, were written this
way from the product's caption, audio and specialist guidance.

## Keeping them in step

- When a public skill changes here, the product picks it up only by moving its
  pin (see [consuming.md](consuming.md)).
- When the product skill changes, the maintainer re-runs the export, and the
  diff shows exactly what will become public.
- If both changed, the product repository is the source of truth for craft;
  merge public fixes into it first, then export.
