# Component authoring workflow

The end-to-end path for adding a new component to the Kuhaku registry, from the first design
decision to the open PR, including how the component enters `registry.json` and is served to
adopters.

This describes the steady-state workflow (what building component N looks like once the plumbing
exists) and flags every point where the first components must also stand up one-time
infrastructure. The design intent is fully specified in `apps/docs/spec/kuhaku-spec.md` and
`.claude/rules/*`; the honesty below is only about what is currently built.

---

## Status as of 2026-09-18

The registry has its first items but not its pipeline. Read the workflow with this in mind, because
building the first component also means building the road:

- `registry.json` declares three items: `cn` and `motion` (`registry:lib`) and `swap`
  (`registry:component`). No Tier 2 control has shipped yet.
- `packages/registry/src/` holds `lib/cn.ts`, `lib/motion/`, and
  `ui/layout-typography/swap/`. Button and Spinner exist as scaffolds only.
- `packages/registry/tsconfig.json` maps `@/lib/*`, `@/components/ui/*` and `@/hooks/*`, so registry
  source imports through `@/` and still typechecks in the monorepo. Installed files rely on the same
  aliases being rewritten by the shadcn CLI.
- Every `files[].target` uses a `components.json` placeholder (`@lib/`, `@ui/`). A plain relative
  target ignores the adopter's aliases and breaks the install for anyone off the defaults.
- `packages/registry/package.json` has dependencies (`@base-ui/react`, `cn`,
  `class-variance-authority`, `motion`) and a `typecheck` script, but still no `build` script. The
  inline -> validate -> lint -> graph -> emit pipeline in `.claude/guides/architecture.md` is
  unimplemented.
- `apps/docs` has no `app/r/[name]/route.ts`, no `public/r/` output directory, no component MDX
  pages (only `content/docs/index.mdx` and `test.mdx`), and no `meta.json` navigation.
- `packages/cli/src/index.ts` is a stub; `kuhaku add` does not exist yet.
- No test runner is wired. The stack is decided (Vitest + Vitest Browser Mode + `vitest-axe` +
  Playwright) and installs with the first component.
- The one real build in the repo is `packages/tokens/scripts/build-springs.ts`, which reads the
  spring parameters from `motion.css` and emits `springs.generated.css`. That is the pattern the
  registry build follows.

Update this section as the infrastructure lands.

---

## Phase 0 - design and placement (before any code)

Nothing is typed until these are decided; they determine the file's location, its API, and its
motion and accessibility contract.

0.1 Read the spec entry. `apps/docs/spec/kuhaku-spec.md` is the design source of truth. Every
component is specified: its tier, exact prop signature, motion timings, accessibility contract, and
the "Related" disambiguation. Button (Part 7a) gives the variants
(`primary | secondary | ghost | destructive | link`), sizes, the `state` machine, and the motion
grammar (press to 0.97 in 100ms `ease-out`, release on `spring-snappy`). You implement the spec; you
do not invent the API.

0.2 Fix the six identity decisions. Together these define what the component is in the system before
you write a line: its public name, its install semantics, its motion budget, its home, and its
dependency edges. Five of the six populate the `registry.json` entry or the file path; Tier is a
design constraint that governs how you build. Fixing them first avoids rework - writing motion props
a tier does not allow, or filing the component under the wrong category.

- Name - the unique identifier for the registry item: lowercase kebab-case, singular (`button`,
  `date-picker`, `dot-grid`). It is the `name` field, the served file (`/r/button.json`), and the
  install command (`kuhaku add button`). It MUST be unique across the whole registry, and other
  items reference it by this exact string in their `registryDependencies`. Mind the casing split:
  the registry name is kebab-case (`date-picker`), but the React export and its file are PascalCase
  (`DatePicker`, `DatePicker.tsx`).
- Registry `type` - the `type` field, from a fixed enum, telling the CLI how to install the item and
  where its files go: `registry:component` (a normal UI component), `registry:hook` (a shared hook),
  `registry:lib` (the `cn` util, the `lib/motion` runtime), `registry:theme` (the token/theme
  layer), `registry:font` (Geist), `registry:base` (the payload `init` installs). Each entry in
  `files[]` also carries a `type`.
