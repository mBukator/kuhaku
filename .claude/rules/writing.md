---
paths:
    - "**/*.{md,mdx}"
---

# Writing style

kuhaku's docs and marketing speak in one voice: calm, confident, declarative, argued. These rules
govern all prose - docs content, guides, READMEs, changelog. The formatting and no-AI points also
apply to commit messages, PR titles and bodies, code comments, and CLI output strings.

## Voice

- Declarative, present tense. "Buttons scale to 0.97 on press," not "buttons will scale" or "we
  added a subtle effect." The system is a set of facts.
- Argue every decision - state the value and its reason together. Do not hedge, do not apologize, and
  do not list the roads not taken unless the contrast teaches something.
- Calm. No exclamation marks, no emoji, no hype adjectives. Show the behavior and let precision carry
  the enthusiasm: "the switch thumb overshoots 4% and settles under 300ms" is how kuhaku gets excited.
- Direct. Address the reader as "you." Refer to the system as "Kuhaku," never "we," in docs; "we" is
  allowed only in the changelog and blog, where humans are visibly speaking. Short sentences where
  short suffices.

## Formatting

- Bold is for genuine emphasis: a word or short phrase that must stand out - a hard requirement
  (`MUST`, `never`), a warning, or a key term on first use. Use it sparingly.
- Do not use bold as decoration: not on bullet or numbered lead-ins, not on table-cell labels, not
  on filler words. Write `- Dev tooling: the baseline` (not `- **Dev tooling**: the baseline`) and
  `Tier 1 is identity motion` (not `**Tier 1.** Identity motion`). A bolded "TLDR" label is fine.
- Hyphens (`-`), never em dashes (`—`) or en dashes (`–`).
- Headings are sentence case.

## Avoid

- Hype adjectives: blazing, beautiful, powerful, delightful, seamless, robust, cutting-edge,
  game-changing. Banned outright - demonstrate instead.
- AI-tell filler: "delve," "it's worth noting," "in today's fast-paced," "a testament to," "when it
  comes to," "at the end of the day," "leverage" (as a verb), "unlock."
- Mentioning Claude or AI in commit messages or PRs (titles and bodies), including a `Co-Authored-By`
  trailer. Never do it.

On-demand voice help and a page template live in the `kuhaku-writing` skill
(`.claude/skills/kuhaku-writing/`).
