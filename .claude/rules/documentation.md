---
paths:
    - "packages/**"
    - "apps/docs/content/**"
---

# Keep docs and shipped values in sync

When you add or change user-facing behavior, you MUST update the relevant docs and/or spec in the
**same change**. Never let `apps/docs/content/` or `apps/docs/spec/kuhaku-spec.md` drift from
`packages/`.

Mapping:

- **New / changed token** → the matching Foundations page under `content/docs/` **and** the comment
  in `theme.css` / `motion.css` (including any contrast measurement).
- **New / changed component** → its component page (the Part 9 template) **and** the component index.
- **New / changed CLI verb or flag** → the CLI / Registry page, showing both install doors.
- **Changed default or behavior** → whichever page documents that behavior.

Because the docs consume the token package and the built registry directly, a drift here is a
correctness bug, not a documentation nicety — the docs are the integration test (see
@.claude/rules/docs.md).