- Tier - the motion tier, a kuhaku design classification and not a registry field. Tier 1
  (identity/showcase; motion is the component, tuning props, gates on `IntersectionObserver`), Tier 2
  (functional; `-micro` for small controls, `-state` for stateful surfaces; consumes `--motion-*`
  tokens only, no per-component motion props), Tier 3 (withheld; no motion, no prop to add it), or
  Tier 3-kinetic (motion is the semantic content - Skeleton, Spinner, Progress). It governs the
  implementation and the docs "Motion behavior" section (`.claude/rules/motion.md`). For the 114
  specced components you read the tier from the spec; you assign one only for a component the spec
  does not cover.
- Category folder - which subfolder under `src/` the file lives in, which is the placement from 0.3
  and therefore the `files[].path` string. Organizational, mapping to the spec's Part 7 groupings.
- npm `dependencies` - the third-party npm packages the component needs at runtime, declared in the
  `dependencies` array and installed into the adopter's project on `add`. Anything that animates
  lists `motion`; `@base-ui/react` is listed by anything wrapping a Base UI primitive; heavy deps
  ride only their own component (TanStack under DataTable, Embla under Carousel, Shiki under
  CodeBlock), so an adopter who never installs DataTable never pulls TanStack.
- `registryDependencies` - the other kuhaku registry items this component composes, declared in the
  `registryDependencies` array and referenced by their Name. This is the pair people conflate with
  `dependencies`: `dependencies` is npm packages, `registryDependencies` is other items in this
  registry. Installing `date-picker` walks this graph and also installs `popover`, `calendar`, and
  `input`. It is the delivery mechanism, not a related-components note; the build verifies the graph
  is acyclic and complete and **fails on a reference to an undeclared item**.

Where each decision lands:

| Decision               | Lands in                                                         |
| ---------------------- | ---------------------------------------------------------------- |
| Name                   | `registry.json` `name`; the `.tsx` filename; the install command |
| Registry `type`        | `registry.json` `type`; each `files[].type`                      |
| Tier                   | Nothing in `registry.json`; it constrains the code and the docs  |
| Category folder        | The file location under `src/`, so the `files[].path` string     |
| npm `dependencies`     | `registry.json` `dependencies` array                             |
| `registryDependencies` | `registry.json` `registryDependencies` array                     |

The six produce one entry (Button, `Tier 2-micro` - the tier being the one decision not written
here, since it lived in the spec and in your head while you wrote `Button.tsx`):

```jsonc
{
    "name": "button", // 1. Name
    "type": "registry:component", // 2. Registry type
    "title": "Button",
    "description": "The action primitive; every imperative in the interface.",
    "files": [
        // 4. Category folder -> path, plus where the file lands in the adopter's project
        {
            "path": "src/ui/actions-forms/button/Button.tsx",
            "type": "registry:component",
            "target": "@ui/button/Button.tsx",
        },
    ],
    "dependencies": ["@base-ui/react", "motion"], // 5. npm dependencies
    "registryDependencies": ["motion", "cn", "swap", "spinner"], // 6. registryDependencies
}
```

A composition makes `registryDependencies` concrete (`date-picker`):

```jsonc
{
    "name": "date-picker",
    "type": "registry:component",
    "files": [
        { "path": "ui/actions-forms/DatePicker.tsx", "type": "registry:component" },
    ],
    "dependencies": ["motion"],
    "registryDependencies": ["popover", "calendar", "input"], // pulled in automatically on install
}
```

0.3 File placement. Naming from `.claude/rules/naming.md`: components are `PascalCase.tsx`,
non-component TS is `kebab-case.ts`, hooks are `useXxx`.

| Kind                          | Folder                                    | Example                                |
| ----------------------------- | ----------------------------------------- | -------------------------------------- |
| Tier 2/3 UI primitive         | `packages/registry/src/ui/<category>/`    | `src/ui/actions-forms/Button.tsx`      |
| Tier 1 showcase               | `packages/registry/src/showcase/<group>/` | `src/showcase/backgrounds/DotGrid.tsx` |
| Shared hook (`registry:hook`) | `packages/registry/src/hooks/`            | `src/hooks/use-reduced-motion.ts`      |
| Shared lib (`registry:lib`)   | `packages/registry/src/lib/`              | `src/lib/motion/...`, `src/lib/cn.ts`  |

