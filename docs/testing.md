# Testing skills

Three layers, cheapest first.

## 1. Lint (free, every change)

```bash
npm test          # lint + catalogue freshness + tool tests
npm run lint      # just the linter
node tools/lint-skills.mjs caption-styling --json
make lint         # same thing via make
```

Node 20 or newer; there is nothing to install. The linter is in
`tools/lint-skills.mjs` with its rules in `tools/lib/rules.mjs` and its own
tests in `tools/test/`. A change to a rule needs a test that fails without it.

CI also runs the reference validator from the Agent Skills project on every
skill. To run it locally (Python 3.11 or newer):

```bash
python -m venv .venv && . .venv/bin/activate
pip install "git+https://github.com/agentskills/agentskills.git#subdirectory=skills-ref"
skills-ref validate skills/core/caption-styling
```

Pin that install to a reviewed commit (`...agentskills.git@<sha>#subdirectory=skills-ref`)
in `.github/workflows/ci.yml` once the repository is public.

## 2. Evals (costs money, before merge)

`tools/run-evals.mjs` reads each skill's `evals/evals.json` and runs the
cases against OpenAI or Anthropic (see "Providers" below):

- **Trigger cases.** The model sees a catalogue of every skill in this
  repository plus seven realistic decoys (transcription, colour grading,
  music composition and so on) and is asked which skills it would load for
  the query. A should-trigger case passes when the skill is chosen in at least
  half the runs; a should-not-trigger case passes when it is chosen in fewer
  than half. Near misses are where descriptions fail, which is why they are
  required.
- **Output cases.** Each prompt runs twice, **with** the skill (its `SKILL.md`
  and reference files in context) and **without** it. A grader call then
  marks each assertion PASS or FAIL with quoted evidence. The report shows the
  pass rate for both and the delta.

```bash
export OPENAI_API_KEY=...               # or ANTHROPIC_API_KEY; with neither the runner skips and exits 0
npm run evals:dry                        # plan, call count and provider; no network
npm run evals -- caption-styling         # one skill
node tools/run-evals.mjs --changed main  # skills changed since main
EVAL_TRIGGER_RUNS=3 npm run evals -- audio-ducking   # steadier trigger rates
```

Results print as a summary and are written to `eval-results/report.json`
(with the provider and model that produced them).

Skills in `skills/vidmoat/` (the skills the Vidmoat editor loads) carry no
`evals/`, because the product format has no place for them: the product
repository evaluates them with its own trigger suite and replay evals on
every import. The runner skips them.

### Providers

| Keys in the environment | Provider used |
| --- | --- |
| `OPENAI_API_KEY` (with or without `ANTHROPIC_API_KEY`) | OpenAI, Responses API |
| only `ANTHROPIC_API_KEY` | Anthropic, Messages API |
| neither | none: "skipped", exit 0 |

`EVAL_PROVIDER=openai` or `EVAL_PROVIDER=anthropic` forces one; if its key is
missing the run is skipped and the message names the missing variable. Key
values are never printed. The prompts, the trigger rule (loaded in at least
half the runs), the grader prompt and the pass rates are the same code for
both providers, and `tools/test/tools.test.mjs` proves it: the same scripted
answers through a mocked OpenAI and a mocked Anthropic endpoint give an
identical report. Only the request and the response parsing differ.

Reasoning effort is `low` for trigger and grading calls and `medium` for
answers on both: `output_config.effort` for Anthropic, `reasoning.effort` for
OpenAI reasoning models (`gpt-5*`, `o*`; other OpenAI models get no effort
field). An `EVAL_MODEL` from the other provider's family (`claude-...` with
OpenAI, `gpt-...` with Anthropic) fails at once instead of spending a run on
404s.

A run **fails** when trigger accuracy is below `EVAL_MIN_TRIGGER_ACCURACY`
(default 0.7), when the skill makes output pass rates worse than the baseline,
or when a call errors. A run that hits a cost cap is reported as
incomplete.

### Cost caps

| Variable | Default | Meaning |
| --- | --- | --- |
| `EVAL_PROVIDER` | by key, OpenAI first | `openai` or `anthropic` |
| `EVAL_MODEL` | `gpt-5.6-luna` (OpenAI, the model Vidmoat itself uses), `claude-opus-5-5` (Anthropic) | Model for answering, triggering and grading |
| `EVAL_MAX_CALLS` | 150 | Hard ceiling on API calls per run |
| `EVAL_MAX_USD` | 3 | Stop once estimated spend passes this |
| `EVAL_PRICE_IN`, `EVAL_PRICE_OUT` | 1.25, 10 (OpenAI); 4, 20 (Anthropic) | Dollars per million tokens, for the estimate |
| `EVAL_TRIGGER_RUNS` | 1 | Runs per trigger query (3 is better, triples the cost) |
| `EVAL_FALLBACKS` | on | Anthropic only: set `0` to disable server-side refusal fallbacks |

A seed skill has 12 trigger cases and 3 output cases: 12 + 3 x 4 = 24 calls
per skill at one trigger run. The price defaults are the default models' list
prices; when you set `EVAL_MODEL`, set the price variables to match, or the
dollar cap will be wrong.

In CI (`.github/workflows/evals.yml`) pull requests evaluate only the skills
they change; a weekly scheduled run evaluates every core skill to catch
model drift; maintainers can run any set by hand. The workflow passes both
secrets, `OPENAI_API_KEY` and `ANTHROPIC_API_KEY`, and the `EVAL_PROVIDER`,
`EVAL_MODEL` and price repository variables; leave a variable empty for the
default. Pull requests from forks do not receive the keys, so the job prints
"skipped" and passes; a maintainer
runs it with **Run workflow** after reading the change. The workflow uses
`pull_request`, never `pull_request_target`, so fork code never runs with
secrets.

### Reading results

- **Should-trigger misses**: the description is too narrow. Add the user
  intent it missed as a category, not the literal words of the query.
- **Near-miss false triggers**: the description is too broad. Say what the
  skill does not do, or sharpen what it does.
- **Assertions that pass with and without the skill**: the model already knows
  this. Remove the assertion, or the guidance it tests.
- **Assertions that fail in both**: the assertion or the case is broken, or
  the skill is not explaining something it should.
- **Negative delta**: the skill is confusing the model. Cut before you add.

Keep the split described in [optimizing descriptions](https://agentskills.io/skill-creation/optimizing-descriptions)
in mind: if you tune a description against the trigger cases, hold some back
to check it generalises.

## 3. By hand (before core promotion)

Run the skill in a real client on a real task, read the transcript, and look
at the output (rendered frames, measured audio). Anything you had to correct
becomes a gotcha and an eval case.
