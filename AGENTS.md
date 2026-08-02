# AGENTS.md

Guidance for any AI coding agent (Claude Code, Cursor, Copilot, Codex, Gemini CLI, …) working in
this repository. This is the tool-agnostic source of truth; `CLAUDE.md` imports it and adds the
Claude Code-specific path-scoped rules.

**Design source of truth**: `apps/docs/spec/kuhaku-spec.md` (the full v1.0 specification — read the
relevant Part before touching foundations, motion, components, or distribution).
**Architecture**: `.claude/guides/architecture.md`

---

## Project Overview

Kuhaku (空白) is a motion-first design system distributed like shadcn: open source-code
distribution through a shadcn-compatible registry, built on Base UI, opinionated like Apple.

| Property        | Value                                                |
| --------------- | ---------------------------------------------------- |
| **Repo**        | Turborepo monorepo (`apps/*`, `packages/*`)          |
| **Package mgr** | `bun@1.3.11`                                         |
| **Node**        | >=20                                                 |
| **Language**    | TypeScript strict, ESM (`moduleResolution: bundler`) |
| **CLI**         | `kuhaku` · packages `@kuhaku/*`                      |
| **License**     | MIT                                                  |
| **Status**      | Pre-release. Nothing is stable yet.                  |

---

## The three concepts (why the numbers are what they are)

Kuhaku is organized around three Japanese aesthetic principles. Knowing them is how you make
decisions that fit the system instead of fighting it:

- **Kuhaku (空白) — space.** Emptiness is the material, not the gap. Generous spacing, restraint,
  what is deliberately left blank. Airy defaults; density is the argued exception.
- **Ma (間) — time.** The interval is part of the motion: the delay before a tooltip, the stagger
  between items, the hold between an exit and its answering entrance. Intervals are composed, never
  residual.
- **Jo-ha-kyū (序破急) — pacing.** Every motion has one shape: gentle onset, acceleration, decisive
  close. Nothing lurches in; nothing trails out. Exits are faster than entrances.

---

## Workspace map

| Workspace           | Job                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `packages/tokens`   | CSS token layer _as data_ (`theme.css`, `motion.css`, `tailwind.css`). Plain CSS, no Tailwind by design. |
| `packages/registry` | Component source of truth + `registry.json`; shadcn registry-item schema, byte-for-byte.                 |
| `packages/cli`      | The `kuhaku` CLI (`init`/`add`/`apply`/`diff`) — thin orchestration over shadcn's logic.                 |
| `apps/docs`         | Next.js 16 + Fumadocs: docs site, registry host (`/r/[name].json`), and llms/MCP surfaces.               |

Full detail: `.claude/guides/architecture.md`

---

## Critical Rules (always active)

### Security & architecture invariants (MUST follow)

1. **Base UI never leaks.** Import `@base-ui/react/*` internally only. No barrel re-export of Base
   UI, no public prop typed as a `@base-ui/*` type. Enforced by the registry-build lint.
2. **Components consume semantic tokens, never `--neutral-*`.** The internal ramp is wiring.
3. **No telemetry, no network calls home.** Privacy-first.
4. **CLI writes are confined to the target project root**; never construct paths from unchecked
   input; confirm before overwriting adopter files; honor `--dry-run`/`--diff`.
5. **No `eval` / `new Function`.** Validate registry JSON against the schema before acting on it.
6. **Any child-process call uses `execa` with an args array, never string interpolation.**

Full detail: `.claude/rules/security.md`

### TypeScript (MUST follow)

- `type` over `interface` (interface only for declaration merging)
- **Never `any`** — use `unknown` + narrowing
- `===`/`!==`; `??` (not `||`) for defaults; optional chaining
- Early-return guard clauses over nested `if`; functions < ~50 lines
- `import type` for type-only imports; explicit return types on exported functions

Full detail: `.claude/rules/typescript.md`

### Motion (MUST follow — this is the wedge)