The five `ui` categories map to the spec's Part 7 groupings: `actions-forms`, `overlays-navigation`,
`feedback-status`, `content-data`, `layout-typography`.

---

## Phase 1 - author the component source

Create the file(s) under the folder from 0.3. Every rule below is enforced (or will be) by the build
lint and the pre-PR gate.

1.1 Server/Client boundary (`.claude/rules/react.md`). Server Component by default. Add
`"use client"` only for genuine interactivity: `useState`/`useReducer`, effects, event handlers, DOM
refs, browser APIs, or the `motion` runtime. Push the boundary to the leaf - a static wrapper stays
a Server Component, only the interactive piece is a Client Component.

1.2 Wrap Base UI, and never leak it (`.claude/rules/security.md` invariant 6,
`.claude/rules/registry.md`). If the component has a Base UI primitive:

- import `@base-ui/react/<part>` internally only - no barrel re-export of Base UI;
- no public prop or exported type may reference a `@base-ui/*` type (the build lint fails this);
- honor Base UI's render-prop contract: forward the ref and spread received props onto the
  underlying element;
- rename to Kuhaku's vocabulary publicly (Base UI `PreviewCard` becomes Kuhaku `HoverCard`; the
  adopter never learns the internal).

1.3 Consume tokens, never raw ramps (`.claude/rules/tokens.md`, `.claude/rules/naming.md`):

- Semantic tokens only (`--background`, `--primary`, `--muted-foreground`, `--ring`,
  `--destructive`), which are shadcn's names verbatim, applied through Tailwind utilities. Never
  `--neutral-*`, which is internal wiring.
- Status tokens have two roles: `--{status}` is a fill (with `--{status}-foreground`);
  `--{status}-text` is for colored text, icons, and meaningful borders. Do not conflate them.
- Class composition uses `cn` from the `cn` package (in-repo it is the `registry:lib` cn item; the docs
  re-export at `apps/docs/lib/cn.ts`).

1.4 Obey the tier's motion contract (`.claude/rules/motion.md`, the differentiation wedge):

- Motion is functional or it does not exist (causality, provenance, continuity, attention). The
  deletion test: remove the animation; if no information is lost, it was decoration.
- Tier 2 consumes `--motion-*` tokens only, never per-component motion props. The absence of an off
  switch is deliberate.
- Tier 1 exposes tuning props (`duration`, `delay`, `stagger`, `ease`, `direction`), gates on
  `IntersectionObserver`, suspends offscreen, and clamps `devicePixelRatio` at 1.5.
- Compositor-only: animate `transform` and `opacity`. The one sanctioned layout animation is
  `grid-template-rows: 0fr -> 1fr` (and `grid-template-columns`). No animated
  `width`/`height`/`box-shadow`/`filter`.
- Springs come from the `lib/motion` runtime, which reads the CSS spring triplets. Import animation
  APIs from `motion/react`, not `framer-motion`.
- The hot/cold split: per-frame values (pointer, scroll) live on refs and motion-values, never
  `setState` per frame; coalesce through one `requestAnimationFrame`.

1.5 Do not hand-roll reduced-motion or strict-mode branches. Both are token-level remaps in
`motion.css` (and `springs.generated.css` collapses springs to `linear(0, 1)` under
`prefers-reduced-motion` and `[data-a11y="strict"]`). A component complies automatically through the
tokens it already consumes. Per-component accessibility branches are a rule violation.

1.6 Accessibility floor (`.claude/rules/accessibility.md`), a mechanical gate audited per component:

- Text 4.5:1; interactive non-text 3:1; visible `:focus-visible` ring as the `--ring` box-shadow
  (3px, outside the border, at least 3:1); 40px default control height (`h-10`); 44px hit target on
  coarse pointers (extend with an invisible pseudo-element where the visual is smaller).
