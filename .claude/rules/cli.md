---
paths:
    - "packages/cli/**"
---

# CLI (`kuhaku`)

The `kuhaku` CLI is the branded front door, but it speaks the shadcn registry protocol internally,
byte for byte. Reference: spec Part 8. Principle: **own front door, standard plumbing.**

---

## Delegate, don't reinvent

- The CLI is a **thin orchestration layer over shadcn's resolution logic.** Where drift risk exists,
  it **delegates** rather than reimplements, so upstream protocol evolution is inherited, not chased.
- **Pass shadcn's inspection verbs and flags through unchanged**: `--dry-run`, `--diff`, `view`,
  `search`. Inventing synonyms for solved verbs is the CLI equivalent of renaming `--primary`.

## Commands

- `kuhaku init` — detect framework + Tailwind v4, write `components.json` with the `@kuhaku`
  namespace pre-registered, install the base payload, and ask **at most two questions**: accent
  preset (default `ink`) and font acceptance (default Geist). `--preset [CODE]` skips even those.
- `kuhaku add <names>` — resolve against the registry with **full `registryDependencies`
  traversal**. `--all` exists.
- `kuhaku apply --preset <code>` — mirrors `shadcn apply`: reinstall components + update theme,
  colors, CSS vars, fonts, icons; preserve project settings.
- `kuhaku diff <name>` — local-versus-registry divergence for the consent-based update flow.

## Both doors are equal

Document both install paths as equals everywhere:

- front door — `npx kuhaku add button`
- ecosystem door — `npx shadcn@latest add @kuhaku/button`

One namespace, one registry, two doors, no second format.

## Safety

Filesystem writes follow @.claude/rules/security.md: confined to the target project root, overwrites
confirmed, `--dry-run`/`--diff` honored, subprocess calls via `execa` with args arrays.