- **Motion is functional or it does not exist** (causality / provenance / continuity / attention).
- **Tier 2 components consume `--motion-*` tokens only — never per-component motion props.**
- **Compositor-only**: animate `transform` and `opacity`. The one sanctioned layout animation is
  height expansion via `grid-template-rows: 0fr → 1fr`.
- Reduced-motion and AAA strict mode are token-level remaps — do not hand-roll per-component.

Full detail: `.claude/rules/motion.md`

### Writing style (MUST follow)

kuhaku speaks in one voice: calm, confident, declarative, argued. Full rules in
`.claude/rules/writing.md`. In short:

- Hyphens (`-`), never em dashes (`—`) or en dashes (`–`), in all generated text.
- No exclamation marks, no emoji, no hype adjectives; show the behavior and state the reason.
- Bold only for genuine emphasis, never as decoration on bullet lead-ins or labels (a bolded "TLDR"
  is the one accepted exception).
- Never mention Claude or AI in commit messages or PRs (titles and bodies), not even in a
  `Co-Authored-By` trailer.

---

## Area-specific rules

Deeper, area-specific rules live in `.claude/rules/*.md`. Claude Code auto-loads each when its
`paths:` glob matches the file you are editing; other agents should open the relevant file when
working in that area.

| File                             | Applies to                                                         |
| -------------------------------- | ------------------------------------------------------------------ |
| `.claude/rules/naming.md`        | all code (unconditional)                                           |
| `.claude/rules/security.md`      | all code (unconditional)                                           |
| `.claude/rules/typescript.md`    | `**/*.{ts,tsx}`                                                    |
| `.claude/rules/react.md`         | `**/*.tsx` (Server/Client boundaries, hooks, hot/cold split)       |
| `.claude/rules/tokens.md`        | `packages/tokens/**`                                               |
| `.claude/rules/motion.md`        | `packages/registry/**/*.tsx`, `packages/tokens/src/css/motion.css` |
| `.claude/rules/accessibility.md` | `packages/registry/**/*.tsx`, `apps/docs/**/*.tsx`                 |
| `.claude/rules/registry.md`      | `packages/registry/**`                                             |
| `.claude/rules/cli.md`           | `packages/cli/**`                                                  |
| `.claude/rules/docs.md`          | `apps/docs/**`                                                     |
| `.claude/rules/documentation.md` | `packages/**`, `apps/docs/content/**`                              |
| `.claude/rules/writing.md`       | `**/*.{md,mdx}` (prose voice and formatting)                       |

---

## Development Commands

```bash
bun install                 # install workspace deps
bun run dev                 # turbo run dev (all workspaces, persistent)
bun run build               # turbo run build
bun run lint                # turbo run lint
bun run typecheck           # turbo run typecheck
bun run format              # prettier --write across the repo
bun run format:check        # prettier --check
bun run knip                # unused files/deps/exports (manual for now)

bun run --filter docs dev   # a single workspace
```

There is **no `test` script yet** — no test runner is wired up (the decided stack, installed with
the first component, is Vitest + Vitest Browser Mode + `vitest-axe` + Playwright; see
`.claude/maintenance/codebase-map.md`). Do not reference a `test` command until it exists.

**Before opening a PR:**

```bash
bun run lint && bun run typecheck && bun run format:check && bun run build
```

---

## Git Workflow

Conventional Commits, protected `main`/`develop`, scopes `tokens|registry|cli|docs|motion|a11y`.
**Every commit MUST include a body** (blank line after the subject, wrapped ~72 chars, explaining
what and why - not how). PRs MUST have a body too, from the template. Author commits with
`bunx merlin` (interactive conventional-commit wizard).
Full detail: `.claude/guides/git-workflow.md`

**GitHub templates (MUST use):**

- When creating a PR (e.g. via `gh pr create`), you **MUST** fill in and follow
  `.github/pull_request_template.md` — every section and the checklist. Do not open a PR with an
  ad-hoc body.
- When creating an issue, you **MUST** use the matching template in `.github/ISSUE_TEMPLATE/`
  (`bug_report.md` for defects, `feature_request.md` for proposals).
