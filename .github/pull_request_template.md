<!--
Title must follow Conventional Commits: type(scope): brief description
Scopes: tokens | registry | cli | docs | motion | a11y | repo | deps

Examples:
- feat(motion): add anticipate easing to toast swipe dismissal
- fix(tokens): correct warning-text contrast on light surface
- docs(registry): document both install doors on the Button page
-->

## Overview

<!-- What this PR does and why it is needed. -->

## Changes

- Change 1
- Change 2

## Technical details

<!-- Notable implementation decisions, trade-offs, affected workspaces. -->

**Files added / modified:**

- `path/to/file` - what changed

## Testing

```bash
bun run lint && bun run typecheck && bun run format:check && bun run build
```

**How to verify:**

<!-- Steps to confirm the change. For components, link the docs page that renders it. -->

## Related issues

Closes #

## Checklist

- [ ] Title/commits follow Conventional Commits with a valid scope
- [ ] `bun run lint && bun run typecheck && bun run format:check && bun run build` passes
- [ ] Components consume semantic tokens, not `--neutral-*`
- [ ] No public API references `@base-ui/*` (the never-leak boundary holds)
- [ ] Motion follows the tier contract (Tier 2 tuned via `--motion-*` tokens only)
- [ ] Docs / spec updated in the same change where behavior changed
- [ ] No mention of Claude or AI in commit messages
