@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

The shared, tool-agnostic guidance — project overview, the three concepts, workspace map, critical
always-on rules, development commands, and git workflow — lives in **@AGENTS.md** (imported above).
This file adds only the Claude Code-specific layer: path-scoped rule loading.

---

## Path-Scoped Rules (Claude Code)

Rules in `.claude/rules/` carry `paths:` frontmatter and load automatically when their glob matches
the file you are editing. Unconditional rules (no `paths:`) always load. The detailed rules
referenced throughout AGENTS.md live here.

**Unconditional (always load):**

- @.claude/rules/naming.md — naming conventions
- @.claude/rules/security.md — non-negotiable security + architecture invariants

**Path-scoped:**

- @.claude/rules/typescript.md — `**/*.{ts,tsx}`
- @.claude/rules/react.md — `**/*.tsx` (Server/Client boundaries, hooks, hot/cold split)
- @.claude/rules/tokens.md — `packages/tokens/**`
- @.claude/rules/motion.md — `packages/registry/**/*.tsx`, `packages/tokens/src/css/motion.css`
- @.claude/rules/accessibility.md — `packages/registry/**/*.tsx`, `apps/docs/**/*.tsx`
- @.claude/rules/registry.md — `packages/registry/**`
- @.claude/rules/cli.md — `packages/cli/**`
- @.claude/rules/docs.md — `apps/docs/**`
- @.claude/rules/documentation.md — `packages/**`, `apps/docs/content/**`
- @.claude/rules/writing.md — `**/*.{md,mdx}` (prose voice and formatting)
