---
paths:
    - "**/*.test.{ts,tsx}"
    - "packages/registry/test/**"
    - "packages/registry/vitest.config.ts"
    - "apps/docs/e2e/**"
    - "apps/docs/playwright.config.ts"
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

## Docs E2E

- `apps/docs/e2e/*.spec.ts` run on `@playwright/test` against the production build, never the dev
  server: `docs#test` depends on `docs#build`, and `playwright.config.ts` starts `next start` on
  port 3100, clear of a dev server on 3000. `bun run test` runs them beside the Vitest suite.
- While writing specs, build once (`bun run build` from the root), then run `bunx playwright test`
  (or `--ui`) from `apps/docs`. Turbo leaves `e2e/` and `playwright.config.ts` out of the docs
  build hash, so a spec edit replays the cached build.
- Chromium only. The docs runner and Vitest share one `playwright-core`, so the browser install
  from `packages/registry` serves both; keep `bun.lock` at a single `playwright-core`.
- An empty `e2e/` fails the run with "No tests found". That is deliberate.
- Query with `getByRole(role, { name, exact: true })`. A name that repeats on the page needs a
  scope: the playground preview and the demos all render "Save changes", and the controls live in
  the `Customize` region.
- A failed CI run uploads the HTML report and traces as the `playwright-report` artifact.

## Layout

- Tests sit next to their source: `Button.tsx`, `Button.test.tsx`. The registry build reads only
  the paths `registry.json` declares, so a test file never ships.
- Token pair audits live in `packages/registry/test/token-contrast.test.ts`: `packages/tokens` has
  no runner, and the registry harness already loads the shipped token CSS.
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
