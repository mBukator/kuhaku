---
paths:
    - "packages/registry/**/*.tsx"
    - "apps/docs/**/*.tsx"
---

# Accessibility

Accessibility is a mechanical gate, not a vibe. Quietness lives in chroma and motion restraint,
never in contrast.

---

## The AA floor, audited per component

- **Text-bearing** (Text, Heading, labels, table cells): 4.5:1 minimum.
- **Interactive controls**: 3:1 non-text contrast for boundaries and state indicators (WCAG 1.4.11),
  visible focus, and a 24×24px minimum hit area (2.5.8) — primary controls exceed it.
- **Dragging surfaces** (Slider, Carousel, Drawer): every drag has a single-pointer non-drag
  equivalent (2.5.7) — arrow keys, track click, buttons.
- **Status primitives** (Toast, Alert, Banner, validation): color is never the only channel (1.4.1)
  — pair with text/icon; announce via live region (`polite`; `assertive` only for errors that block
  the current task).

## Focus

- Render focus on **`:focus-visible`**, not bare `:focus` (no ring-smear on pointer click).
- The ring is the `--ring` **box-shadow** (3px, outside the border) — it never touches layout.
- Its contrast is load-bearing: ≥3:1 against the adjacent surface in both modes.
- Focus is never obscured (2.4.11) or trapped unintentionally; overlays trap and **restore focus to
  their trigger** on close; everything else is escapable by Tab alone.

## Keyboard

Inherit WAI-ARIA APG patterns through Base UI and treat them as contract: roving tabindex in
composite widgets (one Tab stop each), `Home`/`End`, typeahead in Select/Combobox/Command/menus,
`Escape` dismisses the **nearest** dismissible surface only, `Enter`/`Space` per native semantics.
**Every keyboard path is motion-complete** — spring indicators follow keyboard focus exactly as they
follow pointer selection (no two-class interface).

## Density (numbers are commitments)

- 40px default control height (`h-10`); `sm` 32px is a dense-context tool, not a style.
- **44px minimum touch target** on coarse pointers — where the visual is smaller (checkbox, radio
  dot, slider thumb), extend the hit area with an invisible pseudo-element.
- 8px minimum gap between adjacent interactives; 24px card padding; 96px section rhythm.
- Never set interface text below 12px.

## Reduced motion & strict mode

Both are **token-level remaps** — `prefers-reduced-motion` collapses the `--motion-*` table;
`data-a11y="strict"` applies AAA contrast + focus + essential-only motion. **Do not hand-roll
per-component reduced-motion or AAA branches**; rely on the tokens (see @.claude/rules/motion.md and
@.claude/rules/tokens.md). Essential motion is preserved: a spinner keeps rotating (slower); a
skeleton drops its pulse to a static block.