- Keyboard: inherit the WAI-ARIA APG pattern through Base UI (roving tabindex, `Home`/`End`,
  typeahead, `Escape` scoping). Every keyboard path is motion-complete - spring indicators follow
  keyboard focus exactly as pointer.
- Color is never the only channel; overlays trap and restore focus to their trigger.

1.7 TypeScript (`.claude/rules/typescript.md`): `type` over `interface`; never `any` (use `unknown`
plus narrowing); `===`/`!==`; `??` not `||`; early-return guards; functions under about 50 lines;
`import type` for type-only imports; explicit return types on exported functions; comment the why,
not the what. Do not hand-format - Prettier owns it (4-space, double quotes, 90 columns).

1.8 Supporting files. If the component needs a shared hook or lib, create it as its own registry
item (`src/hooks/useX.ts` for `registry:hook`, `src/lib/...` for `registry:lib`) and wire it through
`registryDependencies` rather than inlining a copy.

---

## Phase 2 - declare it in the registry

Edit `packages/registry/registry.json` and add one object to `items[]`, conforming byte-for-byte to
the shadcn registry-item schema (`.claude/rules/registry.md`).

A component item declares:

```jsonc
{
    "name": "button",
    "type": "registry:component",
    "title": "Button",
    "description": "The action primitive; every imperative in the interface.",
    "files": [
        {
            "path": "src/ui/actions-forms/button/Button.tsx",
            "type": "registry:component",
            "target": "@ui/button/Button.tsx", // a components.json placeholder, never a plain path
        },
    ],
    "dependencies": ["@base-ui/react", "motion"], // npm deps, @version where pinned
    "registryDependencies": ["motion", "cn", "swap", "spinner"], // @kuhaku items it composes
}
```

Rules that bind this entry:

- `registryDependencies` is the delivery mechanism, not prose. `date-picker` lists
  `["popover", "calendar", "input"]` so installing it pulls them automatically. The graph MUST be
  acyclic and complete - a reference to an undeclared item fails the build, not the adopter
  (security invariant 5).
- npm `dependencies` is how the runtime reaches adopters with no peer-dependency ceremony: anything
  animating lists `motion`; heavy deps stay scoped to their one component.
- Foundational items a component leans on: the base payload (`init` installs it), the
  `registry:theme` item (which carries the token CSS plus the `@theme inline` mapping - `theme.css`
  deliberately keeps mode-dependent values out of `@theme inline`), the `registry:lib` cn, and the
  `lib/motion` runtime. Depend on these rather than restating tokens.
- Exported types cannot reference `@base-ui/*`; the never-leak lint reads the emitted files.

Docs and shipped values may not disagree (`.claude/rules/documentation.md`) - the registry entry and
the component page are one change.

---

## Phase 3 - build the registry

Run `bun run build` (which runs `turbo run build`; `dependsOn: ["^build"]` builds `@kuhaku/tokens`
springs first). The registry build (per `.claude/guides/architecture.md`) does five things:

1. inline each item's file contents into its JSON,
2. validate every item against the shadcn registry-item schema,
3. run the never-leak lint - fail if any exported type references `@base-ui/*`,
4. verify the `registryDependencies` graph is acyclic and complete,
5. emit `apps/docs/public/r/[name].json`.

First-component infrastructure: none of this exists yet. Building component 1 means writing this
pipeline (a `build` script plus a `registry-build.ts` in `packages/registry`, following the
`build-springs.ts` model - a plain Bun script that reads sources, validates, and writes output),
adding `packages/registry` dependencies (`@base-ui/react`, `motion`, a schema validator), and
creating the `apps/docs/public/r/` emit target. Until then, `registry.json` is a manifest with
nothing to compile.

---

## Phase 4 - document it (the docs are the integration test)

Per `.claude/rules/docs.md`, live demos import from built registry output (`apps/docs/public/r`),
never a forked copy of the source. A demo that renders proves the component installs.

4.1 Demo component. Author it in `apps/docs/components/`, importing the component from the built
output. Register it in `apps/docs/components/mdx.tsx` (`getMDXComponents`) so MDX can use it without
an import.

