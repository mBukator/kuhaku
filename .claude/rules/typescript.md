---
paths:
    - "**/*.{ts,tsx}"
---

# TypeScript

Applies to all TypeScript across the monorepo. Formatting (4-space, double quotes, semicolons,
90-column width, import order) is handled by Prettier — do not hand-format; run `bun run format`.

---

## Types

- **Prefer `type` over `interface`.** Use `interface` only when you need declaration merging.
- **Never use `any`.** Use `unknown` and narrow with type guards. `any` disables the checker that
  is the point of TypeScript here.
- **`import type`** for type-only imports (keeps them out of the runtime graph, matters for RSC and
  bundle size).
- **Explicit return types on exported functions.** Inference is fine internally; the public surface
  should be legible and stable.
- ESM only, `moduleResolution: "bundler"` — no `require`, import from package roots/subpaths.

## Values & control flow

- `===` / `!==`, never `==` / `!=`.
- `??` for defaults, not `||` (so `0`, `""`, `false` survive).
- Optional chaining for safe access.
- **Early-return guard clauses** over nested `if`/`else`. Check error conditions first and return.
- `const` by default; `let` only when reassigned; never `var`.

## Functions

- Under ~50 lines; one level of abstraction per function. If it mixes orchestration with
  low-level detail, extract the detail.
- A function either **does** something or **returns** something — avoid both (no returning a value
  while also mutating shared state or logging as a side effect).

## Errors

- Never swallow errors. Handle or re-throw with context.
- Throw `Error` objects (or subclasses), never strings.

```ts
// Guard clauses, unknown + narrowing, nullish default
export function parseCount(value: unknown, fallback = 0): number {
    if (typeof value !== "string") return fallback;
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
}
```

## Comments

Explain **why**, not **what**. The token CSS files are the model: every non-obvious value carries a
one-line rationale (e.g. a contrast ratio, a perceptual threshold). Match that density — comment the
argument, not the syntax.
