# Git Workflow

---

## Branches

| Branch  | Purpose                           | Rules                          |
| ------- | --------------------------------- | ------------------------------ |
| main    | Production-ready, tagged releases | No direct commits; PR required |
| develop | Integration branch                | No direct commits; PR required |

Branch types, created from `develop`: `feat/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`.
Name them descriptively: `feat/button-press-spring`, not `feature-1`.

## Conventional Commits

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
**Scopes** (enforced by commitlint): `tokens`, `registry`, `cli`, `docs`, `motion`, `a11y`, plus
`repo` for root/tooling changes.

Subject: imperative mood, no capital first letter, no trailing period, ≤72 chars.

Examples:

```
feat(motion): add anticipate easing to toast swipe dismissal
fix(tokens): correct warning-text contrast on light surface
docs(registry): document both install doors on the Button page
chore(repo): add prettier + husky
```

## Commit body (required)

Every commit **MUST include a body** (only a truly trivial one-liner - a typo fix - may skip it):

- Blank line after the subject.
- Wrap at ~72 characters.
- Explain **what** changed and **why**, not **how**.
- Use bullet points for multiple changes.

```
feat(tokens): add status-text tokens

Colored status text needs its own tokens because the fill hues fail AA as
text (warning-as-text measures ~2.4:1 on light). --{status}-text pairs with
surfaces, while --{status} stays a fill audited against its foreground.

- Add --destructive-text / --success-text / --warning-text (light + dark)
- Document the two-role split at the foot of theme.css
```

## Writing style

Full rules in `.claude/rules/writing.md`. For commits and PRs:

- Hyphens (`-`), not em dashes or en dashes, in commit messages, PR titles and bodies, comments.
- Never mention Claude or AI in commit messages or PRs, not even in a Co-Authored-By trailer.
- Bold only for genuine emphasis, never as decoration.

## Before opening a PR

```bash
bun run lint && bun run typecheck && bun run format:check && bun run build
```

Merge strategy: **squash and merge** into `develop` for a clean, linear history.

## GitHub templates (MUST use)

- Pull requests — fill in and follow `.github/pull_request_template.md` completely (every
  section plus the checklist). When creating a PR with `gh pr create`, pass this template's content
  as the body; never open a PR with an ad-hoc description.
- Issues — use the matching template in `.github/ISSUE_TEMPLATE/`: `bug_report.md` for defects,
  `feature_request.md` for proposals (which includes the register check for new components).

## Authoring commits

Author commits with `bunx merlin` — the interactive conventional-commit wizard (the `merlin-commit`
dev dependency). It reads `commitlint.config.js`, so its type/scope choices match the enforced rules.

## Hooks (Husky)

- `pre-commit` — `lint-staged` (Prettier on staged files) then `bun run typecheck`.
- `commit-msg` — `commitlint` validates the message against the config above.
- `pre-push` — `bun run build`. (A `test` step joins this once a runner is wired up.)

`bun run knip` (unused files/deps/exports) is a **manual** check for now — it reports expected
scaffold items (e.g. the `cn` util, fumadocs exports) until there is feature code, so it does not gate
pushes yet. It becomes a `pre-push`/CI gate once components land.

Bypass only in genuine emergencies (`--no-verify`); if a hook has a bug, fix the hook.
