# Naming Conventions

These rules apply to ALL code in the repository, regardless of file type or workspace.

---

## Pre-naming checklist

Before creating any variable, function, constant, type, component, or hook, verify:

1. **Clarity** — can someone understand its purpose without reading the implementation?
2. **Accuracy** — does the name describe what it holds or does?
3. **Readability** — readable at a glance (not too long, not abbreviated)?
4. **Single responsibility** — does it reflect one focused purpose?

---

## Core rules

### No single-letter variables

Except in very short lambdas. `const userName = ...`, not `const n = ...`.

### Never abbreviate

Clarity over brevity. `config` not `cfg`, `message` not `msg`, `component` not `cmp`.

### Include units in names

`timeoutMilliseconds`, `sizeBytes`, `maxLengthCharacters` — not `timeout`, `size`, `maxLength`.
The motion tokens already do this: `--motion-duration-fast` is `150ms`, named for its role.

### Functions do only what their name says

A function named `validate` validates and returns a result; it does not also create, write, or
fetch. Hidden side effects behind an innocent name are the bug this rule prevents.

### Booleans use `is` / `has` / `can`

`isValid`, `hasStagedChanges`, `canEdit`, `isReducedMotion`. The prefix signals a boolean before
anyone reads the logic.

---

## Convention table

| Element                | Convention           | Example                      |
| ---------------------- | -------------------- | ---------------------------- |
| Variables / functions  | camelCase            | `buildRegistryItem()`        |
| Constants              | SCREAMING_SNAKE_CASE | `MAX_SUBJECT_LENGTH`         |
| Types                  | PascalCase           | `RegistryItem`, `MotionTier` |
| React components       | PascalCase           | `Button`, `DotGrid`          |
| React hooks            | `use` + camelCase    | `useReducedMotion`           |
| Component files        | `PascalCase.tsx`     | `Button.tsx`                 |
| Non-component TS files | `kebab-case.ts`      | `registry-build.ts`          |
| CSS custom properties  | `--kebab-case`       | `--motion-ease-out`          |

---

## Token namespaces (three audiences — do not mix them)

- `--neutral-*` — **internal** wiring. Components and themes never reference it directly.
- Semantic tokens (`--background`, `--primary`, `--muted-foreground`, …) — **shadcn's vocabulary,
  verbatim**, so foreign themes drop on unmodified. This is what components consume.
- `--motion-*` — **proprietary** namespace, marking where the ecosystem's conventions end and
  Kuhaku's contribution begins.
