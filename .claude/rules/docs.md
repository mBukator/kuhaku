---
paths:
    - "apps/docs/**"
---

# Docs Site (Next.js 16 + Fumadocs)

For wedge two, **the docs site is the product** — and the registry host, and the machine interface.
It is three surfaces on one codebase: a book (Foundations), a reference (every component), and a
machine interface (registry routes, llms surfaces, search, OG). Reference: spec Part 9.

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
- Do not duplicate component source into the docs app.

## The component page template (all 114 pages)

Live preview → install (**both commands** — `kuhaku add` and `shadcn add @kuhaku/…`) → usage →
**API table generated from the TypeScript source** (types and docs cannot disagree) → **Motion
behavior** (Tier 2: the quantified spec restated; Tier 3: the stillness statement) → Accessibility
(the contract + its Playwright matrix link) → Examples gallery → Related (the disambiguation lines).
Animated (Tier 1) pages foreground the tuning props instead of the API table.

## Machine surfaces are first-class

Keep these working: `/r/[name].json` (registry), `/llms.txt`, `/llms-full.txt`, per-page
`/llms.mdx`, `/api/search`, and the OG image routes. They already scaffold in `app/`.

## The docs obey their own foundations

Section rhythm 96px, Prose measure 65ch, dark by default, motion demonstrating itself. A docs page
that violates a foundation falsifies the book it hosts — treat that as a bug.
