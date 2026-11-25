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
  `---Section---` separators, `...` to include the rest, `...folder` to lift a folder's pages
  into its parent). A `pages` list without `...` drops every page it does not name, silently.
- The root `meta.json` sets the sidebar sections: Get started, Foundations, Components. A section
  with no pages yet stays in the sidebar, marked "Soon" by `components/SectionSeparator.tsx`.
- Component categories are `(group)` folders under `content/docs/components/`, one per Part 7
  category, each with a `meta.json` holding its `title` and `pages`. Fumadocs drops the
  parenthesized segment from URLs, so every component stays at `/docs/components/<item>`.
- `navTitle` frontmatter sets a sidebar label that differs from the page title (the components
  index reads "Overview"); the page tree transformer in `lib/source.ts` applies it.
- Collections are defined in `source.config.ts` with typed frontmatter/meta via the fumadocs Zod
  schemas (`pageSchema`, `metaSchema`) already wired up; the loader is in `lib/source.ts`.
- Register custom MDX components in `getMDXComponents` (`components/mdx.tsx`) so MDX uses them
  without import syntax. `<CodeBlock>` is not registered (Fumadocs maps `pre`): use fenced code,
  with blank lines around a fence inside a JSX tag.
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
(the contract + its axe matrix link) → Examples gallery → Related (the disambiguation lines).
Animated (Tier 1) pages foreground the tuning props instead of the API table. Related appears once
a related component has a page.

Pages live at `content/docs/components/(<category>)/<item>.mdx`, listed in that folder's
`meta.json`; `(actions-forms)/button.mdx` is the reference. The template's parts are MDX
components keyed by registry item name:

| Component                            | Renders                                                        |
| ------------------------------------ | -------------------------------------------------------------- |
| `<ComponentPlayground name="..." />` | Controls, live preview and code; entry in `PLAYGROUND_ENTRIES` |
| `<InstallCommand name="..." />`      | Package manager × door picker, choice kept in `localStorage`   |
| `<ApiTable name="..." />`            | The exported `<Name>Props`, read from `installed/ui/<item>/`   |
| `<ComponentPreview name="..." />`    | A demo beside its source; entry in `DEMOS`                     |

`<ApiTable>` and `<InstallCommand>` are expanded by remark plugins (`lib/remark-api-table.ts`,
`lib/remark-install-command.ts`), so the build fails on an unknown item name or a public prop
with no JSDoc, and `/llms.mdx` gets the props as a Markdown table and both npm install commands.

The component index (`content/docs/components/index.mdx`) is `<ComponentIndex />`, expanded by
`lib/remark-component-index.ts` into one heading and one dense list of names per `(group)`
folder, in the order `components/meta.json` lists the folders and each folder's `meta.json`
lists its pages. A page added to a folder joins the index with no edit, and each category gets a
table-of-contents entry. The build fails on anything the sidebar would drop or break without a
word: a page outside a folder, an unlisted folder or page, a listed folder or page with no file,
a folder with no title or no pages, and a listed page with no built registry item.

## Machine surfaces are first-class

Keep these working: `/r/[name].json` (registry, static files from `public/r`), `/llms.txt`,
`/llms-full.txt`, per-page `/llms.mdx/docs/<slug>/content.md`, `/api/search`, and the OG image
routes.

## The docs obey their own foundations

Section rhythm 64px (the spec's compact step for docs pages; 96px is the marketing `Section`
default), Prose measure 65ch, dark by default, motion demonstrating itself. A docs page that
violates a foundation falsifies the book it hosts - treat that as a bug.
