---
paths:
    - "packages/registry/**/*.tsx"
    - "packages/tokens/src/css/motion.css"
---

# Motion (the differentiation wedge)

Motion is the reason Kuhaku exists. The rules below are a contract, not defaults.

---

## The one-sentence law

**In Kuhaku, motion is functional or it does not exist.** Every animation does exactly one of:
encodes a state change, confirms an input, or _is_ the component (Tier 1). Functional motion carries
one of four kinds of information — **causality** (you acted), **provenance** (this came from there),
**continuity** (this is the same object moving), **attention** (something changed off-focus).

**The deletion test:** if removing the animation loses no information, it was decoration — remove it.

## Tier discipline

- **Tier 1 — motion as identity.** The component _is_ its motion (Marquee, DotGrid, cursors,
  backgrounds). Lives **behind and around** content — never _on_ functional surfaces. No opt-out
  beyond `prefers-reduced-motion`; instead it exposes **tuning props** (`duration`, `delay`,
  `stagger`, `ease`, `direction`).
- **Tier 2 — motion as information.** The functional core (Dialog, Popover, Button, Switch, …).
  **On by default, tuned only through `--motion-*` tokens — never per-component motion props.** The
  absence of an off switch is the wedge; do not add one.
- **Tier 3 — motion withheld.** Display/layout/typography primitives. No motion, no prop to add it.
- **Tier 3-kinetic** (Skeleton, Spinner, Progress) — motion is the semantic content; a stopped
  spinner means "stopped." Fixed characters per spec 5.5; exempt from the 300ms law.

## Performance rules (compositor-only)

- Animate **`transform` and `opacity` only.** No `width`/`height`/`top`/`left`/`margin`, no animated
  `box-shadow` (fake it with an opacity-animated pseudo-element), no animated `filter`/`backdrop-filter`.
- The **one sanctioned layout animation** is height/width expansion via
  `grid-template-rows: 0fr → 1fr` (and `grid-template-columns` for horizontal).
- `will-change` is a scalpel: apply on interaction start, remove on settle, never leave resident.
- Looping / Tier 1 components gate on an `IntersectionObserver` and fully suspend offscreen; clamp
  `devicePixelRatio` at 1.5 for canvas/WebGL.

## The laws (micro-interactions)

- **50ms law:** first visible response within 50ms of input (ideally next frame).
- **300ms law:** no micro-interaction exceeds 300ms input-to-rest.
- **Fidelity law:** input position (slider thumb, drag surface) tracks the pointer 1:1 — never eased.
- **One-voice law:** simultaneous property changes on one control share one timeline.
- **Asymmetry:** exits run at roughly two-thirds of their entrance duration.

## Implementation

- Springs come from the `lib/motion` runtime, which reads the CSS spring triplets; import animation
  APIs from **`motion/react`** (not `framer-motion`).
- **Do not add per-component reduced-motion branches for Tier 2.** Reduced motion and AAA strict
  mode are handled by the token remap in `motion.css` — every component complies through the tokens
  it already consumes, and compliance cannot drift per component.
- See @.claude/rules/tokens.md for the token layer and @.claude/rules/accessibility.md for the
  reduced-motion contract.