4.2 Component page. An MDX file in `apps/docs/content/docs/` following the fixed template: live
preview, then install with both doors (`kuhaku add button` and `shadcn add @kuhaku/button`), then
usage, then an API table generated from the TypeScript source (types and docs cannot disagree), then
Motion behavior (Tier 2: the quantified behavior restated; Tier 3: the stillness statement), then
Accessibility (the contract plus its Playwright matrix link), then an Examples gallery, then Related
(the disambiguation lines). Tier 1 pages foreground the tuning props instead of an API table.

4.3 Navigation. Add or adjust `meta.json` in `content/docs/` (Fumadocs ordering, `---Section---`
separators, `...` for the rest). The collection is already defined in `apps/docs/source.config.ts`
(the `docs` collection, `pageSchema`/`metaSchema`).

4.4 The page obeys its own foundations - 96px section rhythm, 65ch prose, dark by default. A docs
page that violates a foundation falsifies the book it hosts.

First-component infrastructure: the `app/r/[name]/route.ts` handler that serves `public/r/*.json`
(the `/r/[name].json` machine surface and the ecosystem install door), the component-page
template/layout, and the component index all get built here the first time. The `/llms.txt`,
`/llms-full.txt`, and search surfaces already scaffold in `app/`.

---

## Phase 5 - test

Once the stack lands (decided in the codebase-map open items, installed with the first component):
Vitest runner, Vitest Browser Mode with the Playwright provider plus `vitest-axe` for component and
accessibility tests in real Chromium, and Playwright for the APG keyboard matrix
(`.claude/rules/accessibility.md`: every interactive primitive carries a Playwright spec asserting
its full APG contract). Run Vitest on Node (`bun run test`), not `bun run --bun vitest`. There is no
`test` script yet - do not reference one until it exists.

---

## Phase 6 - verify against the gates

The pre-PR gate from `AGENTS.md`, in order:

```bash
bun run lint && bun run typecheck && bun run format:check && bun run build
```

Plus `bun run format` (Prettier writes). On Windows, `format:check` can trip on CRLF while CI passes
on LF - a known local-only artifact. `bun run knip` is a manual unused-files/deps check for now. The
`build` step is the real test today: it runs the schema validation, never-leak lint, and graph
check, and the docs demo rendering is the integration proof.

---

## Phase 7 - commit and open the PR

Git workflow (`.claude/guides/git-workflow.md`):

- Never commit to `develop`/`main` directly. Branch first, one branch per concern.
- Conventional Commits, scope one of `tokens | registry | cli | docs | motion | a11y | repo | deps`
  (the enum in `commitlint.config.mjs`). A registry
  component usually touches `registry` (source plus manifest) and `docs` (page); commit them
  coherently.
- Every commit MUST have a body (blank line after the subject, wrapped at about 72 columns, what and
  why, not how). Author with `bunx merlin`.
- Never mention Claude or AI anywhere, including a `Co-Authored-By` trailer.
- The PR uses `.github/pull_request_template.md` in full - every section and the checklist.
- Update `.claude/maintenance/codebase-map.md`. The registry table currently reads "Manifest
  (currently `items: []`)"; that line and the "Registry is empty" open item change once real
  components land.

---

## How adopters get it (both doors are equal)

- Front door: `npx kuhaku add button`. The CLI does full `registryDependencies` traversal, once it
  is built; currently a stub.
- Ecosystem door: `npx shadcn@latest add @kuhaku/button`, reading the same `/r/[name].json`.

One namespace, one registry, two doors, no second format.

---

## The short version

Steady state: read the spec Part, place the `.tsx` under the right category, author it (client leaf,
wrap Base UI without leaking, semantic plus `--motion-*` tokens, tier and accessibility contract),
add its item to `registry.json` with `dependencies` and `registryDependencies`, run `bun run build`
(inline, validate, never-leak lint, graph check, emit to `public/r`), write the demo plus the
templated MDX page plus `meta.json`, test (Vitest Browser Mode plus Playwright APG), pass the four
gates, then branch, conventional commit with a body, and open a PR from the template, and update the
codebase map.

The current asterisk: the first component also builds the registry pipeline, the `/r` route and
`public/r`, the docs component-page template, and installs the test stack, because right now the
registry is empty and the plumbing is unimplemented.
