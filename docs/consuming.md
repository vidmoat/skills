# Consuming these skills

## Channels

| Ref | What it is | Use it for |
| --- | --- | --- |
| `vYYYY.MM.DD` tags | Immutable releases with a zip and `SHA256SUMS` | Production |
| `stable` branch | Moves to each release tag | People who want updates, but only released ones |
| `latest` branch | Follows `main` | Trying changes early |
| A commit SHA | Exactly one tree, forever | Production |

Each skill also carries its own `metadata.version` (semver), listed in every
release's notes. A major bump means a default changed: read the CHANGELOG
before taking it.

## Claude Code

```text
/plugin marketplace add vidmoat/skills#stable
/plugin install vidmoat-core@vidmoat-skills
```

The marketplace file is `.claude-plugin/marketplace.json`. It defines two
plugins: `vidmoat-core` (the `skills/core/` set) and `vidmoat-community`
(listed only once community skills exist). Plugins carry no `version`, so
Claude Code tracks commits on the ref you added; on `#stable` that means you
receive each release. Background auto-update is off unless you turn it on in
`/plugin` under Marketplaces.

To share the marketplace with everyone in a project, run once in that project
and commit the resulting `.claude/settings.json`:

```bash
claude plugin marketplace add vidmoat/skills#stable --scope project
```

## Other clients

Copy skill folders into the client's skills directory (see the README for
paths). Prefer a release zip and verify it:

```bash
TAG=v2026.10.01
curl -LO https://github.com/vidmoat/skills/releases/download/$TAG/vidmoat-skills-$TAG.zip
curl -LO https://github.com/vidmoat/skills/releases/download/$TAG/SHA256SUMS
sha256sum -c SHA256SUMS
unzip vidmoat-skills-$TAG.zip
cp -r vidmoat-skills/skills/core/audio-ducking .agents/skills/
```

## Production (including Vidmoat's own product)

Skills are instructions your agent will follow. Load them like a dependency
you have audited:

1. **Load only `skills/core/`.** Community skills are reviewed but are not
   curated for production; Vidmoat's product never loads them automatically.
2. **Pin an exact commit SHA or a release archive sha256**, never a branch.
   Record it in your own repository, for example:

   ```json
   {
     "source": "https://github.com/vidmoat/skills",
     "ref": "v2026.10.01",
     "commit": "<40-character sha>",
     "archive_sha256": "<64 hex characters>",
     "skills": ["caption-styling", "audio-ducking"]
   }
   ```

3. **Verify on fetch**: refuse to load if the archive digest or the checked-out
   commit does not match the pin.
4. **Re-lint before loading.** Run `node tools/lint-skills.mjs` from the pinned
   tree in your build; it needs no dependencies. It rejects hidden Unicode,
   HTML comments and unsafe scripts even if something slipped past review.
5. **Upgrade deliberately**: read the diff between pins, run the evals for the
   skills you load, then move the pin in a reviewed change.
6. **Run scripts sandboxed**, without network access, as any untrusted code.

For a Claude Code plugin entry pinned the same way, use a `github` source with
both `ref` and `sha`:

```json
{
  "name": "vidmoat-core",
  "source": { "source": "github", "repo": "vidmoat/skills", "ref": "v2026.10.01", "sha": "<40-character sha>" },
  "strict": false,
  "skills": ["./skills/core/caption-styling", "./skills/core/audio-ducking"]
}
```

or an `archive` source with `sha256`, which Claude Code refuses to install if
the download does not match.

## Branch protection the owner must configure

- `main`: require pull requests, the CI, DCO and catalogue checks, and a
  CODEOWNER review; no force pushes.
- `stable` and `latest`: only the release workflow may push (allow the GitHub
  Actions bot, block everyone else).
- Tags `v*`: protected; created only by maintainers, ideally signed.
