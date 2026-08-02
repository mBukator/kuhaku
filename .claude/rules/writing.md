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

- Bold only for genuine emphasis. Never bold bullet lead-ins, labels, or the first phrase of a line
  as decoration - if everything is bold, nothing is. A bolded "TLDR" label is the one accepted
  exception.
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
