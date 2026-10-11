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
| `.github/`               | Templates, CI gate, CodeQL, dependabot, CODEOWNERS             |
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

| Path                         | Purpose                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| `registry.json`              | Manifest: seven items (cn, motion, use-confirmation-hold, swap, spinner, checkmark, button) |
| `src/`                       | Item source: `lib/`, `hooks/`, `ui/<category>/<item>/`                                      |
| `scripts/registry-build.ts`  | `build`: runs the checks, then `shadcn build` into `apps/docs/public/r/`                    |
| `scripts/registry-checks.ts` | Namespaced graph, file/target and import-completeness checks                                |
| `scripts/never-leak.ts`      | Never-leak lint over in-memory declaration emit                                             |
| `src/**/*.test.{ts,tsx}`     | Tests beside their source; never shipped (the build reads only declared paths)              |
| `vitest.config.ts`           | Vitest Browser Mode, Playwright provider, headless Chromium                                 |
| `test/`                      | Harness via `#test/*`: setup, token CSS, axe matcher, color modes                           |
| `COMPONENT-WORKFLOW.md`      | End-to-end component authoring path                                                         |

## `packages/cli`

| Path           | Purpose                      |
| -------------- | ---------------------------- |
| `src/index.ts` | CLI entry (currently a stub) |

## `apps/playground`

| Path                        | Purpose                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `src/examples/<component>/` | One example per file (`ButtonDemo.tsx`); the folder is the page, the file a section |
| `src/examples/index.ts`     | Builds the pages with `import.meta.glob`; no registration step                      |
| `src/app/`                  | Shell: hash router, sidebar, dark/strict toolbar, page view                         |
| `src/components/`           | Playground chrome: example preview (Preview/Code/Remount), controls                 |

## `apps/docs`

| Path                  | Purpose                                                      |
| --------------------- | ------------------------------------------------------------ |
| `app/`                | App Router: docs, home, `/r`, llms, OG, search               |
| `content/docs/`       | MDX content                                                  |
| `source.config.ts`    | Fumadocs collections + schemas                               |
| `lib/`                | `source.ts` (loader), `cn.ts` (re-exports cn), layout/shared |
| `components/mdx.tsx`  | MDX component overrides                                      |
| `spec/kuhaku-spec.md` | The full v1.0 design specification                           |

---

## Open items (deferred, tracked so they are not forgotten)

- Standalone Playwright (`@playwright/test`) for E2E against docs pages lands with the first docs
  component page. Keyboard contracts already run in Vitest Browser Mode. Visual-regression
  screenshots stay deferred (spec, QA & audit).
- knip is a manual check for now. `bun run knip` reports expected scaffold items (the `cn` util,
  fumadocs exports) until feature code exists; it is not a `pre-push` gate yet. Wire it into
  `pre-push`/CI once components land.
- CLI is a stub. `packages/cli/src/index.ts` prints a placeholder; init/add/apply/diff unbuilt.
- Root ESLint gap. Only `apps/docs` has ESLint. lint-staged runs Prettier only (no ESLint) for
  now; add a root `eslint.config.mjs` and wire ESLint into lint-staged when non-docs TS grows.
- npm-publish `release.yml` lands when packages go public. `ci.yml` (the gates, the `public/r`
  stale check and the test suite), `codeql.yml`, `dependabot.yml` and `CODEOWNERS` are in place.
- Dark strict-mode status hues are an open tuning item - flagged in `theme.css` at the point of
  use.
