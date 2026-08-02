---
name: kuhaku-writing
description: Write kuhaku docs, guides, changelog, and marketing prose in the house voice - calm, confident, declarative, argued. Use when drafting or editing any kuhaku prose, including component doc pages and READMEs.
---

# Kuhaku writing skill

Draft and edit kuhaku prose in the system's one voice. This skill complements
`.claude/rules/writing.md`: the rule enforces while you edit markdown, this skill guides drafting on
demand.

## The voice in four words

Calm, confident, declarative, argued.

- Declarative: present tense, stated as fact. "The switch thumb overshoots 4% and settles under
  300ms." Not "we added a spring" or "buttons will scale."
- Argued: every decision carries its reason within reach. A token value or API shape without a stated
  why is not finished - it was defaulted into, not decided.
- Calm: no exclamation marks, no emoji, no hype. Precision is the register enthusiasm takes.
- Direct: "you" for the reader, "Kuhaku" for the system (never "we" outside changelog and blog),
  sentence-case headings, short sentences.

## Structure a docs page

Live preview, then install (both commands), usage, an API table generated from the TypeScript source,
motion behavior (moving components restate their quantified motion spec; still components state that
they are still), then accessibility (the contract plus its keyboard-matrix test), examples, and
related. Lead with the thing itself, not preamble. One compelling sentence beats a warm-up paragraph.

## Word choice

- "scales to 0.97 on press" over "has a nice press effect"
- "settles under 300ms" over "feels snappy"
- concrete verbs over "leverage," "utilize," "unlock," "empower"
- name the reason over "simply," "just," "of course," which paper over unargued decisions

Banned: blazing, beautiful, powerful, delightful, seamless, robust, cutting-edge, game-changing;
exclamation marks; emoji.

## Formatting

- Bold only for genuine emphasis, never as decoration on bullet lead-ins or labels. A bolded "TLDR"
  label is the one accepted exception.
- Hyphens, never em or en dashes.
- Sentence-case headings.

## Never

Mention Claude or AI in commit messages or PRs, including a Co-Authored-By trailer.

## Before shipping prose, check

- Is every claim a present-tense fact?
- Does each decision state its why?
- Any hype adjective, exclamation mark, or emoji? Remove it.
- Any decorative bold or em dash? Fix it.
- Any "we" outside the changelog or blog? Change it to "Kuhaku."
