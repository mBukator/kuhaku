---
paths:
    - "packages/tokens/**"
---

# Design Tokens (the CSS layer as data)

`packages/tokens` is the CSS token layer — `theme.css` (color, type, radius, strict swaps),
`motion.css` (the `--motion-*` table), `tailwind.css` (the `@theme` mapping). It is plain CSS and
consumed by both the registry build and the docs' token-reference pages, so **documentation and
shipped values cannot disagree.**

---

## Color

- Author every color in OKLCH. Its lightness channel is perceptually uniform, which is what
  makes the accent-preset system safe: presets change H and C but **hold L**, so a contrast audit
  done against the default survives the swap.
- Components reference semantic tokens only (`--background`, `--primary`, `--muted-foreground`,
  …), never `--neutral-*`. The neutral ramp is internal wiring.
- Semantic names are **shadcn's, verbatim** — do not rename them; interop is the whole point.
- New color tokens ship with a measured contrast note in a comment, matching the existing style
  (e.g. `/* 7.32:1 */`). Audit **pairs** (foreground on its surface), not lone tokens.

## Status tokens have two roles — do not conflate them

- `--{status}` is a **fill**, paired with `--{status}-foreground` and audited as a pair.
- `--{status}-text` is for **text, icons, and meaningful borders** — always use it for colored text.

One hue cannot do both: warning-as-text on light measures ~2.4:1 and fails AA, which is exactly why
`--warning-text` exists separately. This is already documented at the foot of `theme.css`; keep it
that way.

## Dark mode & Tailwind v4 — the `@theme inline` rule

Values that differ between light and dark live in plain `:root` / `.dark` / `[data-a11y="strict"]`
selectors — **this structure is deliberate; keep it.** Do **not** move mode-dependent values into
`@theme inline`: `@theme inline` bakes the value into the utility at build time, which breaks dark
mode. The `@theme inline` _mapping_ (exposing tokens to Tailwind utilities) belongs in `tailwind.css`
/ the consuming app / the `registry:theme` item — not inline with mode-specific values.

## Motion tokens (`motion.css`)

- The reduced-motion and strict-mode collapses are **token-level** and must stay in sync across all
  three selectors (`@media (prefers-reduced-motion)`, `[data-a11y="strict"]`, and the base `:root`).
- Spring `linear()` approximations are **build output — never hand-write them.** The CSS ships the
  spring _parameters_ (`--motion-spring-*-stiffness|damping|mass`); the `lib/motion` runtime and the
  build consume them.
- Two survivors (the 100ms overlay fade, the 200ms Tier 1 mount fade) live as component-level
  literals by design, not as tokens — do not tokenize them.

## Naming

Three namespaces, three audiences: `--neutral-*` (internal) · semantic (shadcn) · `--motion-*`
(proprietary). See @.claude/rules/naming.md.
