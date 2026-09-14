---
paths:
    - "packages/registry/**"
---

# Registry & Component Authoring

`packages/registry` is the source of truth for all 114 components plus `registry.json`. The build
compiles source into static registry-item JSON emitted to `apps/docs/public/r/[name].json`.
"Own front door, standard plumbing."

---

## shadcn registry-item schema, byte-for-byte

Each item conforms to the shadcn registry-item schema and declares:

- `name` (unique), `type` — one of `registry:base | registry:component | registry:theme |
registry:font | registry:hook | registry:lib`,
- `files` (path + type),
- npm `dependencies` (with `@version` where pinned),
- `registryDependencies` — the `@kuhaku` items it composes.

The build **inlines file contents**, validates against the schema, runs the never-leak lint,
verifies the dependency graph is acyclic and complete, and emits to `apps/docs/public/r/`.

## Every `target` uses a placeholder - never a plain path

`files[].target` **MUST** start with `@components/`, `@ui/`, `@lib/` or `@hooks/`. These resolve
through the adopter's `components.json` aliases. A plain relative target (`lib/cn.ts`) is joined to
the project root literally and never reads those aliases - while the `@/lib/...` imports inside the
same file **are** rewritten through them. The two halves then disagree for any adopter who did not
take shadcn's default aliases, and the component does not compile. Omitting `target` is not the
alternative: the fallback keeps only the path segments after the destination directory's last
segment, which flattens a nested component folder to its bare filenames.

`@utils/` does not exist - `utils` names a file, not a directory. Placeholders are only recognized
at the start of the string; `components/@ui/x.tsx` is treated as a literal path.

This requires **`shadcn` >= 4.7.0** on the ecosystem door (`npx shadcn@latest add @kuhaku/…`). Pin
that floor in `packages/cli` once it shells out, and state it on the CLI and registry doc pages.

## Dependency flow is the delivery mechanism

- Anything that animates lists **`motion`** in `dependencies` — that is how the runtime reaches
  adopters, no peer-dependency ceremony.
- Heavy deps ride only their own component: TanStack Table under DataTable, Embla under Carousel,
  Shiki under CodeBlock, Sonner under Toast. An adopter who never installs DataTable never hears of
  TanStack.
- `registryDependencies` resolves composition: installing `date-picker` pulls `popover`, `calendar`,
  and `input` automatically. Composition notes are the dependency graph, not documentation flavor.

## Base UI never leaks (enforced here)

- Import `@base-ui/react/*` **internally only** — no barrel re-exports Base UI.
- **No public prop or exported type references a `@base-ui/*` type.** The build lint fails
  violations. (E.g. HoverCard wraps Base UI's PreviewCard; the adopter never learns this from types.)
- Honor Base UI's render-prop contract: forward refs, spread props onto the underlying element.

## Component conventions

- Class composition uses **`cn` from the `cn` package** (the repo's util) — see `apps/docs/lib/cn.ts`.
- Variant styling uses `cva` (`class-variance-authority`) when a component has enumerated style
  props (`variant`, `size`). Booleans and values derived from other props stay as `cn`
  conditionals - cva only sees props, and a single boolean gains nothing from a config object.
- Consume **semantic tokens** + Tailwind utilities, never `--neutral-*` directly.
- Follow the tier and motion contract: @.claude/rules/motion.md. Follow the a11y contract:
  @.claude/rules/accessibility.md.
- Every component is a live integration test — it must render on its own docs page, importing
  from built registry output. A component that renders on its docs page is a component that installs.
