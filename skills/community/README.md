# Community skills

Skills in this folder are contributed by anyone. They go through the same
linting, security checks and maintainer review as core skills, and they need
the same evals. They differ from `skills/core/` in two ways:

- **They are never loaded automatically by Vidmoat's product.** Production
  loads only `skills/core/`, at a pinned commit.
- **They install separately.** In Claude Code they are the
  `vidmoat-community` plugin, so nobody gets them without choosing to.

## Adding one

1. Open a **New skill** issue to agree the scope.
2. Create `skills/community/<name>/` with `SKILL.md` and `evals/evals.json`.
   The name must not contain `vidmoat`, `claude` or `anthropic` (only the
   official product skills in `skills/vidmoat/` may use the Vidmoat name).
3. Run `npm test` and fix what it reports, then run `npm run catalogue` so the
   README table and the marketplace list include your skill.
4. Open a pull request with signed-off commits.

Details: [CONTRIBUTING.md](../../CONTRIBUTING.md) and
[docs/authoring.md](../../docs/authoring.md).

## Promotion to core

A community skill can move to `skills/core/` when a maintainer from its domain
agrees to own it, its evals pass with a positive delta over the baseline, and
it has been used on real tasks. Promotion is a pull request that moves the
folder; the skill keeps its name and version history.
