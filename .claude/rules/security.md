# Security & Architecture Invariants

Non-negotiable. These apply to ALL code in the repository.

---

## 1. No telemetry, no phone-home

Zero analytics, usage tracking, or "calling home." The system is privacy-first. No component and no
CLI command emits network traffic on its own initiative.

## 2. CLI filesystem safety

The `kuhaku` CLI writes into other people's projects. Therefore:

- Confine all writes to the detected target project root. Never write outside it.
- Never construct file paths from unchecked input. Resolve, normalize, and verify containment.
- Confirm before overwriting adopter files, and always honor `--dry-run` and `--diff`.
- Installed code belongs to the adopter — "updating" is re-installation by consent, never mutation.

## 3. No arbitrary code execution

- No `eval`, no `new Function`.
- Validate registry JSON against the registry-item schema before acting on it. Treat every
  fetched registry payload as untrusted until validated.

## 4. Safe subprocess execution

Any child-process call (e.g. shelling out to a package manager) uses **`execa` with an args array,
never string interpolation**:

```ts
import { execa } from "execa";

// CORRECT — args array, treated as literal values
await execa("bun", ["add", packageName]);

// WRONG — injection vulnerability
await execa(`bun add ${packageName}`, { shell: true });
```

## 5. Registry integrity is a build gate

The registry build must:

- validate every item against the shadcn registry-item schema,
- verify the `registryDependencies` graph is acyclic and complete,
- fail the build — not the adopter — when an item references an undeclared registry dependency.

## 6. The Base-UI-never-leaks boundary

Base UI (`@base-ui/react`) is an implementation detail, and keeping it one is an architectural
security invariant (it preserves the option to re-implement any primitive in-house without breaking
adopters):

- import `@base-ui/react/*` **internally only** — no barrel re-exports Base UI;
- **no public prop or exported type references a `@base-ui/*` type**;
- the registry-build lint fails any component whose exported types reference `@base-ui/*`.

---

## Checklist before committing

- [ ] No network calls / telemetry
- [ ] CLI writes confined to project root; overwrite confirmed; `--dry-run` honored
- [ ] No `eval` / `new Function`; registry JSON validated against schema
- [ ] Child-process calls use `execa` with args arrays
- [ ] No public API surface references `@base-ui/*`
- [ ] Components reference semantic tokens, not `--neutral-*`
