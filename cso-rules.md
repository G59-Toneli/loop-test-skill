# cso-rules

## 1) Policy levels

- REQUIRED: mandatory for publish-ready quality.
- RECOMMENDED: default unless context justifies deviation.
- OPTIONAL: use only when it adds concrete value.

## 2) Description standard

Frontmatter `description` is REQUIRED to:
- start with `Use when...`
- describe trigger conditions only
- avoid summarizing workflow
- stay third-person and specific

Good:
- `Use when a feature, bugfix, or refactor needs deterministic validation with high regression risk or flaky behavior.`

Bad:
- `Use when validating changes by choosing method, creating scenarios, and iterating through failures.`

RECOMMENDED hard check (publish gate):
- `name` and `description` exist in frontmatter
- description length <= 500 chars
- total frontmatter <= 1024 chars

## 3) Naming standard

REQUIRED:
- use lowercase letters, numbers, hyphens
- prefer action-oriented names

RECOMMENDED:
- avoid vague or overloaded labels

## 4) Keyword coverage

RECOMMENDED search terms:
- symptoms: flaky, nondeterministic, race condition
- artifacts: execution board, todo, matrix, checklist, regression, escalation, merge decision
- artifacts: context dossier, execution board, todo, matrix, checklist, regression, escalation, merge decision
- testing context: api-journey, browser-journey, hybrid, unit, integration, e2e, risk-tier
- command/ux terms: /loop-test, context harvest, pre-test grill, risk map, profile, quorum, deterministic validation, playwright, mcp chrome devtools

## 5) Token efficiency

REQUIRED:
- keep `SKILL.md` focused on contract + execution flow
- avoid duplicated guidance across files

RECOMMENDED:
- move deep detail to companion docs

## 6) Cross-reference rule

When another skill is mandatory, write explicitly:
- `REQUIRED SUB-SKILL: <skill-name>`

REQUIRED:
- avoid force-loading references in body text
- prefer plain references like `testing-playbook.md` over eager-load syntaxes

RECOMMENDED: avoid long inline references when one pointer is enough.
