# Codebase Map

A living index of the monorepo and its open items. Update it when files are added or an open item is
resolved.

---

## Root

| Path                     | Purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `turbo.json`             | Turbo task graph (build/dev/lint/typecheck)                    |
| `tsconfig.base.json`     | Shared TS config (strict, ES2022, bundler)                     |
| `package.json`           | Workspaces + root scripts; dev tooling incl. `merlin-commit`   |
| `.prettierrc`            | Formatting: 4-space, double quotes, 90 cols, import sort       |
| `commitlint.config.mjs`  | Conventional Commits + kuhaku scope enum                       |
| `knip.json`              | Unused files/deps/exports config (`bun run knip`, manual)      |
| `.husky/`                | pre-commit, commit-msg, pre-push hooks                         |
| `.github/`               | PR + issue templates (CI/CodeQL/dependabot deferred)           |
| `AGENTS.md`              | Tool-agnostic agent source of truth (overview, critical rules) |
| `CLAUDE.md` + `.claude/` | Claude layer: imports AGENTS.md + path-scoped `.claude/rules/` |
| `.claude/skills/`        | Project skills (`kuhaku-writing`)                              |

## `packages/tokens`

| Path                   | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `src/css/theme.css`    | Color, type, radius, sidebar aliases, strict-mode swaps   |
| `src/css/motion.css`   | The `--motion-*` table; reduced-motion + strict collapses |
| `src/css/tailwind.css` | `@theme` mapping of tokens to Tailwind utilities          |

## `packages/registry`

| Path            | Purpose                          |
| --------------- | -------------------------------- |
| `registry.json` | Manifest (currently `items: []`) |

## `packages/cli`

| Path           | Purpose                      |
| -------------- | ---------------------------- |
| `src/index.ts` | CLI entry (currently a stub) |

## `apps/docs`

| Path                  | Purpose                                                          |
| --------------------- | ---------------------------------------------------------------- |
| `app/`                | App Router: docs, home, `/r`, llms, OG, search                   |
| `content/docs/`       | MDX content                                                      |
| `source.config.ts`    | Fumadocs collections + schemas                                   |
| `lib/`                | `source.ts` (loader), `cn.ts` (re-exports cnfast), layout/shared |
| `components/mdx.tsx`  | MDX component overrides                                          |
| `spec/kuhaku-spec.md` | The full v1.0 design specification                               |

---

## Open items (deferred, tracked so they are not forgotten)

- No test runner yet (stack decided). Install with the first component (nothing to test while the
  registry is empty). Decided stack: **Vitest** (runner; what Base UI uses) · **Vitest Browser Mode**
  with the Playwright provider + `vitest-axe` for component/a11y tests (real Chromium, not jsdom) ·
  **Playwright** for the APG keyboard matrix + E2E · visual-regression screenshots deferred. Run
  Vitest **on Node** (`bun run test`), not `bun run --bun vitest` (known bun:test/fake-timer issues).
  When it lands: add a `test` script, a `pre-push`/CI test step, and `.claude/rules/testing.md`.
- knip is a manual check for now. `bun run knip` reports expected scaffold items (the `cn` util,
  fumadocs exports) until feature code exists; it is not a `pre-push` gate yet. Wire it into
  `pre-push`/CI once components land.
- CLI is a stub. `packages/cli/src/index.ts` prints a placeholder; init/add/apply/diff unbuilt.
- Registry is empty. `registry.json` has `items: []`; the build pipeline (inline → validate →
  never-leak lint → graph check → emit `apps/docs/public/r/`) is unimplemented.
- Root ESLint gap. Only `apps/docs` has ESLint. lint-staged runs Prettier only (no ESLint) for
  now; add a root `eslint.config.mjs` and wire ESLint into lint-staged when non-docs TS grows.
- GitHub CI + meta deferred. `.github/` has PR + issue templates only. The husky hooks run the
  same lint/typecheck/format/build gate locally and there are no external contributors yet. Add
  `workflows/ci.yml`, `codeql.yml`, `dependabot.yml`, and `CODEOWNERS` closer to launch, and the
  npm-publish `release.yml` when packages go public.
- Dark strict-mode status hues are an open tuning item - flagged in `theme.css` at the point of
  use.
