# Architecture Guide

The engineering map of the monorepo: how the workspaces fit together and how the build flows.

---

## Workspaces

| Workspace           | Responsibility                                                                                                                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/tokens`   | The CSS token layer _as data_: `theme.css` (color, type, radius, strict swaps), `motion.css` (the `--motion-*` table), `tailwind.css` (the `@theme` mapping). Plain CSS — no Tailwind logic here. Consumed by the registry build and the docs token pages, so shipped values and docs cannot disagree. |
| `packages/registry` | Source of truth for all 115 components, organized by category, plus `registry.json` — the manifest declaring every item, its files, dependencies, and type.                                                                                                                                            |
| `packages/cli`      | The `kuhaku` npm package: `init` / `add` / `apply` / `diff` orchestration over shadcn's resolution logic. Currently a stub (`src/index.ts`).                                                                                                                                                           |
| `apps/docs`         | Next.js 16 App Router + Fumadocs. Documentation, marketing surface, **registry host** (`/r/[name].json` route handlers reading build output), and machine surfaces (`/llms.txt`, `/llms-full.txt`, `/llms.mdx`, `/api/search`, OG routes).                                                             |
| `apps/playground`   | Vite dev harness. One page per component, built from `src/examples/<component>/` with `import.meta.glob`; renders registry source directly through the registry tsconfig paths, with dark and strict toggles. Not part of the registry or the docs build.                                              |

---

## Turbo task graph (`turbo.json`)

- `build` — `dependsOn: ["^build"]` (dependencies build first); outputs `.next/**` (minus cache) and
  `dist/**`.
- `dev` — `cache: false`, `persistent: true`.
- `lint`, `typecheck` — no dependencies declared.

Root scripts fan out via Turbo: `bun run build` → `turbo run build`, etc.

## Registry build pipeline

`turbo build` compiles `packages/registry` source into static registry-item JSON through
`packages/registry/scripts/registry-build.ts`:

1. validate `registry.json` against shadcn's `registrySchema`,
2. verify the **`registryDependencies` graph is namespaced, acyclic and complete**, down to the
   imports: every `@/` import names an item the importer declares, every package import is in
   `dependencies` (a missing dependency fails the build, not the adopter),
3. run the **never-leak lint** (emit declarations in memory; fail if any mentions `@base-ui/*`),
4. delegate inlining and emit to `shadcn build`, writing `apps/docs/public/r/[name].json`
   (committed; CI fails when it differs from a fresh build; never cached),
5. re-validate every emitted item against `registryItemSchema` and assert each file's content
   equals its source.

The docs site consumes its own registry output, which makes the documentation an integration test:
a component that renders on its docs page is a component that installs.

## Data flow

```
packages/tokens ──► packages/registry ──► packages/cli
      │                    │                   (installs items into adopter projects)
      └────────────► apps/docs ◄─────────────┘
                 (token pages read tokens; demos import built registry output;
                  /r route handlers serve the registry)
```

## The three motion tiers

- Tier 1 — identity. Motion _is_ the component (backgrounds, cursors, hero type). Behind/around
  content only. Tuning props, no opt-out.
- Tier 2 — information. The functional core. On by default, tuned only via `--motion-*` tokens.
- Tier 3 — withheld. Display/layout/typography. No motion. (Tier 3-kinetic — Skeleton/Spinner/
  Progress — where motion is semantic content.)

---

## Tech stack (real versions)

| Tool         | Version          | Role                                    |
| ------------ | ---------------- | --------------------------------------- |
| Bun          | 1.3.11           | Package manager + runtime               |
| Turborepo    | ^2               | Monorepo task runner                    |
| Next.js      | 16.2.11          | Docs app (App Router)                   |
| React        | 19.2.8           | UI runtime                              |
| Fumadocs     | 16.12.1          | Docs framework (`@fumadocs/base-ui`)    |
| Tailwind CSS | ^4.3             | Utility layer (`@theme` mapping)        |
| Base UI      | `@base-ui/react` | Headless behavior layer (never leaks)   |
| Motion       | `motion/react`   | Animation runtime (Tier 1 + springs)    |
| TypeScript   | ^6               | Language (strict, `bundler` resolution) |
| cn           | ^0.2.5           | `cn` class-composition util             |

---

## Rules & workflow

- Path-scoped rules: `.claude/rules/` (indexed in `CLAUDE.md`).
- Git workflow: @.claude/guides/git-workflow.md
- Living file index + open items: @.claude/maintenance/codebase-map.md
