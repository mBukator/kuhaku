---
paths:
    - "**/*.tsx"
---

# React (Server & Client Components)

Next.js 16 App Router + React 19. Server Components are the default; every `"use client"` is a
deliberate boundary, not a habit.

---

## The Server/Client boundary

- Server Components by default. A component that only renders data — no state, effects, event
  handlers, browser APIs, or `motion` — stays a Server Component.
- `"use client"` only when you need interactivity: `useState`/`useReducer`, effects, event
  handlers, refs to DOM, browser APIs, or the `motion` runtime.
- Push the boundary to the leaf. Mark the smallest interactive piece as client, and pass
  server-fetched data down to it as props. Do not mark a whole page client to animate one button.
- A Server Component may render a Client Component; a Client Component may **not** render a Server
  Component (pass one in as `children`/props if you need that composition).
- Fetch data in Server Components. No client-side API ping-pong for data the server already has.

## Hooks

- Follow the rules of hooks; keep dependency arrays honest.
- No unnecessary effects. Derive during render; reach for `useEffect` only for genuine external
  synchronization. Most "compute on state change" logic is a render-time derivation.
- Custom hooks are `useXxx`, camelCase, and live where they are shared (`registry:hook` items in
  `packages/registry`).

## File order

Every name is declared before it is read, and related declarations sit together. A component file
reads top to bottom in this order:

1. `"use client"` (when needed), then imports.
2. Module constants - timing values first (with the spec reference that justifies each number),
   then derived constants built from them. A helper a constant is computed with sits directly
   above that constant (`strokeBetween` in `Checkmark.tsx`), since it must exist first.
3. Style definitions - the `cva` variants, then lookup records keyed by the same props (typed with
   `satisfies Record<…>` so a missing key fails where it is written).
4. Internal components and helpers, unexported.
5. The exported component.

Inside a component body, in blocks separated by one blank line:

1. Hooks - React requires them first and unconditional.
2. Derived values - the `is`/`has`/`can` booleans computed from props and hook results.
3. Transitions and handlers, grouped by what they drive (press, label, shake), not by kind.
4. The returned JSX.

`Button.tsx` is the reference file for this order.

## The hot/cold split (motion performance)

Pointer- and scroll-driven components must not re-render per frame:

- Hot path (per-frame values: pointer position, scroll offset, animated transforms) lives on
  **refs and motion-values**, mutated directly, bypassing React state.
- Cold path (structural changes: variant, open/closed, item added) uses React state and props.
- Never call `setState` on every pointer/scroll event. Coalesce reads/writes through a single
  `requestAnimationFrame` cycle.

## Base UI composition

When wrapping a Base UI part, honor its render-prop contract: **forward the ref and spread received
props onto the underlying element.** Keep Base UI internal — see @.claude/rules/registry.md and
@.claude/rules/security.md (the never-leak boundary).

```tsx
// Interactivity isolated to the client leaf; parent stays a Server Component.
"use client";

import { useReducedMotion } from "motion/react";

export function PressableIcon({ label }: { label: string }) {
    const isReduced = useReducedMotion();
    // ...
}
```
