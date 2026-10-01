# Contributing

Thank you for helping. This repository publishes video editing craft as Agent
Skills, and a skill is only worth loading if it makes an agent measurably
better at a task. Everything below serves that.

## Ways to contribute

| You have | Do this |
| --- | --- |
| A correction from a real failure ("the agent did X, it should do Y") | Open a **Gotcha report** issue, or a pull request adding it to the skill's Gotchas section |
| A bug in an existing skill (wrong number, broken recipe, bad trigger) | Open a **Bug in a skill** issue with the prompt, what happened and what should have |
| An idea for a new skill | Open a **New skill** issue first, so we can agree the scope before you write it |
| A new skill, ready | Pull request into `skills/community/<name>/` |

Maintainers may later promote a community skill to `skills/core/`. Only core
skills are loaded by Vidmoat's product, so promotion needs a maintainer from
the relevant domain in [CODEOWNERS](.github/CODEOWNERS) and a passing eval run.

## Proposing a new skill

1. **Open an issue** with the New skill template. Say what task it covers,
   what an agent gets wrong today without it, and two or three real prompts.
2. **Scope it as one coherent unit of work**, like a function. "Caption
   styling" is a skill; "everything about text in video" is not.
3. **Build it** under `skills/community/<name>/`:

   ```
   skills/community/<name>/
     SKILL.md            required
     evals/evals.json    required
     references/         optional, one level deep
     scripts/            optional, standard library only
     assets/             optional, the only place for binary files
   ```

4. **Run the checks** with Node 20 or newer (no install step):

   ```bash
   npm test            # or: make test
   ```

5. **Open a pull request** using the template, with every commit signed off.

## Required evals

`evals/evals.json` has two parts. The linter (rule SK023) enforces the minimums.

```json
{
  "skill_name": "your-skill",
  "trigger_cases": [
    { "id": "t1", "query": "a realistic prompt that should load the skill", "should_trigger": true },
    { "id": "t7", "query": "a prompt that shares words but needs something else", "should_trigger": false, "near_miss": true }
  ],
  "evals": [
    {
      "id": 1,
      "prompt": "a realistic task",
      "files": ["evals/files/input.srt"],
      "expected_output": "what a good answer contains",
      "assertions": ["a checkable statement", "another one"]
    }
  ]
}
```

- **Trigger cases:** at least 5 that should load the skill and 5 that should
  not. At least 3 of the negatives must be **near misses**, marked
  `"near_miss": true`: prompts that share keywords with the skill but need
  something else ("translate my subtitles" for a caption styling skill). Vary
  phrasing, detail and formality; include casual and typo-ridden prompts.
- **Output cases:** at least 2, each with at least 2 assertions. Assertions
  must be checkable from the answer ("states a target of -14 LUFS"), not
  vibes ("the answer is good"). CI runs each case **with and without** the
  skill; a skill that does not beat the baseline will not be merged.
- Put input files under `evals/files/`. Keep them small and synthetic; never
  commit customer media or anything you do not have the right to share.

See [docs/testing.md](docs/testing.md) to run evals locally and read the results.

## Style rules

These come from what makes skills work in practice
([agentskills.io best practices](https://agentskills.io/skill-creation/best-practices)).

- **Concise.** Write what the agent would get wrong without you, and cut the
  rest. Do not explain what a codec or a subtitle is. `SKILL.md` must stay
  under 500 lines (SK011); aim for well under 5,000 tokens.
- **Defaults, not menus.** Pick one approach and give it. Mention an
  alternative only with the condition that calls for it ("use a sidechain when
  there are no speech timings").
- **Explain why.** "Hold the duck through short pauses, because releasing
  between phrases sounds like pumping" beats "ALWAYS hold the duck".
- **Numbers over adjectives.** "17 characters per second" not "not too fast".
  Every number should be one you measured or can source.
- **Gotchas from real failures.** Every skill needs a `## Gotchas` section
  (SK024). Each gotcha is a concrete fact that defies a reasonable assumption,
  ideally with what was measured. "Handle errors carefully" is not a gotcha.
- **One level of references.** `SKILL.md` may link to `references/x.md`;
  reference files must not send the agent on to further reference files
  (SK013). Tell the agent when to read each file.
- **Tool-agnostic.** Write for any editor, with an ffmpeg (or other
  free-tool) path for people without one. If you name a product feature,
  explain what it does so the advice survives in other tools.
- **Description says what and when.** It is the only part loaded up front, so
  it decides whether the skill is ever used. State what the skill does, then
  "Use when...", including cases where the user does not name the domain.
  40 to 1,024 characters (SK006, SK007). See
  [docs/authoring.md](docs/authoring.md#descriptions).
- **Plain text.** No HTML comments, no hidden or zero-width characters, no
  instructions aimed at anything but the task (SK015, SK016, SK025).
- **No em dashes** in skill text; use a comma, colon or full stop.

## Scripts

Scripts are optional, and must be:

- standard library only, with no package installs (SK018);
- free of network access: no HTTP clients, sockets, `curl`, or URLs in code
  (SK017);
- deterministic, with a `--help`, clear error messages and non-zero exit codes
  on failure;
- covered by a test in `tools/test/` when they compute something the skill
  relies on.

`allowed-tools` in frontmatter pre-approves tool use in some clients. It is not
allowed in community skills unless a maintainer applies the
`allowed-tools-approved` label after reviewing the list (SK019).

## Naming and trademarks

Skill names are lowercase letters, digits and single hyphens, and must match
the folder. They must not contain `claude` or `anthropic`, and community skills
must not contain `vidmoat` (see [TRADEMARKS.md](TRADEMARKS.md)).

## Versioning

Each skill carries `metadata.version` in semver. Bump it in the same pull
request as the change:

- **patch**: wording, typo, a new gotcha that does not change behaviour;
- **minor**: new guidance, a new reference file or script, new eval cases;
- **major**: a changed default (a number the agent will now use differently),
  a renamed or removed file, or a narrower description.

Add a line to [CHANGELOG.md](CHANGELOG.md) under "Unreleased".

## Developer Certificate of Origin

We use the [Developer Certificate of Origin](https://developercertificate.org)
instead of a CLA. By signing off a commit you certify that you wrote it, or
otherwise have the right to submit it under this repository's licences.

Sign off every commit with `-s`, using your real name and the email on the
commit:

```bash
git commit -s -m "caption-styling: add gotcha about Windows font paths"
```

Forgot? `git rebase --signoff main` and force-push your branch. The DCO check
in CI tells you which commits are missing it.

## Licences of contributions

By contributing you agree that code (scripts, tools, workflows) is licensed
under [Apache-2.0](LICENSE) and prose (skills, references, evals, docs) under
[CC-BY-4.0](LICENSE-CONTENT), as described in the README.

## Review

- Every pull request needs a passing lint, catalogue and DCO check.
- Maintainers run evals for pull requests from forks, because forks do not
  receive the API key secret.
- A CODEOWNER for the skill's domain approves changes to `skills/core/`.
- Security-sensitive changes (scripts, `allowed-tools`, workflows, `tools/`)
  need a second maintainer.

Be kind; see the [Code of Conduct](CODE_OF_CONDUCT.md).
