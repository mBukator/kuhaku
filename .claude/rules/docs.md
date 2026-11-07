---
paths:
    - "apps/docs/**"
---

# Docs Site (Next.js 16 + Fumadocs)

For wedge two, **the docs site is the product** — and the registry host, and the machine interface.
It is three surfaces on one codebase: a book (Foundations), a reference (every component), and a
machine interface (registry routes, llms surfaces, search, OG).

---

## Fumadocs conventions

- MDX content lives in `content/docs/`; navigation is configured with `meta.json` (ordering,
  `---Section---` separators, `...` to include the rest).
- Collections are defined in `source.config.ts` with typed frontmatter/meta via the fumadocs Zod
  schemas (`pageSchema`, `metaSchema`) already wired up; the loader is in `lib/source.ts`.
- Register custom MDX components in the root `mdx-components.tsx` (used without import syntax in MDX);
  shared demo components live in `components/`.
- Server/Client boundaries follow @.claude/rules/react.md — pages are RSC-first.

## The docs consume built registry output

- Live demos import from **built registry output** (`public/r`), not a forked copy of component
  source. A demo that renders proves the component installs — that is the integration test.
- `scripts/install-registry.ts` runs before `dev`, `build` and `typecheck`: it validates each
  `public/r` item against shadcn's `registryItemSchema`, checks every npm range against
  `apps/docs/package.json`, and writes the files to the gitignored `installed/`, resolving
  `@ui/`, `@lib/` and `@hooks/` the way shadcn's default aliases do. It never rewrites imports;
  `tsconfig.json` maps `@/components/ui/*`, `@/hooks/*` and `@/lib/*` onto `installed/`.
- Import components, hooks and `cn` the way an adopter does (`@/components/ui/button`,
  `@/lib/cn`). Do not duplicate component source into the docs app, and never edit `installed/`.
- After a registry source change, run `bun run build` so `public/r` and `installed/` catch up.

## The component page template (all 115 pages)

Live preview → install (**both commands** — `kuhaku add` and `shadcn add @kuhaku/…`) → usage →
**API table generated from the TypeScript source** (types and docs cannot disagree) → **Motion
behavior** (Tier 2: the quantified motion behavior restated; Tier 3: the stillness statement) → Accessibility
(the contract + its Playwright matrix link) → Examples gallery → Related (the disambiguation lines).
Animated (Tier 1) pages foreground the tuning props instead of the API table.

## Machine surfaces are first-class

Keep these working: `/r/[name].json` (registry, static files from `public/r`), `/llms.txt`, `/llms-full.txt`, per-page
`/llms.mdx`, `/api/search`, and the OG image routes. They already scaffold in `app/`.

## The docs obey their own foundations

Section rhythm 96px, Prose measure 65ch, dark by default, motion demonstrating itself. A docs page
that violates a foundation falsifies the book it hosts — treat that as a bug.
