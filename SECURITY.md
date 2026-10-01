# Security policy

Skills are instructions that an agent reads and acts on, often with access to a
shell, files and credentials. We treat a skill like code that runs on the
reader's machine, because in effect it does.

## Reporting a vulnerability

Please **do not open a public issue**. Report privately through GitHub:
**Security > Report a vulnerability** on this repository (private
vulnerability reporting). Include:

- the skill, file and line, or the tool or workflow affected;
- what an agent or a CI run would do as a result;
- a proof of concept if you have one (for hidden characters, a hex dump of the
  bytes is ideal).

We aim to acknowledge reports within 3 working days and to ship a fix or a
mitigation for confirmed issues in core skills within 14 days. We credit
reporters in the release notes unless you ask us not to.

## What counts

In scope:

- **Prompt injection in skill text**: instructions that steer an agent away
  from the user's task, conceal actions from the user, read or send
  credentials, or write themselves into other agent configuration files
  (`CLAUDE.md`, `AGENTS.md`, `.cursorrules`, settings files) to persist.
- **Hidden content**: Unicode tag characters (U+E0000 to U+E007F), zero-width
  and bidirectional control characters, HTML comments, or any text a reviewer
  would not see in a rendered diff but a model would read.
- **Malicious or unsafe scripts**: network access, package installs,
  download-and-execute, writing outside the working directory, or reading
  secrets.
- **Supply chain**: a way to get unreviewed content loaded by people who pinned
  a release, or by Vidmoat production (which loads only `skills/core/` at a
  pinned commit).
- **CI**: anything that exposes the eval API key, or lets a fork's code run with
  repository secrets.

Out of scope: advice in a skill that is merely wrong (open a normal bug), and
issues in third-party clients that load skills (report those to the vendor).

## Rules every skill must meet

CI enforces these on every pull request (see
[docs/security.md](docs/security.md) for the threat model and rule ids):

- no hidden Unicode or control characters in any text file;
- no HTML comments in Markdown;
- no prompt-injection or exfiltration phrasing;
- scripts make **no network calls** and **install no packages**;
- no download piped into an interpreter, anywhere;
- no symbolic links, no binaries outside `assets/`, and file size limits;
- `allowed-tools` in a community skill requires a maintainer label.

A clean lint is necessary, not sufficient: maintainers also read every changed
line of a skill before merging.
