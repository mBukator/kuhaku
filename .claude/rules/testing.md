---
paths:
    - "**/*.test.{ts,tsx}"
    - "packages/registry/test/**"
    - "packages/registry/vitest.config.ts"
---

# Testing

Vitest in Browser Mode, Playwright provider, real Chromium. A component is tested where it runs:
in a browser, with the shipped token CSS, never against jsdom's imitation of layout and color.

---

## Running

- `bun run test` from the root (`turbo run test`), or from `packages/registry`. It runs Vitest on
  Node - the `vitest` bin carries a `node` shebang. Never `bun --bun vitest`: Bun's timer and
  module shims break fake timers and the browser runner.
- Node `^22.12`, `^24` or `>=26`, the range Vitest 5 supports (`.nvmrc` pins 22). Install the
  browser once from `packages/registry` with `bunx playwright install chromium`, so the pinned
  Playwright picks the build.
- `pre-push` and CI run the suite after the build.

## Layout

- Tests sit next to their source: `Button.tsx`, `Button.test.tsx`. The registry build reads only
  the paths `registry.json` declares, so a test file never ships.
- Harness code lives in `packages/registry/test/` and is imported through the `#test/*` subpath
  (`import { runAxe } from "#test/axe"`), never through `@/`, which is the adopter's alias space.
- `test/setup.ts` loads `test/styles.css` (the token layer plus `@source "../src"`), registers
  `toHaveNoViolations`, and resets the color mode after each test.

## Rules

- Load the real CSS. axe measures contrast from computed styles; without the tokens every color
  check passes vacuously.
- Unmeasured contrast fails. `toHaveNoViolations` treats axe's `incomplete` color-contrast results
  as failures: text overlapped by a positioned sibling (a stacked cross-fade slot) is never
  measured. Lift the text layer above its siblings rather than excluding the node.
- Strict modes are held to AAA: `runAxe` adds the `wcag2aaa` rules (7:1 text contrast) whenever
  `data-a11y="strict"` is set.
- Every component carries an axe matrix: each variant × each state × `COLOR_MODES` (light, dark,
  strict, strict-dark). Key the variant and state lists with `satisfies Record<…, true>` so a value
  added to the types fails the matrix until it is covered.
- Query by role and accessible name (`getByRole("button", { name: "Save" })`), the way assistive
  technology finds the control. Test IDs and class names are a last resort.
- Keyboard contracts go through `userEvent` from `vitest/browser`, which sends real Playwright key
  events: Tab stops, Enter and Space activation, disabled skips.
- Timers: fake only what the test owns - `vi.useFakeTimers({ toFake: ["setTimeout",
"clearTimeout"] })`. Faking `requestAnimationFrame` or `performance` freezes `motion`.
- While timers are fake, never assert with `expect.element` or `expect.poll`: every retry advances
  the fake clock, so a check waits its way past the value it should catch. Move the clock inside
  `act` (the one `renderHook` returns) or follow it with a two-frame wait, then assert once with a
  plain `expect`.
- Focus leaves a newly disabled element only at Chromium's next frame. Wait two animation frames
  before asserting focus after a state change, or the check passes before the bug can show.
- Deterministic motion: `applyColorMode("strict")` sets `data-a11y="strict"`, and
  `useMotionSuppressed` collapses every transition to an instant cut. Keep at least one test per
  component on the default timeline.
- Assert behavior and contract, not implementation: `data-state`, `aria-busy`, focus, the
  accessible name - not class strings.
