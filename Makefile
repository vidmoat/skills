NODE ?= node

.PHONY: lint test catalogue catalogue-check evals evals-dry

lint:
	$(NODE) tools/lint-skills.mjs

test:
	$(NODE) tools/lint-skills.mjs
	$(NODE) tools/catalogue.mjs --check
	$(NODE) --test

catalogue:
	$(NODE) tools/catalogue.mjs

catalogue-check:
	$(NODE) tools/catalogue.mjs --check

evals:
	$(NODE) tools/run-evals.mjs

evals-dry:
	$(NODE) tools/run-evals.mjs --dry-run
