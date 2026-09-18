# Kuhaku (空白) — Design System Specification

> *The motion-first design system where every interaction is crafted and every still surface is dignified. Built on Base UI, distributed like shadcn, opinionated like Apple.*

**Status:** v1.0 of the specification — compiled July 2026, all nine parts approved.
**Scope:** brand, foundations, 114 components (112 at Phase 1 launch), CLI/registry architecture, docs IA, phase plan.
**Provenance:** produced part-by-part with checkpointed review; all amendments agreed during review are reconciled inline. Aliases, drops, and merges are consolidated in Appendix A; the component index in Appendix B; open work in Appendix C.

**Contents**
1. Brand & Philosophy
2. Foundations: Color
3. Foundations: Typography
4. Foundations: Spacing, Layout & Radius
5. Foundations: Motion
6. Foundations: Accessibility & Density
7. Components — 7a Actions & Forms · 7b Overlays & Navigation · 7c Feedback & Status · 7d Content & Data (two halves) · 7e Layout & Typography · 7f Showcase: Typography & Interaction · 7g Showcase: Backgrounds, Effects, Cursors & Scroll
8. CLI, Registry & Distribution Architecture
9. Doc Site IA & Phase Scope
A. Decision register · B. Component index · C. Post-spec work items

---

# Part 1 — Brand & Philosophy

## The name

Kuhaku (空白) is the ordinary Japanese word for blank space — the empty field on a form, the margin of a page, the gap left where something could have been written. It is composed of two kanji whose pairing is the entire thesis of the system.

The first character, 空 (kū), is the character for *sky*. It is also the character Japanese Buddhism chose to translate śūnyatā — the emptiness at the center of Zen thought. Śūnyatā is routinely misread in the West as nihilism, absence, a lack. It means nearly the opposite: nothing possesses a fixed, isolated essence, because everything exists only in relation to everything else. Emptiness, in this reading, is not what remains when things are taken away. It is the condition that lets things relate at all. The sky is the canonical image because the sky is not the absence of objects — it is the medium in which objects appear.

The second character, 白 (haku), is *white*. Not white as blankness, but white as a material — the white of washi paper, of an unglazed tea bowl, of a gallery wall. White with weight.

Sky-white. Read together, the name asserts that the empty parts of an interface are not leftover pixels waiting to be filled. They are the material the interface is built from. Most design systems treat whitespace as what surrounds the components. Kuhaku treats components as what interrupts the whitespace — and holds that every interruption must therefore earn its place. The name is not a mood board reference. It is a design constraint with a word attached.

In code, the name is always lowercase: `kuhaku`, `npx kuhaku add button`, `@kuhaku/button`. In prose, capitalized: Kuhaku. One name covers the design system and the component library, in the shadcn pattern — the system *is* the code.

## The three-concept architecture

Kuhaku is organized around a triad of Japanese aesthetic principles. The name itself is the first of them. Each governs one dimension of the system, and together they cover everything a design system decides: how things sit in space, how things sit in time, and how things move between states. This is not decoration borrowed for exoticism. Each concept has a precise technical meaning in its home tradition, and Kuhaku uses that precise meaning.

**Kuhaku (空白) governs space.** Layout, density, restraint, and what is deliberately left blank. The spacing scale, the airy density default, the wide default line-heights, the decision to ship generous `Section` padding rather than compact defaults — all of these are the kuhaku principle rendered as numbers. Part 4 makes this concrete. The governing question kuhaku asks of any layout decision is not "what should go here?" but "does anything need to?"

**Ma (間) governs time.** The kanji 間 is itself a small poem: a gate (門) with the sun (日) shining through the gap — the character *depicts* an interval. Ma is the meaningful pause: the silence between notes that makes music rather than noise, the beat an actor holds before a line, the moment a tea host waits before lifting the ladle. Crucially, ma is not dead time. It is *charged* time — the interval carries as much meaning as the events it separates. In Kuhaku, ma governs everything temporal: motion durations, the delay before a tooltip appears, the stagger gap between list items animating in, the hold before an exit begins. Part 5 opens with ma because the central claim of Kuhaku's motion philosophy is that the interval is part of the motion. A stagger delay is not a default someone forgot to zero out. It is a designed pause.

**Jo-ha-kyū (序破急) governs pacing.** The oldest of the three concepts, jo-ha-kyū originates in gagaku court music and was codified by Zeami in his fifteenth-century Noh treatises as the universal shape of all performed action: *jo* (序), a deliberate, gathering beginning; *ha* (破), the break — acceleration, development, complication; *kyū* (急), a swift, decisive close. Zeami's radical claim was that this arc is fractal: it shapes a full day of plays, a single play, a single act, a single gesture of the hand. The same three-beat shape recurs at every scale. The concept spread from Noh into tea ceremony, renga linked verse, and the martial arts, because it describes something true about how humans perceive motion as *intentional* rather than mechanical: begin gently, build, end with commitment. In Kuhaku, jo-ha-kyū governs choreography and easing philosophy — the shape of every curve, the order in which orchestrated elements move, the rule that exits are faster than entrances. Part 5 maps the easing scale onto this arc explicitly.

One dimension each: kuhaku is emptiness in space, ma is emptiness in time, jo-ha-kyū is the shape drawn through both. A component's layout answers to the first, its timing to the second, its trajectory to the third.

## Positioning

> *The motion-first design system where every interaction is crafted and every still surface is dignified. Built on Base UI, distributed like shadcn, opinionated like Apple.*

Every clause of this sentence is load-bearing, and every section of this document exists to make one of its clauses true.

*Motion-first* means motion is a foundation, not a feature — tokenized, tiered, documented at greater length than color. *Every interaction is crafted* means micro-interactions are mandatory on every interactive primitive: no button ships without press feedback, no switch without spring physics. This is a contract, not a default. *Every still surface is dignified* is the counterweight: components whose job is to be still — cards, tables, typography — receive no motion at all, and no prop to add it. Restraint is enforced in both directions. *Built on Base UI* names the behavior layer honestly. *Distributed like shadcn* means open source-code distribution through an ecosystem-standard registry — you own the code the moment you install it. *Opinionated like Apple* means the system has decided things, argues for its decisions, and does not offer a configuration escape hatch for every opinion. Kuhaku is themeable in its tokens and immovable in its philosophy.

## The two wedges

shadcn/ui exists, is excellent, and is free. Kuhaku exists for exactly two reasons, and the entire system should be judged against them.

**Wedge one: motion as a system-level contract.** Not "shadcn plus some animated components" — that library already exists in a dozen forms. In Kuhaku, motion is architected: three tiers with distinct design intent, a token vocabulary (`--motion-*`) with argued values, spring physics specified to the stiffness and damping constant, mandatory micro-interactions on every interactive primitive, and reduced-motion behavior defined per tier. Motion in Kuhaku is not optional at the component level, because a design contract you can opt out of per-component is a suggestion. Adopters who need stillness get it through `prefers-reduced-motion` or strict accessibility mode — accessibility mechanisms, not style flags.

**Wedge two: foundations documentation in the tradition of Uber Base, IBM Carbon, and Adobe Spectrum.** Every token value in this system is argued for, not announced. shadcn deliberately ships minimal foundations documentation — it is a distribution mechanism with taste, and its restraint there is a feature. Kuhaku takes the opposite bet: that a system whose reasoning is legible is a system adopters can extend without breaking, and that the argument *is* part of the product. The foundations sections that follow read like a design book because that is what they are.

## Voice and tone

Kuhaku's documentation and marketing speak in one voice: **calm, confident, declarative, and argued.**

*Declarative.* The docs state what the system does in the present tense: "Buttons scale to 0.97 on press." Not "buttons will scale," not "we've added a subtle scale effect." The system is a set of facts.

*Argued.* Every stated decision carries its reason within reach. The voice never says "we chose 200ms" without saying why 200ms. But argument is not hedging — the docs explain decisions; they do not apologize for them or list the roads not taken unless the contrast teaches something.

*Calm.* No exclamation marks. No emoji. No superlatives without demonstration — the marketing site never calls motion "delightful"; it shows the motion and lets it be. Hype adjectives ("blazing," "beautiful," "powerful") are banned outright. Where enthusiasm is warranted, precision is the register it takes: "the switch thumb overshoots by 4% and settles in under 300ms" is Kuhaku's version of excitement.

*Direct.* Instructions address the reader as "you." The system refers to itself as "Kuhaku," never "we," in documentation; "we" is permitted in the changelog and blog, where humans are visibly speaking. Headings are sentence case. Sentences are short where short suffices.

## Core principles

**1. Emptiness is substance.** *(from kuhaku)* Whitespace is a material with cost and value, not a byproduct of layout. Every spacing decision in the system starts from generosity and must argue its way down to density, never the reverse. Removing an element is always a live design option and often the correct one. The system's airy default density is not a style preference — it is the name of the system, enforced.

**2. The interval is part of the motion.** *(from ma)* A motion design is not just the movement; it is the pause before it, the hold after it, and the gaps between elements that move together. Kuhaku specifies its intervals — tooltip delays, stagger gaps, exit holds — with the same rigor as its durations, because an animation with undesigned intervals is only half designed. Silence between notes is composed, not left over.

**3. Begin gently, end decisively.** *(from jo-ha-kyū)* Every motion follows the arc: soft onset, acceleration, committed close. Entrances take longer than exits, because arriving is an introduction and leaving is a conclusion. Nothing in Kuhaku decelerates limply into place at the end of an exit, and nothing lurches at the start of an entrance. The arc is fractal, as Zeami taught: it shapes a single press feedback and the choreography of an entire page transition alike.

**4. Motion is functional or it does not exist.** Every animation in the system either encodes state, confirms input, or is the component's reason for being (the Tier 1 showcase). There is no fourth category. Decorative motion sprinkled onto functional components is the signature of systems that mistake movement for craft; Kuhaku's tier architecture makes that category structurally impossible to ship.

**5. Stillness is dignified.** The inverse of principle four, and just as binding. Cards do not lift on hover. Tables do not shimmer. Typography does not fade in. Tier 3 components have no `animated` prop, because a still surface that holds its ground signals confidence, and a system that animates everything animates nothing. The restraint is the craft.

**6. Every decision is argued.** No token value, component boundary, or API shape appears in this system without its reasoning attached. This is a documentation standard, but it is also a design discipline: a decision that cannot be argued for is a decision that has not actually been made, only defaulted into. Where Kuhaku inherits a convention (shadcn token names, the `.dark` class), it says so and says why inheritance was the right call.

## What Kuhaku will not be

Kuhaku is not a theme marketplace, and it will not chase visual range — one register, executed completely, is the product. It is not expressive, playful, or brutalist, and it does not add components to compete on inventory count; an EmptyState it has nothing to say about is an EmptyState it does not ship. It is not framework-spanning: React only, React 18.2+, no Vue port, no web-components build. It is not a Radix re-skin or a Base UI re-export — the primitives underneath are an implementation detail the public API never leaks. And it is not neutral: where shadcn hands you an unopinionated starting point, Kuhaku hands you a finished stance and the argument for it. Adopters who want the stance changed can change the tokens. Adopters who want no stance at all have shadcn, and Kuhaku's docs will say so without irony.

*(Reviewed decision: a "field position" paragraph naming competitors was considered for this part and declined — the competitive analysis remains background strategy, not brand copy.)*

---

# Part 2 — Foundations: Color

## Principle

Color in Kuhaku is subtractive. The system begins from the assumption that the correct amount of color is none, and every hue that appears must argue its way in. This is not grayscale asceticism for its own sake — it is the color-domain consequence of emptiness-as-substance. A palette that stays quiet makes the few chromatic moments legible: a destructive red means danger precisely because nothing else on the screen is red. The neutrals are the system; hue is punctuation.

## Why OKLCH

Every color token in Kuhaku is authored in OKLCH, and the reason is structural, not fashionable. OKLCH's lightness channel is perceptually uniform: two colors with the same L read as equally light regardless of hue. This is the property that makes Kuhaku's three-layer accent system safe. When an adopter swaps the canonical ink accent for the indigo preset, the preset changes H and C but holds L — which means every contrast relationship audited against the default survives the swap without re-auditing. In HSL, changing hue at constant "lightness" can swing real contrast by a factor of two; in OKLCH it cannot. The preset system is only responsible because the color space is. (One caveat, recorded honestly: WCAG contrast ratios are still computed in sRGB-luminance terms, so final verification happens there — OKLCH guarantees perceptual stability, not the WCAG arithmetic.)

## The neutral ramp

Kuhaku's neutrals are not gray. They are stone: a single hue family at hue ≈ 95 with chroma between 0.002 and 0.006 — beneath the threshold where anyone would name it as a color, but above the threshold where surfaces read as computed absence. Pure zero-chroma gray is the color of an undecided default; it is what CSS looks like before a designer arrives. The faint warmth pulls Kuhaku's surfaces toward material — washi, unglazed clay, gallery wall — which is the correct reading for a system whose second kanji is the white of paper, not the white of a null pointer. The tint is strongest in the mid-tones (where the eye has chroma sensitivity to spare) and tapers at both extremes, so near-white and near-black stay clean.

One ramp serves both modes; the modes differ only in which steps the semantic layer assigns.

| Step | L | C | H | Note |
|---|---|---|---|---|
| `--neutral-0` | 1.00 | 0 | 0 | Pure white — light-mode card surface only |
| `--neutral-50` | 0.985 | 0.002 | 95 | Light-mode page background |
| `--neutral-100` | 0.965 | 0.003 | 95 | Light muted surfaces; dark-mode foreground |
| `--neutral-200` | 0.925 | 0.004 | 95 | Light borders |
| `--neutral-300` | 0.87 | 0.005 | 95 | Light input borders |
| `--neutral-400` | 0.71 | 0.006 | 95 | Dark-mode muted foreground |
| `--neutral-500` | 0.56 | 0.006 | 95 | Light muted foreground |
| `--neutral-600` | 0.45 | 0.005 | 95 | Strong secondary text |
| `--neutral-700` | 0.37 | 0.005 | 95 | Reserved (icons, tertiary) |
| `--neutral-800` | 0.28 | 0.004 | 95 | Dark-mode hover wash (`--accent`) |
| `--neutral-850` | 0.245 | 0.004 | 95 | Dark popover surface |
| `--neutral-900` | 0.205 | 0.003 | 95 | Dark card surface |
| `--neutral-950` | 0.145 | 0.003 | 95 | Dark page background; light foreground |

Two deliberate irregularities. The ramp is denser at its dark end (850/900/950) than a uniform scale would be, because Kuhaku is dark-leaning and dark UIs spend most of their pixels in a narrow lightness band — elevation in the dark needs fine steps. And the dark background is 0.145, not black. Pure `#000` is a hole, not a surface: it forecloses any darker value, makes elevation-by-lightness impossible beneath it, and produces the harshest possible text edge. Near-black at 0.145 is the night-sky reading of 空 — dark with depth still available below it.

## Semantic tokens

Token names are shadcn-compatible verbatim, so any existing shadcn theme or preset string drops onto Kuhaku unmodified. Kuhaku ships the full shadcn v4 set plus two additions — `success` and `warning` pairs — which shadcn's default theme omits. The superset is safe: a foreign theme that doesn't define them simply leaves Kuhaku's defaults standing. (A `sidebar-*` alias family, matching shadcn's current default theme, ships as pure aliases of existing tokens — zero new colors, full compat; see `theme.css`.)

| Token | Light | Dark |
|---|---|---|
| `--background` | neutral-50 | neutral-950 |
| `--foreground` | neutral-950 | neutral-100 |
| `--card` | neutral-0 | neutral-900 |
| `--card-foreground` | neutral-950 | neutral-100 |
| `--popover` | neutral-0 | neutral-850 |
| `--popover-foreground` | neutral-950 | neutral-100 |
| `--primary` | neutral-950 | neutral-100 |
| `--primary-foreground` | neutral-50 | neutral-950 |
| `--secondary` | neutral-100 | neutral-850 |
| `--secondary-foreground` | neutral-950 | neutral-100 |
| `--muted` | neutral-100 | neutral-900 |
| `--muted-foreground` | neutral-500 | neutral-400 |
| `--accent` | neutral-100 | neutral-800 |
| `--accent-foreground` | neutral-950 | neutral-100 |
| `--destructive` | oklch(0.55 0.20 27) | oklch(0.69 0.19 25) |
| `--destructive-foreground` | neutral-50 | neutral-950 |
| `--success` | oklch(0.55 0.12 150) | oklch(0.72 0.14 152) |
| `--success-foreground` | neutral-50 | neutral-950 |
| `--warning` | oklch(0.72 0.14 75) | oklch(0.78 0.14 80) |
| `--warning-foreground` | neutral-950 | neutral-950 |
| `--border` | neutral-200 | oklch(1 0 0 / 12%) |
| `--input` | neutral-300 | oklch(1 0 0 / 16%) |
| `--ring` | oklch(0.56 0.006 95 / 60%) | oklch(0.71 0.006 95 / 60%) |

Three decisions in this table carry argument, and a fourth was corrected in review. First, dark-mode borders are alpha hairlines (white at 12–16%), not opaque ramp steps: an alpha border composites correctly over every elevation level, so a card border and a popover border are one token, not two — fewer tokens, no drift. Light mode keeps opaque borders because alpha-black hairlines over warm surfaces shift visibly green-gray. Second, dark-mode foreground is neutral-100, not white: full-white text on near-black produces halation (glow-bleed at letter edges) at body sizes; 0.965 removes it while conceding nothing measurable in contrast. Third, `--warning-foreground` is dark in both modes — amber never gets light text, in anyone's system, because amber's luminance makes white text unreadable at any chroma worth calling amber. Fourth (the review correction): `--accent` is not the brand accent — in the shadcn vocabulary it is the *hover wash* behind menu items, command rows, and calendar days; a surface token, one perceptible step of emphasis from the surface it sits on. In light mode emphasis steps darker (neutral-100 on white); in dark mode it follows the elevation rule — higher is lighter — and must sit one legible step above the popover it most often lives on, hence **neutral-800**, not 850 (850 would render menu hover invisible on an 850 popover).

Dark-mode status foregrounds flip to dark text by arithmetic, not style: dark-mode status *fills* rise in lightness (chroma compresses, L rises — see the strategy below) to stay visible as shapes against near-black (WCAG 1.4.11), and at L ≈ 0.69–0.78 white text cannot reach 4.5:1 on them while dark text clears 6:1 comfortably. The foreground is the only value the audited fill permits — the same reason no system anywhere puts white text on amber.

## Light and dark strategy

Kuhaku is designed dark-first: dark mode is the canonical mode the docs and marketing ship in, and light mode is derived — but derivation is a set of principled transforms, never naive inversion. The transforms are three. Elevation always moves toward light: light-mode cards rise from warm paper to pure white; dark-mode surfaces rise from 0.145 through 0.205 to 0.245 — one rule, both modes, so "higher is lighter" is something an adopter can rely on when composing custom surfaces. Chroma compresses in the dark: every semantic hue's dark variant carries equal or lower chroma at higher lightness, because saturated color on near-black fluoresces — the perceived vibrancy of a hue rises as its surround darkens, so a color tuned on white arrives in dark mode already too loud. And borders change mechanism, not just value, as argued above: opaque in light, alpha in dark.

## The canonical accent: ink

Kuhaku's signature accent is **sumi** — ink. `--primary` is not a hue; it is the foreground itself: near-black on light, near-white on dark. The docs site, the marketing site, and every showcase example ship monochrome.

This is a considered position, not an abdication, and the argument has four legs. First, it is the register: every positive reference — Apple's product pages, Hex, Slash, shadcn's own site — is functionally monochrome with color deployed only as meaning. Second, it is the tradition the system's name invokes: sumi-e ink painting builds entire worlds from carbon black on paper white and holds that restraint *is* the expressive act — a design system named for the void, shipping rainbow defaults, would be self-refuting. Third, it is structurally honest with the preset system: ink as layer one makes the five presets in layer two genuine alternatives rather than demotions, and it means Kuhaku's default never competes with an adopter's brand color — the quietest possible host. Fourth, it maximizes motion's salience. Kuhaku's differentiation wedge is motion; on a monochrome surface, movement is the most chromatic thing on screen. Color would compete with the wedge. Ink clears the stage for it.

The practical consequence: in the default theme, semantic hue appears in exactly four places — destructive, success, warning, and charts. Everything else is stone.

## The five presets

Each preset re-points `--primary`, `--primary-foreground`, and `--ring` (charts and status hues are untouched). All five are named from the traditional Japanese color vocabulary — not as garnish, but because that vocabulary already did the curatorial work: these are dye and glaze colors, muted by material reality, and every one of them was quiet before Kuhaku found it. All hold lightness discipline: L 0.46–0.60 in light mode, L 0.72–0.76 in dark, so the contrast audit transfers across all five.

| Preset | Light `--primary` | Dark `--primary` | Rationale |
|---|---|---|---|
| **ai** (藍, indigo) | oklch(0.46 0.10 262) | oklch(0.72 0.10 262) | Aizome dye — "Japan blue." The default recommendation for adopters who want *a* color: serious, cool, and the closest to the ecosystem's expectations of a primary. |
| **seiji** (青磁, celadon) | oklch(0.55 0.06 195) | oklch(0.76 0.07 195) | The gray-green of celadon glaze. The quietest preset — barely a color, the choice for adopters who want ink with a pulse. |
| **koke** (苔, moss) | oklch(0.50 0.08 140) | oklch(0.73 0.09 142) | Moss-garden green, desaturated far below "success" green so the two never collide semantically. Organic, grounded. |
| **kaki** (柿, persimmon) | oklch(0.60 0.13 45) | oklch(0.72 0.13 50) | The warmest and most assertive preset — burnt clay-orange. Sits at the loud edge of the register deliberately, so the set has a ceiling. Distinct in hue from destructive red by 20+ degrees. |
| **fuji** (藤, wisteria) | oklch(0.52 0.09 300) | oklch(0.73 0.09 300) | Muted violet. Cool without repeating ai, soft without sweetness; the one preset in the short-wavelength range. |

Five, not eight: two cools, two warms-to-greens, one violet, plus ink. A larger set would imply the palette is a mood board; a curated set states that Kuhaku has opinions even about the options it offers.

## Chart palette

Charts are the one place Kuhaku needs simultaneous hues, so the five series colors are the five preset hues, harmonized: identical hue angles, lightness locked (0.60 light / 0.72 dark), chroma raised slightly above the presets' — data needs more chroma than chrome, because series must be discriminated at 2-pixel line widths, not admired at button size.

| Token | Hue source | Light | Dark |
|---|---|---|---|
| `--chart-1` | ai | oklch(0.60 0.12 262) | oklch(0.72 0.12 262) |
| `--chart-2` | kaki | oklch(0.60 0.14 50) | oklch(0.72 0.14 50) |
| `--chart-3` | seiji | oklch(0.60 0.09 195) | oklch(0.72 0.10 195) |
| `--chart-4` | fuji | oklch(0.60 0.11 300) | oklch(0.72 0.11 300) |
| `--chart-5` | koke | oklch(0.60 0.11 142) | oklch(0.72 0.12 142) |

Ordering interleaves warm and cool so adjacent series maximize hue distance. Colorblind safety is *not* guaranteed at locked lightness — the ai/kaki pair sits near the protan/deutan confusion axis — so this is the one place Kuhaku recommends redundant encoding (direct labels or dash patterns) rather than pretending five hues alone are colorblind-safe. No five-hue palette is.

## Contrast audit notes

The normative floor is WCAG 2.2 AA, verified in sRGB luminance after OKLCH → sRGB conversion, because that is the space the WCAG arithmetic lives in. The standing pairs: `foreground`/`background` exceeds 12:1 in both modes — headroom, not compliance, because body text is where generosity costs nothing. `muted-foreground` clears 4.5:1 against both `background` and `muted` in both modes (neutral-500 on warm white ≈ 4.7:1; neutral-400 on 0.145 ≈ 6.5:1) — muted text that fails on muted surfaces is the most common audit hole in shipped systems, so Kuhaku audits the pair, not the token. Every `-foreground` clears 4.5:1 on its base at the values above, with dark-mode destructive flipping to dark text precisely because L 0.69 red cannot carry white at AA. Non-text contrast (WCAG 1.4.11) is handled honestly: decorative hairlines are exempt and Kuhaku's default borders are decorative; the boundaries that *must* meet 3:1 — input borders against background, focus indication — are carried by `--input` (passing in light; the 16% alpha hairline in dark is reinforced by the field's surface-level shift) and by `--ring`, audited as the load-bearing focus indicator in both modes. The AAA story (`data-a11y="strict"` swapping muted-foreground and ring for 7:1-capable values) is specified in Part 6.

## Token naming conventions

Three namespaces, three audiences. The semantic layer (`--background`, `--primary`, …) is shadcn's vocabulary, adopted verbatim — interoperability is worth more than nomenclatural originality, and any name Kuhaku invented here would be a tax on every adopter who already knows the ecosystem's names. The internal layer (`--neutral-*`) is Kuhaku's wiring: components never reference it, themes never override it; it exists so the semantic layer has something principled to point at. The proprietary layer (`--motion-*`, Part 5) is namespaced precisely because it has no shadcn equivalent — a prefix that marks where the ecosystem's conventions end and Kuhaku's contribution begins. All three are exposed to Tailwind utilities through `@theme inline` mapping per the v4 convention, and all three are plain CSS variables underneath, so a no-Tailwind adopter consumes `var(--primary)` directly and loses nothing.

---

# Part 3 — Foundations: Typography

## Principle

Typography in Kuhaku is where emptiness becomes legible. A type system is usually described by its marks — sizes, weights, letterforms — but what the reader actually experiences is the space those marks organize: the leading between lines, the measure that ends a line, the white that makes a heading a heading. Kuhaku sets type the way it sets layout: generous by default, hierarchical through size and space rather than weight and noise, and argued down from openness rather than up from density. Large type, wide leading, few weights. The marks are quiet so the intervals can speak.

## The typeface

Kuhaku recommends **Geist** as its default face, with **Geist Mono** as its code sibling — recommended, not required, and the loading architecture below makes the swap a one-item change.

The recommendation is an argument about what this particular system needs from a typeface, and Geist satisfies all four requirements unusually well. First, neutrality with warmth: Geist is a Swiss-tradition grotesque, but its terminals and generous x-height keep it from the clinical chill of Helvetica clones — the typographic equivalent of the neutral ramp's 95-hue warmth, present but unnameable. Second, a designed mono sibling: Geist Mono shares Geist's skeleton, so code inside prose reads as the same voice in a different register rather than a foreign quotation — and Kuhaku, being a developer-facing system, sets more code than most. Third, variable-font delivery: a single variable file covers every weight Kuhaku uses, which matters directly to the loading strategy. Fourth, register fit by provenance: Geist was drawn for exactly the aesthetic neighborhood Kuhaku's positive references live in; it is the native accent of the calm-technical web. The obvious alternative — Inter — fails no technical test but has become the ambient default of the entire industry, and a system that argues every decision should not have "everyone else uses it" as its face's strongest property.

## The scale

Kuhaku adopts Tailwind's size step *names and pixel values* verbatim — `text-xs` through `text-9xl` — and overrides everything else about them: line-height, tracking, and default weight per step. The adoption is the same interoperability argument that settled color naming: components are styled with Tailwind utilities, adopters know what `text-sm` means, and a bespoke scale would tax every consumer for the sake of originality Kuhaku doesn't need. The *opinion* lives in the metrics attached to each step, which is where scales actually differ anyway.

What the inherited values give us is, conveniently, a dual-rate scale — and dual-rate is what Kuhaku would have designed from scratch. From 12 to 20px the steps climb by ~1.13–1.14 (a major-second rhythm); from 24px upward the ratio widens toward 1.25 and beyond. A single ratio cannot serve an interface: one tuned for UI text produces display sizes that differ by indistinguishable slivers, and one tuned for display (1.25+) tears holes in the UI range, leaving no honest value between "label" and "body." Fine steps where text works, wide leaps where text performs.

| Step | Size | Line-height | Tracking | Default role |
|---|---|---|---|---|
| `text-xs` | 12px | 1.5 (18px) | +0.015em | Metadata, Kbd, table captions |
| `text-sm` | 14px | 1.5 (21px) | +0.005em | UI controls, labels, dense table cells |
| `text-base` | 16px | 1.65 (26px) | 0 | Body prose — the anchor |
| `text-lg` | 18px | 1.6 (29px) | −0.005em | Comfortable body, lead recipe |
| `text-xl` | 20px | 1.5 (30px) | −0.01em | h4, card titles |
| `text-2xl` | 24px | 1.4 (34px) | −0.015em | h3 |
| `text-3xl` | 30px | 1.3 (39px) | −0.02em | h2 |
| `text-4xl` | 36px | 1.2 (43px) | −0.022em | h1 (docs/product) |
| `text-5xl` | 48px | 1.1 (53px) | −0.025em | Display |
| `text-6xl` | 60px | 1.05 (63px) | −0.028em | Display |
| `text-7xl` | 72px | 1.0 (72px) | −0.03em | Display |
| `text-8xl` | 96px | 1.0 (96px) | −0.035em | Marketing hero |
| `text-9xl` | 128px | 0.95 (122px) | −0.04em | Marketing hero |

Line-heights are expressed unitless in the tokens; the pixel renderings above are illustrative at the listed sizes. Sub-1.0 leading at 9xl reclaims the slack in Geist's internal metrics — at that scale type is a graphic object, and stacked hero lines should nearly touch.

Above the static scale sits one fluid step, a first-class token rather than a recipe:

```css
--text-display: clamp(4rem, 2.2rem + 6vw, 9rem);
```

Roughly 64px on a phone, 121px at 1440, capped at 144px — larger than 9xl at the top end, because the cap is where the hero lives. `Heading`'s `display` variant consumes this token by default; the static 8xl/9xl steps remain for authors who want exact control. The rationale for promoting fluidity to a token: if the marketing hero is a named use case of the scale, the system ships its sizing instead of describing it. *(Review history: the original draft capped the scale at 7xl and demoted fluid sizing to a recipe; both were reversed on review, and the reversal is the correct call — 72px on a 1920px viewport is a subheading wearing a hero's clothes.)*

## Leading, argued

The line-height column is the most opinionated in the table, and it is the kuhaku principle rendered as vertical rhythm. Body text at 1.65 sits above the industry's 1.5 reflex, and deliberately: leading is the interval that lets a line end and the next begin — ma between lines — and research on reading comfort consistently favors the 1.5–1.7 band for sustained prose at text sizes. Kuhaku takes the open end of that band because its docs are long-form arguments, not dashboards, and because generous leading is the cheapest airiness a system can buy — it costs nothing in layout complexity and pays on every paragraph.

The taper toward 1.0 and below at display sizes is the same logic inverted. Leading needs are proportional to *reading distance traveled*: a 70-character body line requires a wide gutter for the eye's return sweep; a three-word hero headline requires almost none, and open leading at 72px makes multi-line headlines fall apart into disconnected banners. Large type wants to clot into a single mass; the scale lets it. UI sizes (`sm`, `xs`) hold at 1.5 rather than tapering down — controls are cramped by their containers already, and their line-height is doing box-model work, not just reading work.

## Tracking

Tracking follows the optical rule that spacing needs run inverse to size, because the eye's ability to separate letterforms improves as they grow. Small text opens up: +0.015em at 12px keeps metadata legible where counters start to clog. Body is untouched — Geist's native fit at 16px is the fit its designers intended, and zero is a decision, not an omission. Display tightens progressively to −0.04em: large grotesque type set at its natural tracking looks *loose*, gapped, uncommitted; the tightening returns display headlines to the dense, confident mass the register calls for. The curve is progressive rather than a single "headline" value because a step function in tracking is visible exactly at the boundary where it switches. At weight 700 the display tracking relaxes by 0.005em against the table values, because bold counters need the hair of air that regular weights don't. One additional rule: tracking adjustments never apply to mono — code alignment is semantic, and letterspacing code breaks the grid that makes it code.

## Weights

Kuhaku ships four weights: **400** (body), **500** (UI chrome and inline emphasis), **600** (headings), **700** (display). The specific assignments: 400 carries all continuous reading, because text you live in should not perform; 500 is the weight of *chrome* — buttons, labels, tabs, anything that names an action — strong enough to separate control text from content text without bolting it down; 600 tops out the headings. 700 is governed by one hard rule: it exists only at `text-5xl` and above. It never appears on headings h1–h4, never on UI chrome, never inline — below display scale, 700 is shouting, and the register holds. At display scale the calculus inverts: a 128px hero at 700 with tight tracking reads as *mass*, not volume — the confident slab the Apple references actually use — and the size is doing so much hierarchical work that the weight reads as material density rather than emphasis. The `display` variant therefore defaults to 700; 500 and 600 remain available on it for editorial moments that want the hero lighter. Inline emphasis in prose uses 500, not 600, and italic remains available for the cases where emphasis should be felt rather than seen. The variable-font subset covers 400–700 — one file, all four weights.

## Heading hierarchy

The `Heading` component maps levels to steps, with the level (`as`) and the visual size deliberately decoupled — document structure is semantics, size is layout, and welding them together is how systems force authors into skipping heading levels to get the look they need.

| Level (default) | Step | Weight | Notes |
|---|---|---|---|
| `h1` | `text-4xl` | 600 | Docs/product pages |
| `h2` | `text-3xl` | 600 | Section |
| `h3` | `text-2xl` | 600 | Subsection |
| `h4` | `text-xl` | 500 | Card/panel titles |
| `h5` | `text-base` | 500 | Rare; dense-context heading |
| `h6` | `text-sm` | 500, +0.06em, uppercase-optional | The eyebrow slot |

A `size` prop overrides the visual step independently of `as`; a `display` variant unlocks the display range (default: the fluid token at weight 700) for marketing surfaces, where h1 is one element and the hero is another responsibility entirely.

## Body styles

`Text` is the body primitive: `size` (`sm` | `base` | `lg`), `weight`, `muted` semantics via token, rendering as `p` by default with an `as`/`render` escape. Per the locked decision, `Lead` and `Muted` are not components but recipes — a lead paragraph is `<Text size="lg">` with `muted-foreground` at 500 tracking-normal, documented in Recipes; shipping them as components would multiply API surface to save one line of props.

`Prose` is the long-form wrapper — docs pages, articles, changelogs — and it carries Kuhaku's strongest typographic opinion: **measure**. Prose constrains line length to `65ch`, the center of the 45–75 character band that reading research has defended for a century. An unconstrained text column on a wide viewport is the most common typographic failure on the web, and it is a *whitespace* failure: the margin that should bound the column has been spent as line length. Inside Prose, vertical rhythm is pre-composed — paragraph spacing of one line-height unit, heading top-margins of two — so adopters get correct long-form rhythm by wrapping, not by spacing every element by hand.

## Code and mono

Geist Mono, via `--font-mono`, in two registers. **Inline code** sets at `0.875em` relative to its surrounding text — mono faces run optically larger than their sans siblings at equal point size (wider advance, fuller x-height), and the relative unit keeps inline code correctly subordinated at *every* size it appears in, from body to headings. It carries a `muted` background tint, `radius-sm`, and 2px horizontal padding: a chip, not a highlight. **Block code** sets at `text-sm` with line-height 1.7 — taller than body leading because code lines are scanned discretely, not read in sweeps, and the extra interval separates lines that share no grammar. Blocks live on `card` surfaces with `border`, never on raw background. `Kbd` sets one register lower (`text-xs`, 500) inside a bordered chip with a bottom-heavy border — the one skeuomorphic pixel Kuhaku permits, because a key that looks faintly pressable is information, not decoration. Ligatures are disabled in all code contexts (`font-variant-ligatures: none`): Geist Mono's ligatures are handsome, but glyphs that visually merge `!=` into a single mark misrepresent the character stream, and code display answers to accuracy first.

## Loading strategy

Fonts ship as a `registry:font` item — configuration pointing at the font, never the font files themselves, per the locked distribution rule. For Next.js adopters (the canonical path), the item installs a `fonts.ts` that loads Geist and Geist Mono through `next/font/google`, requesting the **variable** files subset to the 400–700 axis range — one file per family covering all four weights, self-hosted automatically by Next at build time, with `display: swap`. The loader exposes each family as a CSS variable that the theme maps into `--font-sans` and `--font-mono`; components only ever reference the theme tokens.

Two details keep the swap honest. First, fallback metrics: the stack behind Geist is not bare `sans-serif` but a metric-adjusted local fallback (`size-adjust`/`ascent-override` tuned to Geist's dimensions — next/font generates this automatically), so the pre-swap frame lays out at final geometry and text does not reflow when the webfont lands. A system this invested in motion cannot tolerate layout shift as its first animation. Second, the non-Next path is documented as a first-class citizen, not a footnote: a plain `@font-face`/Fontsource variant of the same item for Vite and friends, mapping to the identical `--font-*` tokens. Swapping the typeface — for a brand face, or for the moment Geist's ubiquity catches up with Inter's — is replacing one registry item and touching nothing else; every metric in this section is expressed against tokens and relative units precisely so the scale survives a face change with re-tuning limited to tracking, the one truly face-specific column.

---

# Part 4 — Foundations: Spacing, Layout & Radius

## Principle

This is the section where the system's name becomes arithmetic. Kuhaku — emptiness as substance — means that space in this system is not the gap between components; it is a material the components are set into, and the spacing scale is how that material is quantized. Two consequences follow and govern everything below. First, space is *semantic*: the distance between two elements is a statement about their relationship, and the scale exists so those statements are consistent — near means related, far means separate, and the same nearness always means the same relatedness. Second, defaults are generous and density is the argued exception. Most systems ship compact and let adopters add air; Kuhaku ships air and makes compactness a decision someone has to defend. The name is enforced in the defaults.

## The spacing scale

Kuhaku adopts the 4px base grid and Tailwind's step vocabulary verbatim — `--spacing: 0.25rem` as the generator token, steps referenced as multiples (`gap-4` = 16px, `p-6` = 24px). The adoption argument is the one that settled color and type: components are styled in Tailwind utilities, every adopter already reads this vocabulary fluently, and non-Tailwind consumers still get the generator as a plain CSS variable. A bespoke 5px or 8px-base scale would be a permanent translation tax purchasing nothing — 4px grids won because they divide every common size cleanly and align with how platform vendors (Apple's 4pt, Material's 4dp) already quantize space.

The opinion, as with type, lives one layer up: in *which* steps the system speaks, and what each means. An unbounded scale is not a system — it is a ruler, and rulers produce drift, because when 12, 14, and 16px are all equally available, three developers produce three rhythms. Kuhaku constrains itself to nine working steps and assigns each a relationship meaning:

| Step | Value | Relationship it encodes | Canonical uses |
|---|---|---|---|
| `1` | 4px | Fused — parts of one glyph-level unit | Icon-to-label inside a button, Kbd padding |
| `2` | 8px | Bound — one control's internals | Input padding-block, chip padding, gap inside a Cluster of tags |
| `3` | 12px | Grouped tightly | Checkbox-to-label, gap between a control and its inline hint |
| `4` | 16px | Related — siblings in one block | Form field internals (label→input→error), card padding floor |
| `6` | 24px | Adjacent blocks | Gap between form fields, card padding default, Stack default |
| `8` | 32px | Distinct blocks | Gap between cards, card-group spacing |
| `12` | 48px | Sub-sections | Heading-to-content bands inside a section |
| `16` | 64px | Sections (compact contexts) | Docs-page section rhythm |
| `24` | 96px | Sections (canonical) | Marketing/landing `Section` default padding-block |

Steps between these (5, 7, 10…) remain *available* — the grid generates them — but the documented system never uses them, and the docs say so. The gaps in the sequence are load-bearing: the jump from 32 to 48 to 64 to 96 is deliberately non-linear, because perception of separation is logarithmic — 24px versus 28px is invisible, 64px versus 96px is a different statement. The scale runs quasi-geometrically above 16px (×1.5, ×1.33, ×1.5) for exactly this reason: linear steps at large sizes waste distinctions nobody can see.

Two calibration notes locate the "airy" claim in numbers. Kuhaku's *default* internal padding for a card is 24px where the ecosystem's reflex is 16; its default Stack gap is 24px where the reflex is 12–16; its section rhythm at 96px is roughly double a typical dashboard's. And the floor matters as much as the defaults: nothing in Kuhaku's shipped components sets a gap below 8px except icon-fusion cases at 4px. Air is the resting state; every step down toward density must be argued from a real constraint (data tables get one, in Part 6's density discussion — marketing pages never do).

## Layout primitives

Kuhaku ships five layout components, and the set is closed. Each owns exactly one spatial concern, they compose without overlap, and together they cover the layouts the register actually produces. The argument for shipping them at all — rather than telling adopters "it's just flexbox" — is consistency of *vocabulary*: when spacing is semantic, the code that produces spacing should read semantically too. `<Stack gap={6}>` is a sentence; `display:flex; flex-direction:column; gap:24px` is plumbing. The five exist so that the plumbing never appears in application code.

**Stack** owns the vertical axis. A flex column with a `gap` from the scale (default `6` / 24px — the "adjacent blocks" step, per the table) and an `align` for the cross axis. Stack is the workhorse: forms, card interiors, page bodies are Stacks of Stacks, and nesting Stacks with different gaps is precisely how the relationship scale becomes visible structure — a `gap={4}` Stack inside a `gap={8}` Stack *is* the grouping hierarchy, rendered.

**Cluster** owns the horizontal axis with wrapping. Tag rows, button groups, metadata lines — anything that flows inline and must wrap gracefully when the container narrows. Default gap `2` (8px), `justify` and `align` props. Cluster exists as a separate primitive rather than a `direction` prop on Stack because horizontal grouping wraps and vertical grouping doesn't; pretending they are one component with a flipped axis papers over the one behavior that actually differs.

**Grid** owns two-dimensional placement: `columns` (fixed count or `min` child width for auto-fit behavior), `gap` (default `6`). Grid is for peer collections — card grids, feature grids, galleries — where items are equals and the geometry should say so. The `min` API deserves its sentence of rationale: `columns={{ min: '16rem' }}` compiles to `repeat(auto-fit, minmax(16rem, 1fr))`, which makes the *content* declare its minimum viable width and lets the viewport decide the count — responsive behavior without breakpoint bookkeeping, which is the correct default for a system that wants layout decisions argued once.

**Container** owns horizontal bounds: max-width plus symmetric inline padding, centered. Sizes `sm` (40rem), `md` (48rem), `lg` (64rem), `xl` (80rem, default), plus `prose` (matching the 65ch measure so page chrome and text column can align). Container is where the margin — the white at the page's edge — is made deliberate rather than residual; an unconstrained full-bleed div is the layout-scale version of the unconstrained text column Part 3 prosecuted.

**Section** owns vertical bounds: the padding-block that separates one band of a page from the next, default `24` (96px) with `sm` (64px) and `lg` (128px) variants. Section is the primitive most systems don't ship, and its absence is why most pages' vertical rhythm is improvised. In Kuhaku it is the flagship spatial statement — the 96px default is the single number that most makes a Kuhaku page *look like* a Kuhaku page — and it exists as a component precisely so that number is a default someone inherits rather than a value someone remembers.

Why all five and not three: each removes a different improvisation. Stack and Cluster remove ad-hoc gaps, Grid removes ad-hoc breakpoints, Container removes ad-hoc measure, Section removes ad-hoc rhythm. Remove one and its concern returns to application code as plumbing — and plumbing drifts.

## Radius

Corner radius follows the shadcn v4 pattern exactly: one root token, a derived scale via `calc()`, so an adopter re-themes every corner in the system by editing a single line — and any shadcn preset string that sets a radius lands on Kuhaku correctly.

```css
--radius: 0.75rem;                        /* 12px — the Kuhaku default */

--radius-sm: calc(var(--radius) - 6px);   /* 6px  — chips, Kbd, inline code */
--radius-md: calc(var(--radius) - 3px);   /* 9px  — inputs, buttons, menu items */
--radius-lg: var(--radius);               /* 12px — cards, popovers, tooltips */
--radius-xl: calc(var(--radius) + 6px);   /* 18px — dialogs, sheets, large surfaces */
--radius-2xl: calc(var(--radius) + 12px); /* 24px — hero media, showcase frames */
--radius-full: 9999px;                    /* pills, avatars, switch */
```

The root value is the argued number. shadcn's own default is 0.625rem (10px); Kuhaku sets 12px, one perceptible step softer, because "soft to pillowy" is the register and 12px on a card is where the corner stops reading as a chamfered rectangle and starts reading as a rounded object — while staying well short of the 20px+ blob territory that reads playful, which the register forbids. The scale's internal logic: radius tracks *surface size*. Small elements get small radii because a 12px radius on a 24px chip consumes the entire form; large overlays get 18–24px because a dialog at 12px looks sharper than the card next to it — perceived roundness scales inversely with the arc's share of the edge, so constant curvature requires graduated values. The derivation offsets (−6, −3, +6, +12) keep the whole family proportionate when an adopter moves the root: set `--radius: 0` and everything sharpens together to brutalist right angles; set 1rem and the system goes fully pillowy — one slider, coherent output at every position.

One nesting rule ships as documentation, because it is the most common radius error in the wild: concentric corners must not share a radius. An element inset by padding *p* inside a rounded parent takes `calc(parent-radius − p)` (floored at 0) — an image inside a `--radius-lg` card with 12px padding is radius 0, flush logic, not a smaller pillow inside a larger one. Matching nested radii produces the thick-cornered "picture frame" artifact; the rule costs one calc and removes it everywhere.

## Border widths

One width: **1px**. Kuhaku's borders are hairlines — the drawn line of a technical diagram, not a structural wall — and a system whose surfaces separate primarily by elevation and spacing needs borders only as the quietest possible edge confirmation. There is no 2px "emphasized border" token, deliberately: emphasis via border thickness is emphasis via noise, and every legitimate emphasis case Kuhaku has is already served by a dedicated mechanism — focus uses the `--ring` (a shadow-built ring outside the border, so focus never reflows layout), selection states use surface and foreground shifts, destructive framing uses border-*color*. The single exception is honest and bounded: `data-a11y="strict"` mode thickens focus indicators, and Part 6 owns that. Divider lines (`Separator`, table rules) are the same 1px in `--border`; in dark mode they are the 12% alpha hairlines Part 2 argued, which at 1px render as exactly the faint scribe-line the register wants. Zero-border compositions — surfaces separated purely by background step and gap — are not just permitted but preferred where elevation already does the work; the border is the fallback separator, the space is the primary one. That priority ordering, stated plainly, is this section's thesis in miniature: in Kuhaku, the first tool for separating two things is always the emptiness between them.

---

# Part 5 — Foundations: Motion

## Principle

Motion is Kuhaku's first foundation among equals — the reason the system exists — and it is governed by the two concepts of the triad that live in time. **Ma (間)** holds that the interval is part of the motion: the pause before a tooltip commits, the beat between staggered items, the hold between an exit and the entrance that answers it. These gaps are composed, never residual — a motion design with undesigned intervals is half a design. **Jo-ha-kyū (序破急)** holds that every motion has the same shape: gentle onset, acceleration, decisive close. Nothing in Kuhaku lurches into existence, and nothing trails limply out of it.

One sentence underneath both: **in Kuhaku, motion is functional or it does not exist.** Every animation in the system does one of three jobs — it encodes a state change, it confirms an input, or it *is* the component (Tier 1). There is no fourth job. "Delight" is not a job; delight is the *residue* of the first three done precisely.

## 5.1 What motion means

Functional motion carries four specific kinds of information, and every Tier 2 behavior in this document traces to one of them. **Causality** — this happened because you acted: the button compresses under your pointer, the switch thumb travels because you flipped it. Feedback must begin within perceptual synchrony of the gesture (≤50ms, ideally the next frame), or the causal link snaps. **Provenance** — this surface came from somewhere: a popover grows from its trigger, a sheet enters from the edge it lives on. Motion that encodes origin is what keeps overlays from feeling like teleportation. **Continuity** — this is the same object: the tab indicator *slides* between tabs rather than blinking, because a slide says "one indicator, new position" while a blink says "two indicators." **Attention** — something changed outside your focus: the toast rises at the screen edge exactly loudly enough to be noticed and no more.

The negative space of this list is as binding as the list. Motion that carries none of the four — a card that lifts on hover, a heading that fades in on scroll by default, a decorative shimmer on a static surface — is noise wearing craft's clothing, and Tier 3's stillness rule makes it structurally unshippable. When in doubt, the test is deletion: if removing the animation loses no information, the animation was decoration, and it goes. (Tier 1 components pass this test by definition — delete a Marquee's motion and the component itself is gone. That is what "motion is the reason it exists" means.)

## 5.2 The duration scale

Five tokens. The scale is anchored on human perceptual thresholds, not aesthetic preference: below ~100ms an event reads as instantaneous; 200–300ms is the band where a transition is visible but never waited on; beyond 400ms motion becomes an *event* the user attends to, which is a cost only large spatial changes can pay for.

| Token | Value | Role |
|---|---|---|
| `--motion-duration-instant` | 50ms | Perceptually synchronous feedback: hover tints, active-state color, press-down onset |
| `--motion-duration-fast` | 150ms | The micro-interaction workhorse: focus rings, small anchored surfaces, most exits |
| `--motion-duration-default` | 250ms | Standard state change: dialog enter, accordion, validation morphs |
| `--motion-duration-slow` | 400ms | Large spatial motion: sheet and drawer travel, complex reveals |
| `--motion-duration-slower` | 600ms | Orchestrations: page transitions, Tier 1 sequences, staggered groups (total, not per-item) |

Against the neighbors: Material 3 bands its durations 50–200/250–400/450–600 and leans to the short end for utility surfaces; Apple's UIKit default has been ~300ms for a decade, and modern iOS is spring-first with settle times near 300–350ms. Kuhaku's `default` at 250ms deliberately splits them — slower than Material's snappiest, because a calm register does not snap, but shy of Apple's 300ms because Kuhaku's surfaces are lighter-weight than an iOS sheet. Where Kuhaku genuinely differs from both is at the ends: the micro layer runs *faster* than either (feedback at 50–150ms, because causality reads at speeds comfort doesn't), and the system tokenizes something neither vendor does — the interval itself, in 5.10.

The asymmetry rule sits on top of the scale rather than inside it: **exits run at roughly two-thirds of their entrance.** A dialog entering at 250ms leaves at 150; a popover entering at 150 leaves at 100. Entrances are introductions — the user must perceive what arrived and from where. Exits are conclusions of an already-made decision; every millisecond after the user dismisses something is the interface disobeying. This is kyū as arithmetic.

## 5.3 The easing scale

Easing is where jo-ha-kyū stops being philosophy and becomes curve geometry — but the mapping has to be stated honestly, because it operates at the level of the *event*, not just the bezier. In an interactive system, the jo — the gathering, deliberate beginning — belongs to the **user's gesture**. The click is the wind-up. The interface's reply therefore begins mid-arc, at ha: it must move immediately and decisively, then close cleanly. This is why entrance curves front-load velocity, and why the one place Kuhaku uses a true slow-onset curve is motion the *system* initiates on its own clock, where the interface owns the whole arc.

| Token | Value | Character |
|---|---|---|
| `--motion-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Near-expo deceleration. The entrance curve: maximum velocity at frame one, long soft settle |
| `--motion-ease-in-out` | `cubic-bezier(0.66, 0, 0.34, 1)` | Weighted symmetric. The travel curve for on-screen repositioning — and the purest single-curve rendering of jo-ha-kyū: gentle onset, whip through the middle, committed stop |
| `--motion-ease-anticipate` | `cubic-bezier(0.44, -0.24, 0.28, 1)` | Dips ~6% behind the start before launching. Reserved for deliberate dismissals and Tier 1 exits — the backswing that makes a departure look chosen |
| `--motion-spring-snappy` | physical (5.4) | Micro-interaction settle |
| `--motion-spring-soft` | physical (5.4) | Spatial settle |

Assignment by situation, not by component: **entering elements** take `ease-out` — they start invisible (opacity 0, scale 0.96), so the curve's aggressive first frames are perceptually masked and what the eye receives is a soft materialization with a gentle landing; the felt onset is jo even though the math is not. **Elements moving while visible** — a tab indicator, a reordering toast, an accordion edge — take `ease-in-out`, because a visible object accelerating from zero is the only honest way to move mass, and instant-velocity starts on visible objects read as physics violations. **Exits** take `ease-in-out` at exit durations, where the curve's accelerating back half dominates — departure that gathers speed, kyū — with `anticipate` as the marked form for user-flung dismissals like a swiped toast. The set omits a bare `ease-in` deliberately: raw accelerate-only curves end at maximum velocity, i.e. they *end by being interrupted*, and nothing in Kuhaku ends by accident. And no motion, anywhere, uses `linear` except constant-velocity loops — spinner rotation (5.5) and autonomous drift (Marquee, AnimatedBorder in 7f) — where linearity is the point: rotation or drift with easing wobbles like a bent wheel.

## 5.4 Spring tokens

Springs are for settling — moments where a physical object (a thumb, a released button, an indicator) arrives and the arrival should carry mass. CSS beziers can imitate overshoot but not respond to interruption; a spring retargeted mid-flight conserves its velocity, which is why every interruptible micro-interaction in Kuhaku is spring-driven through `motion`. Two springs cover the system:

| Token | Stiffness | Damping | Mass | ζ | Overshoot | Settle |
|---|---|---|---|---|---|---|
| `--motion-spring-snappy` | 500 | 32 | 1 | 0.72 | ≈4% | ≈250ms |
| `--motion-spring-soft` | 260 | 26 | 1 | 0.81 | ≈1.5% | ≈320ms |

The numbers are chosen from the damping ratio outward, because ζ is what the eye actually reads. **Snappy** at ζ 0.72 produces a single visible overshoot of about 4% and no perceptible second oscillation — the character of a real toggle: it *snaps*, confirms with one small excess, and is still. This is the micro-interaction spring: button release, switch thumb, radio dot, toggle press, slider-thumb grab. Its ~250ms settle keeps every spring-driven micro-interaction inside the 300ms law of 5.6. **Soft** at ζ 0.81 barely overshoots — 1.5% is subliminal, felt as weight rather than seen as bounce — and drives spatial elements: the tab indicator gliding between labels, a drawer settling into place, a Magnet returning home. Larger visual masses bouncing visibly read as toys; the register forbids it.

Deliberately absent: a bouncy spring (ζ < 0.5). Multiple visible oscillations are the signature of playful systems, and Kuhaku's negative references are precisely those systems. Tier 1 components that want springier character tune per-instance via props; the *system* vocabulary stays at two.

Distribution honesty: springs are physical parameters, not CSS timing functions. The tokens ship as CSS variable triplets (`--motion-spring-snappy-stiffness`, `-damping`, `-mass`) consumed by a small runtime helper (`registry:lib`) that feeds `motion`'s spring transition; the build additionally emits CSS `linear()` approximations of each spring's curve so no-JS contexts (plain CSS consumers, the docs' token page) can render the same character. One spring definition, two delivery formats.

## 5.5 The tier architecture, in depth

The three tiers are not intensity levels — they are three different *answers to why motion is present*, and each answer produces different rules.

**Tier 1 — motion as identity.** Twenty-nine components whose motion is their reason to exist: delete the animation and the component is gone. Because motion is identity here, there is no `animated` prop and no opt-out short of `prefers-reduced-motion` — you do not install a Marquee and ask it to hold still. What Tier 1 exposes instead is *tuning*: `duration`, `delay`, `stagger`, `ease`, `direction`, because identity-motion is the one place per-instance character is legitimate. Tier 1 is also spatially fenced: it lives **behind and around** content — backgrounds, cursors, section-scale effects, hero typography — never *on* functional surfaces. A DotGrid breathing behind a hero is charged emptiness, the kuhaku made faintly visible; the same motion on a Card would be a Tier 3 violation wearing a costume. The fence is what lets ambient motion and dignified stillness coexist as one stance rather than a contradiction.

**Tier 2 — motion as information.** The functional core, split by which information it carries. *State-change* motion (Dialog, Popover, Accordion, Toast, Tabs' indicator, and kin) encodes provenance and continuity — something appeared, expanded, moved. *Micro-interaction* motion (Button, Checkbox, Switch, Slider, Input focus, and kin) encodes causality — your input landed. Both are mandatory and on by default, tuned exclusively through the `--motion-*` tokens, never through per-component props. The absence of an off switch is the wedge itself, argued once more for the record: a contract with per-component exits is a suggestion, and "motion-first" would then be marketing. The system-level tokens are also why sixty-plus Tier 2 components feel like one system — every duration and curve in the tier resolves to the same five durations, three curves, two springs.

**Tier 3 — motion withheld.** The display, layout, and typography primitives that respond to nothing with movement and expose no prop to change that. Stillness here is not a missing feature; it is the counterweight that gives Tier 1 and 2 their meaning — a system where everything moves has no way to make movement mean. Dignified stillness is Kuhaku's second product.

**Tier 3-kinetic — the intrinsic carve-out.** Skeleton, Spinner, and Progress contain motion that is neither decoration nor interaction feedback: it *is the component's semantic content*. A spinner that does not spin communicates "stopped," which is a different message, not a quieter one. Their motion is therefore not governed by micro-interaction rules, not opt-in, and defined here as fixed characters: **Skeleton** pulses opacity 0.55 ↔ 0.85 on a 2000ms `ease-in-out` loop — a slow breath, deliberately below attention-grabbing frequency, because a loading placeholder should register as alive without competing with content that has loaded. **Spinner** rotates at 900ms per revolution, `linear` — legitimate linear, since rotation with easing wobbles like a bent wheel. **Progress** animates fill via transform scaling over `--motion-duration-default` with `ease-out` (value changes are events; they get the event grammar), and its indeterminate mode sweeps a 40%-width band on a 1400ms `ease-in-out` loop. All three loops are exempt from the 300ms law — they are not interactions — and all three carry defined reduced-motion forms in 5.8.

## 5.6 Micro-interactions

The universal laws first, then the specifications. **The 300ms law:** no micro-interaction exceeds 300ms from input to full rest — feedback that outlives the gesture becomes theater. **The 50ms law:** the first visible response lands within 50ms of the input, ideally the next frame; the confirmation may *settle* for 250ms more, but it must *begin* at once. **The fidelity law:** springs and easings mediate presentation (scale, color, glow) but never input position — a slider thumb or drag surface tracks the pointer 1:1, because smoothing input is lag with good manners. **The one-voice law:** simultaneous property changes on one control share one timeline — border and ring move as a chord, never two blinking soloists.

**Button.** Pointer-down: scale 1 → 0.97 over 100ms `ease-out` — Apple's press grammar, fast enough to feel synchronous, deep enough to read as compression. Release: spring back to 1 via `spring-snappy`; the ~4% overshoot is the tactile "click" rendered visually. Hover: `translateY(-1px)` plus background tint over 150ms — one pixel, the minimum detectable lift; two pixels is eagerness. Focus: the focus grammar below. Total worst case: 100 + 250 spring settle = within law.

**Checkbox.** Check: box background and border-color cross over 150ms while the checkmark draws via stroke-dashoffset over 200ms `ease-out`, starting 50ms into the fill — overlapping, not sequential, so the whole event reads as one gesture (~250ms) rather than two steps. The draw direction follows the stroke's natural writing order; a checkmark is a tiny act of writing and should look written. Uncheck: no reverse theater — mark and fill fade together in 120ms. Undoing is kyū.

**Switch.** The thumb travels on `spring-snappy`: one 4% overshoot past its endpoint, settle under 300ms — the overshoot is the point, the visual weight of a physical toggle striking its stop. Track color cross-fades over 150ms timed so the track completes as the thumb crosses midpoint; color confirms while motion is still in flight. Held pointer-down before release: the thumb widens to 108% along the travel axis over 100ms — the "gripped" affordance — and the stretch releases into the travel spring.

**RadioGroup.** Incoming dot scales 0.4 → 1 on `spring-snappy`; outgoing dot in the group fades and scales to 0.6 in 100ms simultaneously. Selection moves; it doesn't blink.

**Slider.** Thumb position: 1:1 with the pointer, no easing ever (fidelity law). Thumb scale: 1 → 1.15 on grab via `spring-snappy`, back on release. Value tooltip: appears 150ms after grab (a ma interval — instant tooltips flicker on accidental grabs), rising 4px as it fades in over 150ms. Track fill tracks the thumb exactly.

**Toggle / ToggleGroup.** Pressed-state background and foreground cross over 150ms with a 0.97 scale dip on activation via `spring-snappy` — the button grammar at lower amplitude, because a toggle is a button that stays.

**Input / Textarea focus.** One 150ms timeline, two properties as a chord: border-color shifts to `--ring`'s hue while the ring itself fades from opacity 0 and expands 0 → 3px spread. Never a hard-edged ring popping in, never border and ring on different clocks. Blur: ring fades in 100ms. The ring is built as `box-shadow`, so focus never touches layout.

**Validation state.** Border and ring colors morph over 200ms; the message swaps by cross-fade — outgoing text falls 2px and fades in 100ms, incoming rises 2px and fades in 150ms after a 50ms interval. The message slot reserves min-height so validation never reflows the form; a form that jumps when it complains is punishing, not informing. **Error shake** *(added on review)*: on a rejected submission, the failing field's control shakes — three cycles, ±4px, 240ms total, `translateX` only — firing once per submission attempt, never looping; brief and non-repeating by a11y intent.

**Pagination.** The active-page indicator translates between positions over 200ms `ease-in-out` — continuity grammar, one indicator moving, not two swapping.

Nothing above is configurable per-component. That is the contract: an adopter has now read the complete motion character of every interactive primitive in the system, and so has everyone who will ever use anything built on it.

## 5.7 State-change motion

Surfaces follow a common grammar with per-family accents. **Anchored surfaces** (Popover, Tooltip, HoverCard, all menus, Select, Combobox) enter at `fast`/150ms `ease-out` with opacity 0 → 1 and scale 0.96 → 1, `transform-origin` set at the anchor side — provenance made visible; the surface grows *from* its trigger. Exit: 100ms, origin preserved. Tooltip adds the ma interval: a 400ms open delay (`--motion-delay-hint`) so pointers passing through don't detonate hints, with immediate open while moving within a tooltip-dense group — the pause is for *arrival*, not for every hop. **Centered modals** (Dialog, AlertDialog, Command palette shell) enter at `default`/250ms: scale 0.96 → 1 with fade, backdrop fading on the same clock; exit at 150ms with the backdrop trailing slightly so content leaves first — the room dims after the actor exits. Command runs its enter at 200ms; a utility summoned by keystroke should feel nearer than a ceremony. Backdrops fade opacity only — animating `backdrop-filter` blur is a frame-budget massacre (5.9); if blur is used it arrives at full value under the fade. **Edge surfaces** (Sheet, Drawer, Sidebar collapse) travel their full offset at `slow`/400ms `ease-out` entering, 250ms `ease-in-out` exiting — large masses crossing real distance get the time mass deserves. **Expansion** (Accordion, Collapsible, Banner): height animates 250ms `ease-in-out` (the one sanctioned layout animation — 5.9 shows the grid-rows technique that keeps it honest), content fading in the expanding region trailing by 50ms; collapse at 200ms with content fading first. Edges accelerate from rest — visible mass obeys `ease-in-out`, per 5.3. **Toast** enters from its screen edge, translate + fade, 250ms `ease-out`; the existing stack reflows on `spring-soft` as one connected system; dismissal collapses the vacated height over 200ms so the stack closes ranks rather than teleporting; swipe-dismissal exits along the swipe vector with `anticipate`. **Indicators** (Tabs, Steps, NavigationMenu highlight) move on `spring-soft`, position and width sprung together — continuity's canonical form.

**The Skeleton→content handoff** *(added on review)*: when real content replaces a Skeleton, the two cross-fade over 200ms in reserved dimensions — the skeleton's geometry must match the incoming content's, because a loading state that reflows on resolution converts anticipation into punishment. This is the one choreography rule that spans a Tier 3-kinetic component and arbitrary content, and it is stated here so no component owns it alone.

## 5.8 Reduced motion

`prefers-reduced-motion: reduce` (and the strict mode of Part 6) remaps behavior per tier, honoring WCAG's actual target — *non-essential* motion — rather than performing blanket stillness. **Tier 1:** every component swaps its identity-motion for a 200ms opacity fade at mount; scroll-driven components (ScrollReveal, ParallaxSection) render final-state static; ambient loops (DotGrid drift, Shader, Orbit, Marquee) hold a designed still frame — Shader's `gradient` variant keeps its CSS-gradient fallback, the noisier variants their static tiles. **Tier 2 state-change:** surfaces cut to end-state; the sole survivor is a 100ms opacity fade on overlays, because a full-screen dialog appearing in literally zero frames reads as a glitch even to motion-sensitive users — near-instant, not violent. **Tier 2 micro:** springs and transitions collapse to instant state application; focus rings appear at full value with no fade; validation messages swap without cross-fade. Causality information survives — states still change visibly — only the *choreography* is removed, which is precisely the vestibular-trigger layer. **Tier 3-kinetic, the essential-motion carve-out:** Skeleton drops its pulse and renders as a static placeholder block — shape alone says "loading," so its motion was reinforcing, not essential. Spinner *keeps rotating* — a stopped spinner is a false "finished" — but slows to 1400ms/rev, cutting rotational energy while preserving the message; where a determinate value exists, components should prefer Progress in this mode. Indeterminate Progress becomes a static bar at 100% `muted` fill with its accessible label carrying the "working" message — the sweep was the only signal, so text replaces it. Implementation is token-level, not component-level: the reduced context remaps the `--motion-*` table (durations to 0ms, springs to instant, the two sanctioned fades as literals), so all sixty-plus Tier 2 components comply through the one mechanism they already consume, and compliance cannot drift per-component.

## 5.9 Performance

The motion contract is only defensible if it is free, and free means compositor-only. The rules: animated properties are `transform` and `opacity`, full stop — no `width`, `height`, `top`, `left`, `margin`, no animated `box-shadow` (fake it: a pseudo-element carrying the target shadow, animated in opacity), no animated `filter` or `backdrop-filter` - with one carve-out: **Tier 1 identity motion, where the blur _is_ the effect** (AnimatedText's `reveal`, TextHover's `blur` mode, AnimatedTabs' `blurPanels`) may animate `filter`, behind the fence, never on a functional surface, and only under the IntersectionObserver suspension and 1.5 `devicePixelRatio` clamp Tier 1 already owes. For Tier 2 the ban is absolute: blur arrives at full value under a fade, as the backdrop rule above already states, and is never tweened. The sanctioned exception is expansion height (5.7), implemented as `grid-template-rows: 0fr → 1fr` on a wrapping grid — the modern technique that confines the layout cost to one subtree instead of measuring content heights in JS (extended, in Part 7b, to `grid-template-columns` for Sidebar collapse — the horizontal sibling, same argument). `will-change` is a scalpel, not a vitamin: applied on interaction start, removed on settle, never left resident — permanent `will-change` promotes layers until the GPU is doing the janking. Tier 1 carries extra discipline because it runs continuously: every looping component gates on an IntersectionObserver and fully suspends offscreen; canvas and WebGL components clamp `devicePixelRatio` at 1.5 (noise and glyphs gain nothing at retina density and pay quadratically for it); pointer-driven components (cursors, Magnet, Spotlight) coalesce pointer events through a single rAF read-write cycle so ten trackers cost one frame's bookkeeping, and hot values bypass React state entirely via the hot/cold split — refs and motion-values on the hot path, props and re-renders only for cold structural changes. The budget is stated as a number the docs repeat: every Tier 2 interaction holds 60fps on a 4× CPU-throttled mid-range device, and that scenario is a CI check (Part 8), not an aspiration.

## 5.10 Choreography

Choreography is ma applied — the design of the gaps between motions — and it is where Kuhaku tokenizes what Apple and Material leave to taste:

| Token | Value | Role |
|---|---|---|
| `--motion-stagger-tight` | 25ms | Items within one small group (menu items, tag rows) |
| `--motion-stagger-default` | 45ms | Cards, list rows, AnimatedList |
| `--motion-stagger-loose` | 80ms | Section-scale reveals, hero sequences |
| `--motion-hold-tight` | 50ms | The micro-scale pause, where a 100ms exit, the hold, and a 150ms entrance must fit 300ms |
| `--motion-hold` | 80ms | The composed pause between an exit and its answering entrance |
| `--motion-delay-hint` | 400ms | Intent-confirmation delay (tooltips, slider value bubbles) |

The stagger values live in the 20–90ms band deliberately: below ~20ms a stagger reads as simultaneous (the interval exists but says nothing), beyond ~100ms items read as separate events (the group dissolves). Within the band, the cascade reads as one object with extent — which is the goal, and which is why stagger *totals* are capped, not just intervals: a stagger sequence completes within `--motion-duration-slower`, so long lists animate their first eight items on the cascade and land the remainder together in the final wave. Twelve hundred milliseconds of cascading list is not composition; it is a queue.

Three orchestration rules complete the system. **One primary motion per event:** every user action gets exactly one motion carrying the causal story; everything else moving at that moment is subordinate — shorter, smaller, sharing the primary's timeline — and at most one spring is visibly settling at a time, because two simultaneous overshoots read as wobble. **Sequence encodes structure:** in any orchestrated entrance, context precedes content (the surface, then its children; the heading, then its body) — jo-ha-kyū at group scale, the container's arrival as jo, the content cascade as ha, the final settle as kyū. **The hold is composed:** when one thing replaces another — page transitions being the canonical case — the old exits swiftly (kyū, ~200ms), the screen holds empty for `--motion-hold`, and the new enters at ease (~400ms). That 80ms of nothing is the system's signature moment: the breath between phrases, the beat of blank stage Zeami would have insisted on. It is, precisely, the emptiness doing the work — kuhaku, rendered in time.

---

# Part 6 — Foundations: Accessibility & Density

## Principle

Accessibility in Kuhaku is not a compliance layer applied after design; it is a consequence of the register. A calm system is one that never makes the user work to perceive it — and contrast, focus clarity, target size, and keyboard reach are exactly that: perceptual generosity, the same generosity the spacing scale spends in pixels. The one tension worth naming honestly is that "quiet" aesthetics are the industry's favorite excuse for gray-on-gray illegibility, and Kuhaku refuses the trade at the root: quietness lives in *chroma and motion restraint*, never in contrast. Stone surfaces, full-contrast ink. The floor is WCAG 2.2 AA, audited per component, and the ceiling — AAA — is one attribute away.

## The AA floor, per primitive type

"Audited per component" means each primitive family carries its own named criteria, verified in the QA pipeline of Part 8, not a single site-wide contrast pass. **Text-bearing primitives** (Text, Heading, all form labels, table cells) hold 4.5:1 minimum; the shipped pairs run 4.7:1 at worst (`muted-foreground` on `muted`) and 12:1+ for body ink. **Interactive controls** hold three simultaneous criteria: 3:1 non-text contrast for their boundaries and state indicators (1.4.11) — carried by `--input` borders and by state *fills*, which is why the checkbox fill and switch track were tuned in Part 2 rather than left to chance; visible focus per the strategy below; and target size per 2.5.8 — every control's hit area meets 24×24px minimum, and the primary controls exceed it comfortably (the density numbers close this section). **Dragging surfaces** (Slider, Carousel, Drawer's handle, SwipeableList, sortable lists later) satisfy 2.5.7: every drag gesture has a single-pointer, non-dragging equivalent — Slider is fully operable by arrow keys and by clicking the track; Carousel pages by button; Drawer closes by button; SwipeableList derives an overflow menu. **Motion-bearing components** satisfy 2.3.3 by the global reduced-motion remap of 5.8 — and because the remap is token-level, this criterion is structurally incapable of per-component drift. **Status primitives** (Toast, Alert, Banner, validation messages) pair every color-coded state with a text or icon channel — color is never the only messenger (1.4.1) — and announce through live regions: `polite` for success and info, `assertive` only for errors that block the user's current task.

## Focus-visible strategy

Kuhaku's focus grammar is single: the `--ring`, a 3px soft ring built in `box-shadow`, outside the border, fading in over 150ms as a chord with the border-color shift (5.6). Policy: focus indication renders on `:focus-visible`, not bare `:focus` — keyboard and assistive-tech focus always shows the ring; pointer clicks do not smear rings across the page. The ring's contrast is audited as a load-bearing indicator: ≥3:1 against the adjacent surface in both modes, which the 60%-alpha stone values of Part 2 clear against `background` and `card`. Two WCAG 2.2 additions are named commitments, not accidents: **2.4.11, focus not obscured** — sticky headers, toast stacks, and the Sidebar are audited so a focused element is never fully hidden beneath fixed chrome; scroll-into-view logic in Command, Select, and menus keeps the focused option inside the visible scroll area. And **focus is never trapped unintentionally**: overlays trap correctly (Dialog, Sheet cycle within themselves and return focus to their trigger on close — Base UI's managed behavior, verified per component), while everything else guarantees escape by Tab alone.

## Keyboard conventions

Kuhaku inherits the WAI-ARIA Authoring Practices patterns through Base UI and treats them as contract: arrow-key navigation with roving tabindex inside composite widgets (menus, radio groups, tabs, listboxes) so each widget costs one Tab stop; `Home`/`End` to boundaries; typeahead in Select, Combobox, Command, and menus; `Escape` dismisses the nearest dismissible surface and only that one; `Enter`/`Space` activate per native-element semantics. Two conventions are Kuhaku's own emphasis: **every keyboard path is motion-complete** — spring-driven indicators follow keyboard focus exactly as they follow pointer selection, because a tab indicator that glides for mouse users and teleports for keyboard users is a two-class interface; and **shortcuts are displayed, not just implemented** — Kbd inside menu items and tooltips, so the keyboard layer is discoverable rather than folklore.

## `data-a11y="strict"` — the AAA mode

Strict mode is one attribute on the root (`<html data-a11y="strict">`), implemented entirely as a token remap — the same architecture as reduced motion, and for the same reason: the whole library complies through one mechanism, and compliance cannot rot per component. It composes three moves.

**Contrast to AAA (7:1).** Only the pairs that sit below 7:1 move; body ink already exceeds it.

| Token | Standard | Strict | Effect |
|---|---|---|---|
| `--muted-foreground` (light) | neutral-500 | oklch(0.40 0.005 95) | 7.2:1 on `background` and `muted` |
| `--muted-foreground` (dark) | neutral-400 | oklch(0.78 0.005 95) | 7.4:1 on dark surfaces |
| `--destructive` (light) | L 0.55 | oklch(0.44 0.19 27) | 7:1-capable as text; fill keeps white fg at 7:1 |
| `--success` / `--warning` text uses | L 0.55 / dark-text | darkened to L ≈ 0.42 / unchanged | status *text* reaches 7:1; chips re-pair automatically |
| `--border`, `--input` | alpha / neutral-300 | one step stronger (neutral-400-light; 24% alpha-dark) | boundaries ≥3:1 without relying on surface shift |
| `--ring` | 60% alpha stone | opaque `--foreground` | maximum-contrast indicator |

Because every component consumes the pairs, not the raw values, chips, banners, and validation states re-derive correct combinations with zero component changes — the dividend of auditing pairs in Part 2. *(Dark-mode status hues at 7:1 for text uses are the flagged open tuning item — Appendix C, work item 1.)*

**Motion to essential-only.** Strict applies the 5.8 reduced-motion remap in full (Tier 1 fades, Tier 2 cut to end-state with the single 100ms overlay fade, micro-interactions instant, kinetic carve-outs in their reduced forms) — but as a *page-level design decision* independent of the user's OS setting, for deployments (public kiosks, clinical software, motion-sensitive audiences) where the operator, not the visitor, owns the guarantee.

**Focus simplified.** The ring swaps its fade and softness for a hard-edged 2px solid outline in opaque `--foreground` at 2px offset, plus the border-color shift — no animation, maximum edge certainty, the double-contrast pattern (dark line, light gap) that survives any background. This is the sanctioned exception to Part 4's one-border-width rule, exactly as reserved there.

Strict mode is additive-safe: it touches tokens only, so it composes with any accent preset, custom theme, or dark mode without coordination.

## Density — airy, in numbers

Density is where this section and the system's name meet, so the numbers are stated as commitments. **Control height:** 40px default (`h-10`) for Button, Input, Select, Combobox triggers — above the ecosystem's 36px reflex, sized so the *visual* control is a comfortable target before any hit-slop; `sm` (32px) and `lg` (48px) variants exist, and `sm` is documented as a dense-context tool, not a style. **Touch targets:** every interactive element guarantees a 44×44px minimum hit area on coarse pointers — where the visual element is smaller (20px checkbox, 16px radio dot, slider thumb), an invisible pseudo-element extends the target; 44px is Apple's floor and WCAG's AAA 2.5.5 value, adopted at AA because shrinking touch targets to the 24px legal minimum saves nothing Kuhaku wants. **Text rhythm:** body 16px at 1.65 leading, UI text 14px at 1.5 — Part 3's values restated here as the density they are; Kuhaku never sets interface text below 12px. **Gap floors:** 8px minimum between adjacent interactive elements (fat-finger separation), 24px default Stack gap, 24px card padding, 96px section rhythm — Part 4's table, functioning here as the density spec. **One density.** Kuhaku ships no system-wide `compact` mode in Phase 1 and no `density` prop, deliberately: a global density switch is a second design system wearing the first one's tokens, and every airy default would need a defended compact twin — the restraint stance says ship one register and mean it. The two legitimate dense contexts are handled locally instead: **DataTable** owns internal row-height options (`default` 52px / `condensed` 40px) because scanning hundreds of rows is a genuinely different task with its own ergonomics, and **`sm` control variants** serve toolbar-class chrome. If real adopter demand for a global compact mode emerges, it becomes a Phase 2+ decision — flagged as the one place this section leaves a door ajar rather than settled.

---

# Part 7a — Components: Actions & Forms

**Ecosystem note (verified at time of writing).** Base UI reached stable v1.0.0 in December 2025 and ships as `@base-ui/react` (subpath imports per component); everywhere earlier planning said `@base-ui-components/react`, read the stable name. Two consequences: Base UI ships no Calendar or date component (only private `temporal` adapters signal one is in progress), so Kuhaku's Calendar owns its date-grid a11y rather than inheriting it; and Base UI's form layer (Field, Fieldset, Form with integrated validation) is a real system Kuhaku adopts as the skeleton of its own Form.

## Disambiguation

**Checkbox vs Switch vs Toggle:** Checkbox is *inclusion* — an item is in a set, commonly many at once, effect deferred until submit; Switch is *activation* — one setting turning on or off with immediate effect; Toggle is *mode* — a pressed/unpressed control that changes the tool in hand (bold, grid-snap), styled as a button because it lives in chrome, not forms. If the state takes effect on submit, Checkbox; on flip, Switch; if it changes what your next action does, Toggle. **Select vs Combobox:** Select is closed-set choice from a short list the user reads; Combobox is choice from a set worth *filtering* — it adds a text input and supports multiple selection with chips. Rule of thumb: under ~10 options, Select; above, or user-typed, Combobox. **Button vs MagneticButton:** Button is the Tier 2 workhorse whose motion confirms input; MagneticButton is a Tier 1 *recipe* (`<Magnet><Button/></Magnet>`) whose cursor-attraction is the point — it belongs on marketing heroes, never in product forms. **Slider vs NumberField vs WheelPicker:** three ways to enter a number — continuous adjustment along a track (Slider), typed-plus-stepped precision (NumberField), and drum selection from a discrete set (WheelPicker). **TagsInput vs Combobox chips:** TagsInput *creates* free-text tokens; Combobox chips *select* from a set.

---

**Button** — the action primitive; every imperative in the interface. Tier 2-micro. Base: `@base-ui/react/button`, a headless primitive that renders a native `<button>`; Kuhaku wraps it like every other Tier 2 control. Composition follows Base UI's render-prop convention (a `render` prop), not Radix's `asChild`, and wrapping inherits `focusableWhenDisabled` - which `state="loading"` needs, so a busy button keeps focus instead of dropping it.

```ts
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  state?: 'idle' | 'loading' | 'success' | 'error';
  focusableWhenDisabled?: boolean;
  render?: (props, state) => ReactElement;
} & ComponentProps<'button'>;
```

Variants map to the token pairs of Part 2 (`primary` = ink; `destructive` re-pairs automatically in strict mode). Motion, per 5.6: press scales to 0.97 in 100ms `ease-out`; release returns on `spring-snappy` (~4% overshoot, settled ≤250ms); hover lifts `translateY(-1px)` with background tint over 150ms; focus ring fades in 150ms as a chord with border shift. The `state` prop *(added on review)* cross-fades the label through the Swap primitive at frozen measured width: `loading` swaps in a Spinner (`aria-busy`, label preserved for AT), `success` draws the check via the checkbox stroke grammar, `error` swaps the error glyph with the 5.6 shake; success/error auto-revert to `idle` after 1.5s. A button that shrinks when busy is layout noise; the frozen width forbids it. Related: Toggle, Swap, Magnet (7f recipe).

**Input** — single-line text entry. Tier 2-micro. Wraps Base UI's Input, which wires itself into Field state automatically.

```ts
type InputProps = {
  size?: 'sm' | 'md' | 'lg';
  prefix?: ReactNode;
  suffix?: ReactNode;
} & ComponentProps<'input'>;
```

No visual variants beyond size — an input's states (focus, invalid, disabled) are its variants, and they arrive via Field context, not props. Motion: the 5.6 focus chord (border-color + 3px ring fade, one 150ms timeline); validation recolor over 200ms. Invalid state renders border in `--destructive` *plus* the Field error message — never color alone (1.4.1). Related: Textarea, Form/Field, Combobox.

**Textarea** — multi-line text entry. Tier 2-micro. A styled native `<textarea>` integrated with Field. Adds one behavior: `autoResize` grows the box with content between `minRows` and `maxRows`, implemented via the measured-replica technique — and deliberately *without* animating the height, since growth tracking the user's own typing is input, not state change; easing it would violate the fidelity law. Motion otherwise identical to Input. Signature: `{ autoResize?: boolean; minRows?: number; maxRows?: number } & ComponentProps<'textarea'>`.

**Checkbox** — set inclusion, with indeterminate for partial trees. Tier 2-micro. Base: `@base-ui/react/checkbox` (plus CheckboxGroup for the grouped form).

```ts
type CheckboxProps = {
  checked?: boolean | 'indeterminate';
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string; value?: string;
} & ComponentProps<'button'>;
```

Motion, per 5.6: fill and border cross over 150ms while the check draws via stroke-dashoffset over 200ms starting at +50ms — one written gesture, ~250ms total; uncheck fades out in 120ms without reverse theater; indeterminate renders its dash with the same draw grammar. The 20px visual box carries a pseudo-element hit area to 44px (Part 6). Label association comes free inside Field; standalone use pairs with Label. Related: Switch, RadioGroup, Toggle.

**RadioGroup** — exclusive choice among visible options. Tier 2-micro. Base: Base UI Radio/RadioGroup; roving tabindex, arrow-key movement, one tab stop per group — inherited, then verified per the Part 8 matrix.

```ts
type RadioGroupProps = {
  value?: string; defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  name?: string;
};
```

Motion: incoming dot scales 0.4 → 1 on `spring-snappy`; the outgoing dot fades to 0.6 scale in 100ms simultaneously — selection *moves*. In keyboard navigation the same spring follows arrow keys (motion-complete keyboard rule, Part 6). Related: Select, ToggleGroup single mode.

**Switch** — a setting with immediate effect. Tier 2-micro. Base: `@base-ui/react/switch`.

```ts
type SwitchProps = {
  checked?: boolean; defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md';
} & ComponentProps<'button'>;
```

The system's flagship micro-interaction, exactly as 5.6 fixes it: thumb travels on `spring-snappy` with its single 4% overshoot; track color completes its 150ms cross-fade as the thumb passes midpoint; held-press stretches the thumb to 108% along the travel axis before release. Because Switch implies immediate effect, the docs require its label to name the *state controlled*, not an action ("Email notifications," not "Enable"). Related: Checkbox, Toggle, ThemeToggle (switch variant).

**Slider** — value selection along a continuum, single or range. Tier 2-micro. Base: Base UI Slider.

```ts
type SliderProps = {
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onValueChange?: (value) => void;   // continuous
  onValueCommit?: (value) => void;   // on release
  min?: number; max?: number; step?: number;
  showValue?: boolean;               // grab tooltip
  orientation?: 'horizontal' | 'vertical';
};
```

Motion: thumb position is 1:1 with the pointer, never eased (fidelity law); thumb scales to 1.15 on grab via `spring-snappy`; the value tooltip appears after the 150ms ma interval, rising 4px as it fades. Keyboard: arrows step, PageUp/Down step ×10, Home/End to bounds — and 2.5.7 is satisfied because the entire interaction has this non-drag path. The two-thumb range form keeps thumbs individually focusable with `aria-valuetext` carrying formatted values. Related: NumberField, Comparison (7d).

**NumberField** *(promoted on review)* — typed-plus-stepped numeric entry: `− [ 42 ] +`. Tier 2-micro. Base: `@base-ui/react/number-field` — spinbutton ARIA, hold-to-repeat steppers, wheel and pointer behaviors inherited. Signature: `{ value?, defaultValue?, onValueChange?, min?, max?, step?, format?: Intl.NumberFormatOptions, size? }`. Motion is pure existing vocabulary: Input's focus chord on the field, Button's press grammar (0.97 dip, `spring-snappy` release) on each stepper, and *no value animation* — typed digits are input under the fidelity law; only Button's `state`-style confirmations would animate, and NumberField has none. Slider's discrete sibling; the form family reads incomplete without it, and the primitive makes it cheap. Related: Slider, Input.

**Toggle** — a pressed-state button; mode, not form data. Tier 2-micro. Base: Base UI Toggle. Signature: `{ pressed?, defaultPressed?, onPressedChange?, size?, variant?: 'default' | 'outline' }`. Motion: the Button press grammar at lower amplitude — 0.97 dip on `spring-snappy`, pressed-state surface/foreground crossing over 150ms. Exposes `aria-pressed`, which is the semantic line between Toggle and Button: if `aria-pressed` doesn't describe it, it's a Button.

**ToggleGroup** — a set of Toggles, `single` (exclusive, deselectable) or `multiple`. Tier 2-micro. Base: Base UI ToggleGroup; one tab stop, arrows within. Signature: `{ type: 'single' | 'multiple', value?, onValueChange?, orientation? }`. Motion is per-item Toggle motion; the group adds none — no sliding indicator, deliberately, which is the boundary against Tabs: ToggleGroup selects *tools*, Tabs selects *views*, and only views get the traveling-indicator continuity grammar.

**Select** — closed-set choice, collapsed until needed. Tier 2-state. Base: Base UI Select. Public shape is compound, per the ecosystem's expectation:

```ts
Select.Root: { value?, defaultValue?, onValueChange?, placeholder?, size? }
Select.Trigger / Select.Value / Select.Content / Select.Item /
Select.Group / Select.Label / Select.Separator
```

Motion: anchored-surface grammar (5.7) — popup enters 150ms `ease-out`, opacity + scale 0.96 from the trigger origin, exits 100ms; the selected item's indicator uses the checkmark draw at reduced duration (150ms). Typeahead, full keyboard listbox pattern, and scroll-into-view of the focused option (2.4.11) come from Base UI and are audit-verified. The trigger is a real button at control height 40px. Related: Combobox, RadioGroup, DropdownMenu (7b — *actions*, not values; the docs draw this line at both).

**Combobox** — filterable choice, single or multiple with chips. Tier 2-state. Base: Base UI Combobox — including its Chips/Chip/ChipRemove parts for multi-select, which is why Kuhaku doesn't hand-build tag-input state.

```ts
Combobox.Root: {
  value?, onValueChange?, multiple?: boolean,
  items?: T[], itemToString?: (item: T) => string,
  filter?: (item: T, query: string) => boolean,
  loading?: boolean, empty?: ReactNode
}
Combobox.Input / Combobox.Content / Combobox.Item / Combobox.Chips
```

Motion: the same anchored-surface grammar as Select — the popup does *not* re-enter on every keystroke; while open, the list updates with no per-item animation (filtering is data, not an event; animating result lists is the canonical Tier-2 overreach and the docs say so). Chips appear/remove with a 120ms fade+scale, no spring — removal is kyū. ARIA combobox pattern (`aria-expanded`, `aria-activedescendant`, live status) inherited and verified. Related: Select, TagsInput, Command (7b: Command is *actions* with combobox mechanics).

**TagsInput** *(added on review)* — free-text token creation. Tier 2-micro. Built on Field + the chip grammar: typing plus Enter (or comma) mints a Chip; Backspace at an empty input focuses, then removes, the last chip; each chip's ✕ and Delete-when-focused follow Chip's 7c spec exactly, so the two feel like one system. Signature: `{ value?: string[], onValueChange?, validate?: (tag) => boolean, max?, placeholder? }`. Motion: chip enter/exit at 120ms fade+scale (Combobox's grammar); invalid tag attempts fire the 5.6 error shake on the field. Distinct from Combobox `multiple` by creation-vs-selection, per the disambiguation. Related: Chip, Combobox, Form/Field.

**Rating** *(added on review)* — bounded scalar preference as icons. Tier 2-micro. Signature: `{ value?, defaultValue?, onValueChange?, max?: 5, allowHalf?, readOnly?, icon? }`. Radio-group semantics under the hood (one tab stop, arrows adjust, `aria-valuetext` "3 of 5"); hover previews fill instantly (state, not transition), selection commits with a single 150ms fill cross and a 0.9 → 1 scale tick on the chosen icon via `spring-snappy` — one confirmation, no cascade of bouncing stars. `readOnly` renders Tier 3 still. Related: RadioGroup, Slider.

**WheelPicker** *(added on review; decided)* — drum selection from a discrete set. Tier 2-micro. Signature: `{ items: { label, value }[], value?, onValueChange?, visibleCount?: 5, loop? }`; composes side-by-side for date/time pickers. Kuhaku's drum, de-platformed: flat surface, no faux-3D bevel chrome — depth by opacity and scale falloff only. Drag tracks 1:1 (fidelity law); release snaps the nearest item on `spring-soft` with velocity carried; wheel steps one. Full keyboard path — arrows step, type-to-jump, Home/End — because drum pickers are notoriously keyboard-hostile and this one is not (`role="listbox"`, `aria-activedescendant`). Reduced motion: instant snaps, static falloff styling. Related: Select, OptionWheel (7f — the display-scale Tier 1 sibling), Slider.

**FileUpload** *(added on review)* — files in, by drop or browse. Tier 2-state. Compound: `FileUpload.Root { accept?, multiple?, maxSize?, maxFiles?, onFilesChange?, disabled? } / Dropzone / Trigger / List / Item { file } / ItemProgress / ItemRemove`. The Dropzone's drag-over state is an instant surface tint plus border shift (state, not transition — a hover grammar); accepted files enter the List with the 120ms chip grammar; per-item Progress uses the Tier 3-kinetic fill; rejection (type/size) fires the error shake with the reason in the Field error slot. A visible Trigger button always accompanies the Dropzone — drag-and-drop is an enhancement, never the only path (2.5.7's spirit for file input). `<input type="file">` underneath carries the real semantics. Related: Progress, Chip, Form/Field.

**Form / Field** — validation-aware structure for everything above. Tier 2-micro (its motion is the validation cross-fade). Base: Base UI Form + Field + Fieldset; Kuhaku adopts the Field model wholesale — controls auto-wire name, describedby, and validity — and skins it:

```ts
Form: { onSubmit?, errors?, onClearErrors? }         // server-error injection
Field.Root: { name: string; validate?: (value) => string | null;
              validationMode?: 'onBlur' | 'onChange' | 'onSubmit' }
Field.Label / Field.Control / Field.Description / Field.Error
```

Motion, per 5.6: state recolor over 200ms; message swap by directional cross-fade (out −2px/100ms, 50ms hold, in +2px/150ms) inside a min-height slot so the form never reflows when it complains; the error shake on rejected submission. Errors bind via `aria-describedby` + `aria-invalid`; the message region is polite, not assertive — the user is already looking at the field. `Fieldset` ships as the grouped form with `legend` semantics. react-hook-form and TanStack Form interop documented as recipes. Related: every control in this part.

**InputOTP** *(added on review)* — one-time-code entry as slots. Tier 2-micro. Base: `@base-ui/react/otp-field` (Base UI OTP Field) - the hidden validation input, `length` clamping, completion detection with `autoSubmit`, and `mask` inherited from the primitive. Signature: `{ length?: 6, value?, onValueChange?, onComplete?, mask?, autoSubmit? }` with `InputOTP.Group / Slot / Separator` parts for visual chunking. Motion: the focus ring *glides* between slots on `spring-soft` as entry advances (continuity — one focus, moving), each digit lands with a 120ms rise-and-settle via the Swap grammar, paste fills all slots with a `--motion-stagger-tight` cascade capped by the 5.10 budget, rejection fires the error shake across the group, and `onComplete` success draws the check. One hidden input carries the real value for AT and password managers; slots are presentational. Related: Input, Form/Field, Swap.

**Label** — accessible naming for controls. Tier 3. Renders Base UI's Field.Label inside Field, a plain `<label htmlFor>` outside. `text-sm`, weight 500, gap `3` (12px) to its control. No motion, no variants; one prop, `required?: boolean`, which renders the marker *and* keeps `aria-required` on the control — the asterisk alone is color-and-symbol, not semantics.

**Calendar** — a date grid to look at and traverse. Tier 3 (a still grid; per the composition doctrine, all surface motion belongs to whatever overlays it). No Base UI primitive: Base UI ships no Calendar (only private `temporal` date adapters), so Kuhaku owns the date grid - grid ARIA, arrow-key day navigation, and PageUp/Down month paging built to the WAI-ARIA grid pattern, not inherited. Shape (prop names finalized at build time): `{ mode?: 'single' | 'range', value?, onValueChange?, min?, max?, disabled?: (date) => boolean, weekStartsOn? }`. Month paging swaps content instantly — no slide; a calendar being consulted should not perform. Day cells are 40px targets; today is marked by shape (ring) plus label, selected by fill.

**DatePicker** — date entry: input + overlay calendar. Composition: **Popover (Tier 2-state) + Calendar (Tier 3) + Input**. It owns no motion of its own — the popover contributes the 150ms anchored-surface enter from the trigger, the calendar sits still inside it. Signature: `{ mode?, value?, onValueChange?, format?: string, min?, max?, presets?: { label, value }[] }` — `presets` renders a quick-pick rail ("Today," "Last 7 days") beside the grid, because ranges are where pickers earn their complexity. Typed input parses against `format` and round-trips with the grid selection; focus returns to the input on close (overlay contract, Part 6). Related: Popover (7b), Calendar, Input, MiniCalendar (7d).

**ColorPicker** *(approved; Wave 2)* — full color selection: 2D saturation/value field, hue and alpha rails, model switching (hex/RGB/OKLCH), eyedropper where the platform API exists. Tier 2-micro. Scheduled in Wave 2 as the single heaviest primitive in the system — specced at build time against this part's grammars (field and rail thumbs under the fidelity law; grab scale via `spring-snappy`; full keyboard operation of both axes; contrast-audited swatch borders). Related: Slider, Input.

---

# Part 7b — Components: Overlays & Navigation

## Disambiguation

Five boundaries govern this category. **Sheet vs Drawer** — a real API distinction, not a synonym pair: Sheet is the *structured side panel*, built on Dialog — modal, focus-trapped, fixed width, for forms and detail views; Drawer is the *gestural edge surface*, built on Base UI's Drawer primitive — drag-to-dismiss, snap points, bottom placement on mobile, velocity-aware. If it needs a drag handle, it's a Drawer; if it needs a form, it's a Sheet. **Command vs CommandPalette** — Command is the filterable action list (input + grouped results + keyboard selection) usable inline anywhere; CommandPalette is the composition Dialog + Command, the ⌘K ceremony. **Breadcrumb vs Steps** — Breadcrumb states *where you are* in a hierarchy (past-tense, freely navigable); Steps states *where you are* in a sequence (future-tense, gated). **Tabs vs AnimatedTabs** — Tabs is the Tier 2 view-switcher whose indicator motion is functional continuity; AnimatedTabs (7f) is a Tier 1 showcase where the indicator treatment *is* the point — product UIs use Tabs, marketing pages may use either, and the docs say exactly that. **DropdownMenu vs Select** — menus execute *actions*, Select captures a *value*; if choosing changes data in a form, it is never a menu.

One family-wide note, per the morph decision: every anchored surface in this part enters by the system grammar — scale from `transform-origin` at the anchor — and the Morph recipe is the documented alternative for marketing surfaces only.

---

**Dialog** — the modal ceremony; focused decisions over dimmed context. Tier 2-state. Base: `@base-ui/react/dialog`. Compound: `Dialog.Root { open?, defaultOpen?, onOpenChange? } / Trigger / Content { size?: 'sm' | 'md' | 'lg' } / Header / Title / Description / Footer / Close`. Motion per 5.7: enter 250ms `ease-out`, scale 0.96 → 1 with fade, backdrop on the same clock; exit 150ms with backdrop trailing 50ms. Focus is trapped, returned to the trigger on close, initial focus lands on the first tabbable (or `initialFocus`); `aria-modal`, labeled by Title, described by Description; Escape closes the topmost layer only. Related: AlertDialog, Sheet, CommandPalette.

**AlertDialog** — Dialog's coercive sibling for destructive or irreversible confirmation. Tier 2-state. Base: Base UI AlertDialog. Same shape minus Close-on-backdrop: clicking outside does *nothing*, Escape cancels, and the confirm action renders `variant="destructive"` with focus defaulting to Cancel — the safe path is the resting path. Motion identical to Dialog; the coercion is behavioral, never animated (no shakes, no pulsing reds — the register holds even when warning). Related: Dialog, Button.

**Sheet** — structured side panel for forms and detail. Tier 2-state. Composition: **Dialog + edge positioning** (it *is* a Dialog with travel). `Sheet.Root { side?: 'right' | 'left', size? } / Trigger / Content / Header / Footer / Close`. Motion: enters translating its full offset at 400ms `ease-out` (`--motion-duration-slow` — large mass, real distance), exits 250ms `ease-in-out`; backdrop per Dialog. All Dialog a11y inherited. Related: Drawer, Dialog, Sidebar.

**Drawer** — the gestural edge surface. Tier 2-state. Base: `@base-ui/react/drawer` — snap points, nested drawers, swipe-dismiss inherited from the primitive, not hand-rolled. `Drawer.Root { side?: 'bottom' | 'right' | 'left', snapPoints?: (number | string)[], activeSnapPoint?, onSnapPointChange?, modal?: boolean } / Trigger / Content / Handle / Close`. Motion: programmatic open/close uses Sheet's travel grammar; *during drag the surface tracks the pointer 1:1* (fidelity law), and release animates to the nearest snap point on `spring-soft` with velocity carried in — a flung drawer keeps its fling. The Handle renders a visible affordance and is a real button (Enter cycles snap points), satisfying 2.5.7 alongside Escape and Close. Reduced motion: drag still tracks (it's input), release snaps instantly. Related: Sheet, Dialog, SwipeableList.

**Popover** — the general anchored surface for arbitrary content. Tier 2-state. Base: Base UI Popover. `Popover.Root { open?, onOpenChange? } / Trigger / Content { side?, align?, sideOffset? } / Arrow? / Close`. Motion: the anchored grammar verbatim — 150ms `ease-out` enter, opacity + scale 0.96 from the anchor-side origin, 100ms exit. Focus moves into the popover only on interactive content; light-dismiss on outside click and Escape; anchor repositioning (flip/shift) comes from the primitive. Popover is the composition substrate — DatePicker, Combobox, and half of 7a stand on it. Related: Tooltip, HoverCard, DropdownMenu.

**Tooltip** — a label's overflow, never a container of actions. Tier 2-state. Base: Base UI Tooltip. `Tooltip.Root { delay? } / Trigger / Content` plus `Tooltip.Provider` for group delay-sharing. Motion: anchored grammar at reduced scale (0.98 — a tooltip barely materializes), with the ma interval: 400ms `--motion-delay-hint` before first open, *instant* reopening while the pointer moves within a provider group, instant exit. Shows on focus as well as hover, dismisses on Escape (WCAG 1.4.13), and never contains interactive content — the docs are blunt that a tooltip with a button inside is a Popover wearing a disguise. Related: HoverCard, Popover, Kbd.

**HoverCard** — rich preview on intent; content, not controls. Tier 2-state. Base: Base UI **PreviewCard** — Kuhaku keeps the ecosystem's name and wraps the primitive; per the never-leak rule the public API says HoverCard everywhere and no PreviewCard type escapes. `HoverCard.Root { openDelay?: 300, closeDelay?: 150 } / Trigger / Content`. Motion: anchored grammar at 150ms with a 4px translate from the anchor side — a peek, directional by nature. Pointer-only affordance with a keyboard story: focus opens it too, and the docs require the trigger link to work *without* the preview. Related: Tooltip, Popover, Glimpse (recipe).

**DropdownMenu** — click-summoned action list. Tier 2-state. Base: Base UI Menu. Compound: `Root / Trigger / Content / Item { disabled?, destructive? } / CheckboxItem / RadioGroup + RadioItem / Sub + SubTrigger + SubContent / Separator / Label / Shortcut`. Motion: anchored grammar; submenus open from their trigger's side at 150ms; highlight moves *without* animation — menu highlight is instantaneous by doctrine, because a gliding highlight in a list you're scanning is lag cosplay (the spring-indicator grammar belongs to Tabs-class persistent indicators, not transient menus). Full APG menu pattern from the primitive: roving tabindex, typeahead, arrow/Enter/Escape, `Shortcut` renders Kbd and the binding is real. Related: ContextMenu, Menubar, Select, Command.

**ContextMenu** — DropdownMenu at the pointer, summoned by right-click or long-press. Tier 2-state. Base: Base UI ContextMenu, sharing Menu's part vocabulary wholesale — same Items, same submenus, same a11y. Motion: anchored grammar with `transform-origin` at the pointer coordinates — provenance from the *gesture*, not from a trigger element. Long-press timing on touch comes from the primitive. The docs require every context-menu action to exist somewhere discoverable too; hidden-only affordances fail the a11y floor. Related: DropdownMenu, SwipeableList.

**Menubar** — the horizontal application menu strip (File, Edit, View). Tier 2-state. Base: Base UI Menubar. `Menubar.Root / Menu / Trigger / Content / …Menu parts`. Motion: first menu opens with the anchored grammar; *sibling traversal while open swaps content instantly* — the APG menubar behavior where hover walks menus without re-ceremony; re-animating each sibling would add 150ms of molasses per menu. Full menubar keyboard pattern (arrows across triggers, down into menus) inherited. Kuhaku positions it honestly: an app-shell component for genuinely menu-driven tools, not marketing chrome. Related: DropdownMenu, NavigationMenu, Dock.

**NavigationMenu** — site-level navigation with rich flyout panels. Tier 2-state. Base: Base UI NavigationMenu. `Root / List / Item / Trigger / Content / Link { active? } / Indicator / Viewport`. Motion: two coordinated systems — the active-link Indicator glides on `spring-soft` (position and width sprung together, the continuity grammar), and the shared Viewport cross-fades content between panels at 200ms while animating its size, so moving across triggers reads as *one surface changing subject* rather than serial popovers. `aria-current` on the active link; full keyboard traversal from the primitive. Related: Tabs, Menubar, Sidebar.

**Command** — filterable action list; combobox mechanics, action semantics. Tier 2-state. Base: built on Base UI **Autocomplete** (input + filtered listbox + `aria-activedescendant`), which is why Kuhaku doesn't hand-roll filtering a11y. `Command.Root { value?, onValueChange?, filter?, loading? } / Input / List / Group { heading } / Item { onSelect, keywords?, disabled? } / Empty / Separator / Shortcut`. Motion: none of its own inline — the list updates instantly on keystroke (filtering is data, not an event; 7a's Combobox rule restated), selection highlight is instant per the menu doctrine. Enter runs `onSelect`; groups are labeled; the empty state is a slot, not a shipped EmptyState. Related: Combobox (values, not actions), CommandPalette.

**CommandPalette** — the ⌘K ceremony. Composition: **Dialog + Command**. `CommandPalette { open?, onOpenChange?, shortcut?: '$mod+k' }` wrapping the two; the shortcut binding ships on by default and is announced in the docs' keyboard table. Motion: Dialog's grammar at Command's 200ms enter (5.7 — a utility summoned by keystroke feels nearer than a ceremony); interior behavior is Command's, untouched. Focus lands in the Input on open, returns to the invoker on close. Related: Dialog, Command.

**Tabs** — persistent view switching within a page. Tier 2-state. Base: Base UI Tabs. `Tabs.Root { value?, defaultValue?, onValueChange?, orientation? } / List / Trigger / Indicator / Panel { keepMounted? }`. Motion: the flagship continuity grammar — the Indicator travels between triggers on `spring-soft`, position and width as one sprung system, following keyboard focus-selection exactly as pointer clicks (motion-complete keyboard rule); panels swap with a 150ms cross-fade, no slide — sliding panels imply spatial order Tabs doesn't promise. Roving tabindex, automatic or manual activation modes, `aria-selected`/`aria-controls` from the primitive. Related: AnimatedTabs (7f), ToggleGroup, NavigationMenu.

**Breadcrumb** — hierarchical you-are-here. Tier 3. No primitive needed: `nav[aria-label="breadcrumb"]` + ordered list + `aria-current="page"` on the leaf. `Breadcrumb.Root / List / Item / Link / Separator { children? } / Ellipsis` — Ellipsis collapses deep paths into a DropdownMenu of the hidden ancestors (composition: Breadcrumb + DropdownMenu). Still by definition; the only motion present belongs to the embedded menu. `text-sm`, `muted-foreground` with the current page in `foreground`. Related: Steps, NavigationMenu.

**Steps** — sequential progress through a gated flow. Tier 2-state (its indicator moves). `Steps.Root { value: number, onValueChange?, orientation?, clickable?: 'completed' | 'all' | 'none' } / Item { title, description? } / Indicator / Separator / Content?`. Motion: advancing animates the connector fill 250ms `ease-out` *then* the next indicator's state change 150ms — sequence encodes structure, the path lights before the destination; completed indicators swap number → check via the Swap primitive. `aria-current="step"`; completed steps are real buttons when `clickable` permits. Related: Breadcrumb, Progress, Pagination.

**Pagination** — page-set navigation. Tier 2-micro. `Pagination.Root { page, pageCount, onPageChange?, siblingCount?: 1 } / Item / Previous / Next / Ellipsis`. Motion per 5.6: the active-page indicator translates between positions over 200ms `ease-in-out` — one indicator moving, continuity, not two states blinking; Previous/Next carry the Button press grammar. `nav` landmark, `aria-current="page"`, disabled boundaries stay rendered (layout stability beats hiding). Related: Steps, DataTable.

**Sidebar** — the app-shell navigation rail. Tier 2-state. No Base UI primitive; Kuhaku-owned with one structural dependency: collapse animates via `grid-template-columns` transition, 250ms `ease-in-out` — the horizontal sibling of the sanctioned grid-rows technique, explicitly extended to it in 5.9. `Sidebar.Provider { collapsed?, defaultCollapsed?, onCollapsedChange? } / Root { side?, collapsible?: 'full' | 'icon' } / Header / Content / Group { label } / Item { icon, active?, badge? } / Footer / Trigger / Rail`. In `icon` mode labels fade out at 100ms *before* width animates and fade in 100ms *after* expansion completes — text never squashes mid-transition. Keyboard shortcut on Trigger (`$mod+b` default), `nav` landmark, active item marked `aria-current`, tooltip-labels on icon-collapsed items (composition: Sidebar + Tooltip). Related: Sheet, NavigationMenu, Dock.

**ThemeToggle** — the mode switch a dark-leaning system owes its users. Tier 2-micro. Composition: **Toggle + Swap**. Writes the `.dark` class, persists choice, respects `system` via `mode?: 'light' | 'dark' | 'system'`. **Appearance variants** *(added on review)*: `variant: 'icon' | 'switch' | 'segmented'` — `icon` (default) is the compact button whose Swap slot cross-fades sun/moon at 150ms with a 90° rotation through the swap; `switch` renders the mode as a literal Switch with sun/moon at the poles for settings rows, using Switch's own spring; `segmented` is the three-state light/system/dark control (a ToggleGroup composition) — the only variant where `system` gets a visible seat rather than living in a cycle, which is why full settings screens want it. One behavior contract under all three; identical motion doctrine. **The full-page reveal ships as `useThemeReveal`** (`registry:hook`, Tier 1): `reveal: 'circle' | 'circle-blur' | 'wipe'` × `origin` with eight positions *including `trigger`* (the circle radiates from the actual click coordinates — provenance-true, and more than the reference implementations offer), built on the View Transition API; ThemeToggle integrates via an `applyMode` function slot, never a motion prop, keeping the Tier 2 contract intact. No View Transition support, or reduced motion → the plain cross-fade: *the fallback of the theatrical version is exactly the product version.* `aria-label` mandatory on the icon form. Related: Toggle, Swap, Switch, PageTransition (7g — same platform machinery at route scale).

**Dock** — persistent quick-launch rail, restrained. Tier 2-state. `Dock.Root { position?: 'bottom' | 'left' | 'right' } / Item { icon, label, active?, onSelect } / Separator`. Motion: the active-item pill glides between items on `spring-soft` (Tabs' continuity grammar rotated 90°); items carry Button press feedback; *no magnification by default* — that lives one composition away in `<Proximity>` around `Dock.Item`s, documented as the Tier 1 recipe with the fence stated (marketing shells yes, product chrome no). Labels surface via Tooltip on hover/focus; `role="toolbar"` with arrow-key roving focus. Related: Menubar, Sidebar, Proximity (7f).

---

# Part 7c — Components: Feedback & Status

## Disambiguation

**Badge vs Chip vs Status:** Badge is a *passive label* — metadata stamped onto something ("New", "v2.1", a count), read-only, never a target. Chip is an *object token* — it represents an entity the user manipulates: removable, selectable, focusable; if it can be clicked, dismissed, or toggled, it is a Chip. Status is a *state indicator* — a dot plus a word describing the condition of a system or entity ("Operational", "Offline"); it names a state, never an object. The test runs in order: interactive → Chip; names a condition → Status; otherwise → Badge. (Aliases resolved on review: **Pill** = Badge's `radius-full` form; **Tag** = Chip. Both resolve in docs search.) **Alert vs Banner vs Toast:** the axis is placement × lifetime. Alert is *inline and persistent* — embedded in the content flow, scoped to the section it sits in, present on load and staying put. Banner is *edge-spanning and session-scoped* — stretched across a page or container, speaking about the whole context, usually dismissible. Toast is *overlaid and transient* — it arrives because something just happened, speaks once, and leaves on its own. If it's about this content, Alert; about this context, Banner; about this moment, Toast.

---

**Alert** — inline contextual callout; information that belongs to the page. Tier 3. No primitive needed. Compound: `Alert.Root { variant?: 'default' | 'info' | 'success' | 'warning' | 'destructive' } / Icon / Title / Description / Action?`. Surfaces render as soft tints — the status hue at low alpha over `card`, with status foregrounds per Part 2's pairing discipline — never solid fills; an Alert is ambient context, not a control. Perfectly still: it does not enter, pulse, or shimmer, and a page that loads with an Alert already present simply *has* one. The a11y note the docs make explicit: statically rendered Alerts carry no live-region role; `role="alert"` is reserved for dynamic insertion, and even then Banner or Toast is usually the honest component. Related: Banner, Toast.

**Banner** — the edge-spanning announcement surface. Tier 2-state. `Banner { variant?, dismissible?: boolean, onDismiss?, sticky?: boolean, icon?, action? }`. Motion: enters and dismisses via the sanctioned grid-rows height technique — 250ms `ease-in-out` in, content fading 50ms behind the expansion; dismissal collapses in 200ms with content fading first, so the page closes ranks rather than jump-cutting (the Toast stack's rank-closing grammar applied to layout flow). `sticky` pins it below the app header. Dismissal is a real Button with an `aria-label`; the dismissed state should persist per deployment (cookie/storage), which the docs demonstrate but the component doesn't own — persistence is app policy, not component state. The Announcement recipe (Badge + text + arrow link) lives on this page as a documented composition. Related: Alert, Toast.

**Toast** — transient event notification; the system's voice for "that worked." Tier 2-state, **Sonner-based**: Kuhaku wraps Sonner's state manager and renderer in system skin rather than rebuilding stacked-toast physics that already exist at reference quality. API: an imperative `toast(message, options)` with `toast.success / error / warning / info / action / promise`, plus one `<Toaster { position?: 'bottom-right', duration?: 5000, visibleToasts?: 3 } />` mounted at the root. Motion, restating 5.7 as contract: enter from the screen edge, translate + fade, 250ms `ease-out`; the existing stack reflows on `spring-soft` as one connected system; dismissal collapses the vacated rank over 200ms; swipe-dismiss exits along the swipe vector with `ease-anticipate`. `toast.promise` morphs status through the Swap grammar — spinner → check-draw or → error shake — Button's `state` prop generalized to notifications. A11y per Part 6: `polite` region for success/info, `assertive` only for blocking errors; timers pause on hover *and* on focus-within; every action inside a toast also exists somewhere persistent, because a control that evaporates in five seconds is not a control. *(Recorded objection, standing: Base UI now ships its own Toast primitive; a Phase 2 re-implementation on it would drop a dependency without changing this public API — first candidate for the Phase 2 in-housing track.)* Related: Banner, Alert, Swap.

**Progress** — determinate or indeterminate task completion. Tier 3-kinetic. Base: Base UI Progress (ARIA plumbing inherited). `Progress { value?: number | null, max?: 100, size?: 'sm' | 'md', label?: string }` — `null` value means indeterminate. Motion is the component's function, per the carve-out: value changes animate the fill via transform scaling over 250ms `ease-out` (a value change is an event; it gets the event grammar — never `width`, per 5.9); indeterminate sweeps a 40%-band on the 1400ms `ease-in-out` loop. `role="progressbar"` with `aria-valuenow` reflecting the *target* value during animation — assistive tech hears truth, not tweened frames; indeterminate omits valuenow and leans on the accessible label. Reduced motion per 5.8: determinate fills snap; indeterminate becomes a static `muted` bar whose label carries "working." Related: Spinner, Skeleton, Steps.

**Skeleton** — content's placeholder silhouette. Tier 3-kinetic. `Skeleton { shape?: 'text' | 'rect' | 'circle', lines?: number, width?, height? }` — `text` with `lines` renders a paragraph ghost with a shortened final line, the one typographic realism that stops skeletons reading as gray bricks. Motion: the 2000ms opacity breath (0.55 ↔ 0.85, `ease-in-out`) — deliberately below attention frequency. The 5.7 handoff rule applies and the docs demonstrate it: when real content arrives, skeleton and content cross-fade over 200ms *in reserved dimensions* — the skeleton's geometry must match the content's, because a loading state that reflows on resolution converts anticipation into punishment. `aria-hidden` always; the loading announcement belongs to the region's `aria-busy`, not the ghost. Reduced motion: pulse stops, static block remains — shape alone says "loading." Related: Spinner, Progress.

**Spinner** — activity without a known endpoint. Tier 3-kinetic. `Spinner { size?: 'sm' | 'md' | 'lg', variant?: 'spinner' | 'dots' | 'bars' | 'dither' | 'ascii', label?: string }` — a curated set of five, each earning its place: `spinner` is the 900ms `linear` arc rotation; `dots` is three dots on a staggered opacity cycle (`--motion-stagger-tight` between them — choreography tokens reused, not reinvented); `bars` is the vertical sibling; `dither` shimmers a small Bayer-matrix cell pattern — the register's raw-computational signature at spinner scale; `ascii` cycles a terminal glyph sequence in `--font-mono`. All render in `currentColor`, so they inherit context. Reduced motion, per variant under 5.8's essential-motion logic: `spinner` slows to 1400ms/rev; `dots`, `bars`, and `ascii` halve their step rate; `dither` goes fully static — it reads as texture either way, so its motion was reinforcement, not message. Visible `label` optional; an sr-only "Loading" ships by default. Related: Progress, Skeleton, Button (`state="loading"` consumes `spinner` at `sm`).

**Status** — a condition, named. Tier 3, with one honest kinetic edge. `Status { tone: 'success' | 'warning' | 'danger' | 'neutral' | 'info', label?: string, pulse?: boolean }` — a dot in the tone's solid hue beside a `text-sm` label. Color never carries the meaning alone (1.4.1): the label, or an sr-only equivalent, is always present. `pulse` is off by default and classified 3-kinetic when on: a 2000ms soft opacity ring for *ongoing live activity* ("Recording", "Live") — the pulse is the message, same argument as indeterminate Progress, and the docs are strict that decorating a static "Operational" with a pulse is a register violation, not an emphasis technique. Reduced motion stills it; the label was always the real signal. Related: Badge, Chip, Progress.

**Badge** — passive metadata, stamped on. Tier 3 with one micro exception. `Badge { variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive', pill?: boolean }` — `pill` is the `radius-full` form (the **Pill** alias resolves here). Never focusable, never clickable; a clickable Badge is a small Button or a Chip, and the docs say which. The exception: `Badge.Count { value: number, max?: 99 }` renders `99+` overflow and, on value *change*, pops via `spring-snappy` (scale 1 → 1.12 → 1) while the digits roll through the Swap grammar — legitimate because a count change is state information arriving (attention, 5.1), not decoration; at rest it is as still as its parent. Related: Chip, Status, AnimatedCounter (7f — display-scale numbers).

**Chip** — an object the user holds. Tier 3 at rest. `Chip { icon?, selected?: boolean, onSelect?, onRemove?, disabled? }` — the **Tag** alias resolves here. Three postures, escalating interactivity: plain (a Badge with substance), selectable (filter chips — `aria-pressed`, toggling with the 150ms surface cross from Toggle's grammar), removable (an embedded ✕ button with its own focus stop and `aria-label`, exit in the 120ms fade + scale from Combobox's chip grammar — removal is kyū, no ceremony). Stillness qualifier stated plainly: Chip's exit is an element *leaving the document*, which is state change, not interaction decoration; at rest and on hover it holds Tier 3 stillness. Keyboard: Delete/Backspace removes when the chip itself is focused, matching TagsInput's grammar so the two feel like one system. Related: Badge, TagsInput, ToggleGroup.

---

# Part 7d-1 — Components: Content & Data (Containers, Disclosure & Data)

## Disambiguation

**Table vs DataTable:** Table is the *presentation* — semantic, styled table parts you compose by hand for content that happens to be tabular; DataTable is the *machine* — Table plus a headless logic core (sorting, filtering, selection, pagination) for data that happens to need an interface. If you're writing `<tr>`s yourself, Table; if you're passing `columns` and `data`, DataTable. **Accordion vs Collapsible:** Accordion is a *set* — siblings with coordinated open state (one-open or many-open policy); Collapsible is a *single* disclosure with no siblings and no policy. An Accordion of one is a Collapsible wearing overhead. **Carousel vs CylinderCarousel vs Marquee:** Carousel is the Tier 2 functional pager — flat, gesture-driven, one-item-at-a-time semantics for product galleries; CylinderCarousel (7g) is the Tier 1 showcase where the 3D drum *is* the point — marketing surfaces only; Marquee (7f) is autonomous drift with no selection semantics at all. If the user chooses a slide, Carousel; if the rotation is the spectacle, CylinderCarousel; if nobody's steering, Marquee.

---

**Card** — the bounded surface; content given a boundary and a name. Tier 3. Compound: `Card.Root { variant?: 'outline' | 'filled' } / Header / Title / Description / Content / Footer / Media`. Renders on `--card` with `--border` hairline and `radius-lg`; default padding is space-6 (24px), the airy calibration Part 4 committed to. `Media` exists so the concentric-radius rule ships as code, not advice — full-bleed media inside the card computes `calc(radius − padding)` per Part 4, flush at zero. And the doctrine's flagship stillness statement, restated where adopters will actually read it: Card has no hover lift, no entrance, no `animated` prop, and the docs link the adopter who wants a floating card to the Tier 1 fence explanation rather than to a workaround. Related: Section, Stat, ImageZoom.

**Separator** — the drawn line between things. Tier 3. Base: Base UI Separator. `Separator { orientation?: 'horizontal' | 'vertical', decorative?: true }` — 1px in `--border` per Part 4's single-width rule. `decorative` (the default) hides it from assistive tech; setting it false emits `role="separator"` with `aria-orientation` for genuinely semantic divisions. The docs restate the spatial priority: reach for gap before Separator — the first separator is always the emptiness. Related: Stack, Cluster.

**AspectRatio** — dimensional promise for media. Tier 3. `AspectRatio { ratio: number }` (e.g. `16 / 9`), implemented on the CSS `aspect-ratio` property with an absolutely-filled child slot. Its one job is layout stability: media that reserves its geometry before loading, which is the same anti-reflow commitment the font-loading strategy made — a system that animates on purpose cannot tolerate layout shift by accident. Related: Skeleton, Card.Media, ImageZoom.

**ScrollArea** — owned scrolling with quiet chrome. Tier 3. Base: Base UI ScrollArea. `ScrollArea.Root { type?: 'hover' | 'scroll' | 'always' | 'auto' } / Viewport / Scrollbar { orientation } / Thumb / Corner`. Native scrolling underneath — wheel, touch, keyboard, and screen-reader behavior are the platform's, untouched; only the scrollbar chrome is owned. The one motion present is the affordance's own state: the overlay thumb fades in over 150ms when scrolling begins or the pointer enters, and out after 800ms idle — scroll-activity indication, governed by the tokens, closer kin to the intrinsic-kinetics family than to interaction decoration. Thumb contrast is audited against 1.4.11 in both modes. Related: Sidebar, Table, TreeView.

**Accordion** — coordinated disclosure set. Tier 2-state. Base: Base UI Accordion. `Accordion.Root { type: 'single' | 'multiple', collapsible?, value?, onValueChange? } / Item { value, disabled? } / Trigger / Content`. Motion is 5.7's expansion grammar verbatim: height via the sanctioned `grid-template-rows` technique, 250ms `ease-in-out` opening with content fading in 50ms behind the edge; 200ms collapsing with content fading first; the chevron rotates 180° on the *same* timeline as the height — one voice, never a chord out of sync. In `single` mode, closing and opening panels run simultaneously rather than sequentially: the set reads as one surface redistributing, not two events queued. Full APG accordion keyboard (arrows between triggers, Home/End) from the primitive. Related: Collapsible, Tabs, TreeView.

**Collapsible** — one region, disclosed. Tier 2-state. Base: Base UI Collapsible. `Collapsible.Root { open?, defaultOpen?, onOpenChange? } / Trigger / Content` — Accordion's grammar at n = 1: same grid-rows expansion, same timings, same trigger `aria-expanded`/`aria-controls` wiring. It exists separately because policy-free disclosure is a real need ("show advanced options") and forcing it through Accordion's set semantics would be API theater. Related: Accordion, Banner.

**Table** — tabular content, dignified. Tier 3. No primitive needed; semantic elements styled: `Table.Root { stickyHeader?: boolean } / Header / Body / Footer / Row { selected? } / Head { align? } / Cell { align?, numeric? } / Caption`. Root wraps an overflow container so wide tables scroll instead of breaking the page. Row height 52px default per Part 6's density spec; header row in `text-sm` 500 on `muted`; row separators are the 1px hairline; `numeric` cells set `tabular-nums` right-aligned — the typographic detail that makes columns of figures scannable. Hover renders an instant `muted` tint — target acquisition feedback as a *state*, not a transition; nothing in a Table animates, including sort reorders in the sibling below. `Caption` is encouraged loudly: an unlabeled table is the most common data-a11y failure shipped. Related: DataTable, ScrollArea, ContributionGraph.

**DataTable** — the data machine. Tier 3. Composition: **Table + TanStack Table** (headless logic as a registry dependency — the one place Kuhaku adds a logic library, argued: table state is a solved, brutally edge-cased problem, and re-deriving column models would be inventory vanity of the exact kind Part 1 forswore) **+ Pagination + Checkbox + DropdownMenu** for its optional organs. `DataTable { columns: ColumnDef[], data: T[], sorting?, onSortingChange?, filtering?, selection?, onSelectionChange?, pagination?, density?: 'default' | 'condensed', empty?: ReactNode }`. Sorting toggles emit `aria-sort` on headers with the direction glyph swapping through Swap at 150ms — the *header* confirms; the *rows* snap instantly, because animating a data reorder implies object permanence a re-query doesn't have, and five hundred rows tweening is dishonest physics. `condensed` (40px rows) is the sanctioned local density from Part 6. Selection column wires Checkbox's indeterminate for the header. `empty` is a slot, per the EmptyState exclusion. Related: Table, Pagination, ScrollArea.

**Carousel** — the functional pager. Tier 2-state. Composition: built on **Embla** (`embla-carousel-react` as the registry dependency — gesture physics, snap mechanics, and momentum are a decade-hardened core; Kuhaku skins and tokenizes rather than re-derives, the same honesty as Sonner). `Carousel.Root { orientation?, loop?, align?: 'start' | 'center', slidesPerView? } / Content / Item / Previous / Next / Indicators`. Motion: drag tracks 1:1 (fidelity law — Embla's native behavior, which is half of why it was chosen); release settles to the snap point on a curve tuned to `ease-in-out` at ~350ms with velocity carried in; Previous/Next page at 300ms; the active indicator dot slides via the 200ms continuity grammar rather than blinking between dots. Keyboard: arrows page when the region is focused; slides are `role="group"` with `aria-roledescription="slide"` and position labels; autoplay is deliberately *absent* — a carousel that moves itself is a Marquee with worse ergonomics, and the docs say exactly that. Reduced motion: settles become instant snaps, drag still tracks. Related: CylinderCarousel (7g), Marquee (7f), Tabs.

**TreeView** — deep hierarchy, navigated. Tier 3, and here the tier assignment needs its argument since expansion *looks* like Accordion's job: TreeView discloses **instantly**, no height animation, no chevron transition. The reasoning is density × frequency — a tree is scanned and worked (file explorers, org structures, nested settings), expansions fire dozens of times a minute across hundreds of nodes, and 250ms of ceremony per disclosure converts a navigation instrument into molasses; the rotated chevron and the appeared children *are* the state signal, at the speed thought moves. `TreeView.Root { items: TreeItem[], expanded?, onExpandedChange?, selected?, onSelectedChange?, multiSelect? } / Item { icon?, label, children? }` (data-driven, with a render-prop escape for custom rows). Full APG tree pattern: `role="tree"`/`treeitem`/`group`, `aria-expanded`, arrow-key semantics (right expands or descends, left collapses or ascends), Home/End, typeahead. Related: Accordion, Sidebar, ScrollArea.

**Timeline** — sequence rendered as structure. Tier 3. `Timeline.Root { orientation?: 'vertical' } / Item { active? } / Indicator { icon? } / Connector / Time / Title / Description`. A still spine: dots in `--border`-ringed `card`, the active item's indicator in `--primary`, connectors as 1px hairlines; `Time` sets `text-xs muted tabular-nums`. The semantic skeleton is an ordered list — sequence is the content, and `<ol>` says so to machines. It does not animate on scroll; the docs show the ScrollReveal composition for marketing timelines and name the fence in the same breath. Related: Steps (interactive progress vs. displayed history — Steps gates, Timeline records), ContributionGraph.

**Stat** — one number, dignified. Tier 3. `Stat.Root / Label / Value { format? } / Delta { trend: 'up' | 'down' | 'flat' } / Caption`. Value sets `text-3xl` 600 `tabular-nums`; Delta pairs its color with a direction glyph so the trend never rides on hue alone (1.4.1), and inverts sensibly via a `positive?: 'up' | 'down'` flag for metrics where down is good. Still by contract — the number does not count up; the docs show `<Stat.Value><AnimatedCounter /></Stat.Value>` as the marketing composition and, once more, name the fence. Related: Badge, AnimatedCounter (7f), Card.

---

# Part 7d-2 — Components: Content & Data (Media, Code, Identity & Dates)

## Disambiguation

**Code vs CodeBlock vs Snippet vs Kbd** — four glyph-chips, one axis each: Code is *inline* — a token inside a sentence; CodeBlock is *multi-line* — highlighted source with chrome (filename, line numbers, copy); Snippet is *one runnable line* — a command with a prompt glyph and a copy button, built to be pasted into a terminal; Kbd is *keys the user presses* — never code at all. If it's in prose, Code; if it scrolls, CodeBlock; if it starts with `$`, Snippet; if it's on the keyboard, Kbd. **Calendar vs MiniCalendar:** Calendar is the month grid for choosing *any* date; MiniCalendar is a horizontal strip of the *near-term* — five-or-so days around now, for scheduling flows where next Tuesday matters and next March doesn't. **ImageZoom vs the Morph recipe:** the same idea at two registers, cross-linked in both directions — ImageZoom is the quiet Tier 2 product behavior (thumbnail opens to a fitted overlay along the provenance grammar); Morph is the theatrical Tier 1 marketing version. Product UIs get the component; landing pages may take the recipe.

---

**Avatar** — a person or entity, pictured with a guaranteed fallback. Tier 3. Base: Base UI Avatar (image-load state machine inherited). `Avatar { src?, alt, fallback?: string, size?: 'sm' | 'md' | 'lg' | 'xl', shape?: 'circle' | 'square' }` — fallback renders initials on a muted surface; a `delay` (300ms default) prevents fallback flashing on fast connections. The one permitted transition is the loading handoff: image cross-fades over its fallback in 150ms when it arrives — the Skeleton→content grammar at portrait scale, arrival information rather than decoration. `alt` is required by type; decorative-only avatars pass `alt=""` explicitly rather than omitting the decision. Related: AvatarGroup, Badge (status-dot composition documented).

**AvatarGroup** — the many, overlapped. Tier 3 at rest, with one approved functional exception. `AvatarGroup { max?: 4, size?, overlap?: 'tight' | 'default', total?: number }` — children beyond `max` collapse into a `+N` chip (rendered from `total` when the full set isn't mounted); overlapped avatars carry a 2px `--background` ring so edges read against each other. **`AvatarGroup.Expand`** *(added on review)* is the Tier 2-state reveal: hover or focus-within spreads the overlap to full spacing over 200ms `ease-out`, collapsing on leave — a disclosure of *identity information* (who is actually in this group), which is why it passed the 5.1 test the decorative lift failed. The `+N` chip can be a real button; the docs show the Popover composition listing the remainder. The Proximity lift composition is documented on this page with the Tier 1 fence stated beside it. Related: Avatar, Proximity (7f), Tooltip.

**ImageZoom** — a thumbnail's promise, kept. Tier 2-state. Composition: **Dialog (modal layer) + FLIP scale transition** via motion. `ImageZoom { src, alt, zoomSrc?, children? }` — the thumbnail renders as a real button; activation measures its rect and animates the image from that geometry to viewport-fitted over 250ms `ease-in-out` (a visible object traveling — the 5.3 travel curve, not the entrance curve), backdrop fading on the same clock; dismissal returns along the same path at 150ms, backdrop trailing. `zoomSrc` swaps in the high-resolution asset once the transition settles, never during it. Escape, backdrop click, and focus return are Dialog's inheritance; `alt` is required and carries into the zoomed state. Reduced motion: cross-fade in place, geometry uninterpolated. Related: Dialog, AspectRatio, Morph (recipe), Carousel.

**Comparison** — before and after, one boundary, user-held. Tier 2-micro. `Comparison { itemOne: ReactNode, itemTwo: ReactNode, value?, defaultValue?: 50, onValueChange?, orientation?: 'horizontal', labels?: [string, string] }` — two stacked layers, the top clipped at the handle position via `clip-path`. Motion is Slider's doctrine transplanted: the handle tracks the pointer 1:1, never eased (fidelity law — the clip is *input*, and smoothing it is lag with manners); the handle scales to 1.15 on grab via `spring-snappy`; releasing leaves it exactly where the hand left it, no snap-to-center paternalism. Keyboard: `role="slider"` with `aria-valuenow` as a percentage, arrows step 1, PageUp/Down step 10, Home/End to the poles — 2.5.7 satisfied; `labels` feed `aria-valuetext` ("62% — after") so the boundary means something audibly. Related: Slider, ImageZoom, AspectRatio.

**Code** — a token of code inside a sentence. Tier 3. `Code { children }` — Part 3's inline spec as a component: `0.875em` relative sizing, `--font-mono`, `muted` tint, `radius-sm`, 2px inline padding; a chip, not a highlight, with no syntax coloring — inline fragments are *named*, not read, and coloring three words mid-sentence is noise. Renders `<code>` semantics. Related: CodeBlock, Kbd, Prose (7e — which styles raw markdown `code` to match).

**Kbd** — keys the user presses. Tier 3. `Kbd { children } / Kbd.Group { keys: string[] }` — Part 3's chip verbatim: `text-xs` 500, bordered with the bottom-heavy edge (the one sanctioned skeuomorphic pixel), `radius-sm`. `Kbd.Group` renders sequences with `+` separators and resolves the `$mod` token per platform — ⌘ on Apple, Ctrl elsewhere — so shortcut documentation is written once; the same resolver serves DropdownMenu.Shortcut and CommandPalette, one keyboard-display grammar system-wide. An `aria-label` spells the sequence ("Command K") because glyphs alone read badly in a screen reader. Related: DropdownMenu.Shortcut, Tooltip, Snippet.

**Quote** — words given to someone else, set apart. Tier 3. `Quote.Root { size?: 'default' | 'lg' } / Content / Attribution { name, role? }`. Semantics first: `<blockquote>` inside a `<figure>`/`<figcaption>` pair. Typography does all the separating — `text-lg` (or `text-2xl` for `lg`) at 400 with generous leading, attribution in `text-sm` `muted-foreground` prefixed by an em-dash — no left border, no giant decorative quotation mark, no italics-by-default; per Part 4's thesis, the first separator is the emptiness, and a quote earns its distinction through scale and air. Related: Prose, Text (7e).

**CodeBlock** — source code with chrome. Tier 3. Composition: **Shiki** as the highlighting engine (registry dependency; server/build-time rendering preferred, with the lighter client path documented) — the same buy-don't-rebuild honesty as Sonner and Embla: a regex highlighter would be worse at the one thing this component is for. `CodeBlock { code, language, filename?, showLineNumbers?, highlightLines?: number[], wrap?, maxHeight? } / CopyButton`. Shiki's theme maps to Kuhaku's code-token CSS variables so both modes ship from one config; blocks render on `card` with `--border` per Part 3; overflow wraps in ScrollArea (composition named); `highlightLines` tints via the `muted` wash. The CopyButton is a real Button whose icon confirms through Swap — copy → check, reverting after 1.5s — the 5.6 grammar, carried by an embedded Tier 2 control rather than an exception to Tier 3. A11y: `role="region"` labeled by filename-or-language; the scrollable `<pre>` is focusable so keyboard users can scroll it (2.1.1 applied to overflow, the audit item most code blocks fail). Related: Code, Snippet, ScrollArea.

**Snippet** — one command, built to be stolen. Tier 3. `Snippet { command: string | string[], prompt?: '$', label? }` — mono line(s) on `card`, the prompt glyph rendered as non-selectable decoration and *excluded from the copied payload* (the detail that separates a Snippet from a styled div: what lands in the clipboard is exactly what runs). Multi-command arrays render stacked with one CopyButton copying the newline-joined whole. Same Swap-confirming CopyButton as CodeBlock; same region labeling. The docs draw the promotion line: syntax coloring, filenames, or line counts mean you wanted CodeBlock. Related: CodeBlock, Kbd, Code.

**ContributionGraph** — a year of activity as a quiet field of cells. Tier 3. `ContributionGraph { data: { date: string, value: number }[], weeks?: 52, levels?: 5, startOfWeek?, labels?: boolean, interactive?: boolean, renderCell? }` — the density heatmap, colored by a five-step alpha ramp of `--primary` (which means every accent preset re-skins it for free, the Part 2 dividend), month and weekday labels in `text-xs muted`. Still by contract: no cascade-in of cells, ever — 364 tiny entrances is the choreography rule's canonical violation. A11y is the real work here: the grid carries an `aria-label` summary ("1,204 contributions in the last year"); with `interactive`, cells become a roving-tabindex grid with arrow navigation and per-cell Tooltip (composition named) carrying date and value — so hue is never the only channel (1.4.1) and the data is reachable without a pointer. Related: Table, Timeline, Tooltip.

**MiniCalendar** — the near-term, as a strip. Tier 3. `MiniCalendar { value?, onValueChange?, days?: 5, startDate?, min?, max? } / MiniCalendar.Days / MiniCalendar.Day` — a horizontal row of day cells (weekday over date-number), flanked by Previous/Next paging the window by its own width. Paging swaps content instantly, inheriting Calendar's no-slide rule and its reasoning: a date surface being consulted should not perform. Cells are 40px+ targets styled by Calendar's selected/today grammar (fill for selected, ring-plus-label for today); each carries the full date as its accessible name ("Tuesday, July 28"). Selection semantics match Calendar's so DatePicker-adjacent flows can swap surfaces without relearning. Related: Calendar (7a), DatePicker, Steps.

**SwipeableList** *(Wave 2)* — actions hidden under the row, revealed by the hand. Tier 2-micro; specced now so the wave has a contract to build against. `SwipeableList.Root / Item { onSwipeCommit? } / Actions { side: 'leading' | 'trailing' } / Action { tone?: 'default' | 'destructive', icon, label, onAction }`. Motion: the row tracks the pointer 1:1 (fidelity law) with rubber-band resistance past the action rail's width; release inside the threshold snaps the rail open on `spring-soft`; a full swipe past 60% commits the rail's primary action, with the row exiting along the swipe vector via `ease-anticipate` — Toast's dismissal grammar, because it is the same gesture meaning the same thing. The 2.5.7 mandate is structural: every Item auto-derives an overflow DropdownMenu of its actions (composition named), reachable by keyboard and long-press, so nothing exists only under a swipe; destructive full-swipe commits are opt-in per action, never default. Reduced motion: rails snap open and closed instantly; drag still tracks. Related: DropdownMenu, Drawer, Toast.

---

# Part 7e — Components: Layout & Typography

## Disambiguation

**Stack vs Cluster vs Grid** — one question each, in order: does it flow vertically (Stack), does it flow horizontally *and wrap* (Cluster), or are the items peers in two dimensions (Grid)? If you're reaching for Stack with a direction prop, you want Cluster; if you're reaching for Cluster with fixed columns, you want Grid. **Heading vs Text** — Heading is document *structure* (it renders `h1`–`h6` and participates in the outline); Text is *content* (it renders paragraphs and spans). If removing it would change the document outline, it was a Heading. **Swap vs AnimatedText** — both change text, at opposite registers: Swap is the functional cross-swap of content that *means something changed* (an icon confirming copy, a count updating, a label switching) — Tier 2, fixed grammar; AnimatedText (7f) is text *performing* — Tier 1, tunable, marketing-fenced. If the change carries state, Swap; if the change is the show, AnimatedText.

One contract note for the whole part, resolving how layout props meet the styling layer: every spacing-bearing prop (`gap`, padding variants) is typed to the **nine sanctioned steps of Part 4** — a closed union, not `number` — which is what lets the Tailwind-utility implementation compile statically (a finite prop set maps to a finite class set; no runtime style generation, no safelist sprawl). Responsive variation is deliberately *not* re-invented as prop syntax: the primitives encode spatial semantics, Tailwind already owns media queries, and `className` passthrough composes the two. Building a breakpoint-object prop API would be rebuilding Tailwind's responsive engine inside every component — plumbing Kuhaku exists to remove, not relocate. All five layout primitives accept Base UI's `render` prop convention for semantic element substitution.

---

**Stack** — the vertical axis, owned. Tier 3. `Stack { gap?: Space = 6, align?: 'start' | 'center' | 'end' | 'stretch', render? }` — a flex column whose gap is a relationship statement per Part 4's table; the default `6` (24px) is "adjacent blocks," and nesting Stacks of different gaps *is* the visual hierarchy, rendered. No `direction` prop, by the argument already made: vertical grouping doesn't wrap, horizontal grouping does, and one component pretending to be both papers over the only behavioral difference. `render` swaps the element for `ul`, `section`, `form` as semantics demand. Still by definition — a layout primitive that animated would be animating *other components' positions*, which is choreography's job (5.10), never layout's. Related: Cluster, Grid, Section.

**Cluster** — the horizontal axis, wrapping gracefully. Tier 3. `Cluster { gap?: Space = 2, align?: 'center', justify?: 'start' | 'center' | 'end' | 'between', render? }` — tag rows, button groups, metadata runs; anything that flows inline and must break lines without breaking rhythm. The default gap `2` (8px) is Part 6's fat-finger floor and Part 4's "bound" step at once — the tightest spacing shipped between interactive siblings. Alignment defaults to `center` because mixed-height inline content (icon beside text beside badge) reads baseline-chaotic under `start`. Related: Stack, Grid, TagsInput.

**Grid** — two-dimensional peerage. Tier 3. `Grid { columns?: number | { min: string }, gap?: Space = 6, render? }` — fixed counts for known layouts, `{ min: '16rem' }` compiling to `repeat(auto-fit, minmax(16rem, 1fr))` for the content-declares-its-width behavior Part 4 argued: the viewport decides the count, no breakpoint bookkeeping, which is the correct default posture for a system that wants layout decisions argued once. Items are equals; anything with a hero cell or spanning logic is bespoke CSS Grid the docs happily show outside the component — Grid covers the peer case *completely* rather than all cases badly. Related: Stack, Container, Card.

**Container** — horizontal bounds; the margin made deliberate. Tier 3. `Container { size?: 'sm' | 'md' | 'lg' | 'xl' | 'prose' = 'xl', render? }` — max-widths 40 / 48 / 64 / 80rem, centered, with symmetric inline padding of space-4 that steps to space-6 at wider viewports (the one baked-in responsive behavior, because edge-padding is the container's *job*, not a customization). `prose` locks to the 65ch measure plus padding so page chrome and text column align down the page — the Part 3 measure and the Part 4 margin agreeing in public. Related: Section, Prose, Grid.

**Section** — vertical bounds; the rhythm made default. Tier 3. `Section { size?: 'sm' | 'md' | 'lg' = 'md', render? }` — padding-block 64 / 96 / 128px, rendering `<section>` by default. Part 4 called the 96px default the single number that most makes a Kuhaku page look like a Kuhaku page; the API's job is to make that number something adopters *inherit* rather than remember, and to make deviation legible (`size="sm"` in a diff is a decision on the record; an ad-hoc `py-12` is drift). Container and Section compose in either nesting order; the docs standardize Section-outside (full-bleed backgrounds want the Section's width). Related: Container, Stack, Shader (7g — the ambient-background composition, fence stated).

**Heading** — document structure, sized independently. Tier 3. `Heading { as?: 'h1'…'h6' = 'h2', size?: TypeStep, display?: boolean, weight?: 400 | 500 | 600 | 700, balance?: boolean = true, render? }` — the Part 3 mapping supplies defaults per level; `size` decouples visual scale from outline level (the anti-level-skipping argument, honored in API); `display` unlocks the fluid `--text-display` token at its default weight 700, with 500/600 available for editorial moments and the 700-below-5xl prohibition enforced in types, not prose. `balance` applies `text-wrap: balance` — a free progressive enhancement that ends the two-word orphan line, on by default because a system this invested in spatial composition shouldn't ship ragged headline blocks. Related: Text, Prose, AnimatedText (7f — the fence, again).

**Text** — body content, in three sizes and two weights. Tier 3. `Text { size?: 'sm' | 'base' | 'lg' = 'base', weight?: 400 | 500, muted?: boolean, render? }` — renders `<p>`, swaps to `span`/`div` via `render`. `muted` maps to `--muted-foreground`, which means it stays audited under strict mode for free — the token-pair dividend paying out at the API layer. Per the locked note, **Lead and Muted are recipes, not components**: Lead is `<Text size="lg" muted>` with 500 weight documented in Recipes; shipping them as components would spend API surface to save a props line. Related: Heading, Prose, Quote.

**Prose** — long-form rhythm, pre-composed. Tier 3. `Prose { size?: 'base' | 'lg', render? }` — the wrapper for markdown-derived and article content: measure locked to 65ch; paragraph spacing of one leading unit; heading top-margins of two; list, blockquote, `code`, and `pre` styling matched to Code, Quote, and CodeBlock's *surfaces* (static — Prose styles raw output; interactive chrome like copy buttons belongs to the real components). Prose exists because hand-spacing every element of an article is exactly the improvisation Part 4 prosecuted at layout scale; here the improvisation is typographic, and the fix is the same — correct rhythm by wrapping, not by remembering. Elements inside Prose that Kuhaku ships as components (CodeBlock in MDX, say) opt out of Prose's styling automatically via data-attribute, so the two systems never double-style. Related: Text, Heading, Container (`prose` size), CodeBlock.

**Swap** — the content cross-swap slot; change, made visible. Tier 2-micro, and the part's one moving piece — the primitive that Button's `state`, ThemeToggle's icon, CodeBlock's copy-confirm, Badge.Count's digits, Steps' number→check, and DataTable's sort glyph all consume, so the system confirms change in *one voice* everywhere. `Swap { value: string | number, children, inline?: boolean }` — `value` is the identity key; when it changes, the outgoing child exits over 100ms (fade + scale to 0.94) and the incoming enters over 150ms after a 50ms interval, `--motion-hold-tight` (fade + scale from 1.04 settling on `spring-snappy`'s curve character), ≤300ms total, per the 5.6 law. Numeric values auto-derive vertical roll direction from comparison — counts going up enter from below — which is *semantic* derivation, not a motion prop; Swap exposes **no** timing, easing, or direction configuration, the Tier 2 contract in its purest form. Sizing is honest per 5.9: the container adopts the incoming child's size instantly (no width/height animation), and the docs teach the reservation patterns — `tabular-nums` for digits, measured min-width for label pairs — that make swaps jitter-free, Button's frozen-width trick generalized. Presentation-only for a11y: Swap announces nothing; the *context* speaks (`aria-busy` on Button, `aria-live` regions where the change is news), because a transition narrating itself would double-announce every state in the system. Reduced motion: instant replacement. Related: Button, ThemeToggle, Badge.Count, AnimatedCounter (7f — where numbers perform instead of report).

---

# Part 7f — Tier 1 Showcase: Typography & Interaction

## The Tier 1 contract, restated once for both showcase parts

Everything in 7f and 7g shares one constitution, stated here so the individual specs don't repeat it. Motion is identity: there is no `animated` prop, no off switch, and the API surface *is* the tuning surface — `duration`, `delay`, `ease`, `stagger`, `direction`, and per-component character props, the one tier where per-instance motion configuration is the contract rather than a violation of it. Shared tuning accepts token references by default (`ease` resolves `--motion-ease-*` names or a bezier array; durations default from the token table). Every component lives behind the fence — behind and around content, on marketing and editorial surfaces, never on functional product chrome — and every component carries the performance constitution: IntersectionObserver suspension offscreen, hot/cold prop split (continuous values on refs and motion-values, never React state), compositor-only properties - with 5.9's carve-out that a blur which *is* the effect may animate `filter`, behind the fence and never on a functional surface - and the 5.8 reduced-motion behavior per family — mount animations become a 200ms fade, loops hold a designed still frame, pointer-reactive components go inert. A11y baseline for the typographic components: the *real text* is always present for assistive tech immediately and completely — animation plays on presentation clones marked `aria-hidden`, so a screen reader never hears a headline arrive one letter at a time.

## Disambiguation

**AnimatedText vs TextLoop vs OptionWheel:** AnimatedText performs *one* string, once — reveal, scramble, or typewriter — then rests; TextLoop cycles *many* strings forever on a timer, no user input; OptionWheel is *user-driven selection* among strings — the only one of the three with a `value`. One string → AnimatedText; a rotation → TextLoop; a choice → OptionWheel. **Tabs vs AnimatedTabs:** Tabs (7b) is the Tier 2 view-switcher whose indicator motion is functional continuity, tokenized and fixed; AnimatedTabs is the Tier 1 sibling where the indicator treatment is the *spectacle* — tunable, moddable, fenced. Product UIs always take Tabs; marketing pages may take either, and the docs put this sentence on both pages. **AnimatedCounter vs Swap/Badge.Count:** Swap and Badge.Count *report* a change that happened (fixed grammar, ≤300ms, Tier 2); AnimatedCounter *performs* a number for effect (tunable, seconds-long, Tier 1). Reporting vs theater. **Magnet vs Proximity:** Magnet translates one element toward the pointer — attraction; Proximity scales many children by their distance to it — a field.

---

**AnimatedText** — one string, performed once. Tier 1. `AnimatedText { children: string, mode?: 'reveal' | 'scramble' | 'typewriter', by?: 'char' | 'word' | 'line', trigger?: 'inView' | 'mount' | 'manual', once?: true, stagger?, duration?, delay?, ease? }` plus an imperative ref (`play`, `reset`) for `manual`. `reveal` raises units from `opacity 0, y 0.4em` with blur resolving, cascading at `stagger` (default `--motion-stagger-tight` for chars, `-default` for words); `scramble` cycles random glyphs per character before settling each in sequence — **GlitchText resolves here as a docs alias**; `typewriter` appends characters at a cadence with the caret as an opt-in part. Line-splitting measures at mount and re-splits on resize. The 5.10 cap applies: cascades complete within `--motion-duration-slower`, long strings landing their tail together. Reduced motion: full text appears in a single 200ms fade. Related: TextLoop, TextHover, GlyphField (7g).

**TextHover** — glyphs answering the pointer. Tier 1. `TextHover { children: string, mode?: 'slide' | 'lift' | 'weight' | 'blur', stagger?, duration?, ease? }`. `slide` is the classic double-deck link — an `aria-hidden` duplicate slides in as the original slides out, per-glyph, staggered ripple from the pointer's entry side; `lift` raises characters 0.15em; `weight` animates the variable-font `wght` axis 400 → 600 (the one place Kuhaku animates a font axis, and only because Geist ships variable — the docs note the fallback is `lift` on static fonts); `blur` resolves neighbors as the pointer crosses. Hover-only affordances get a keyboard truth: `:focus-visible` applies the full end-state instantly, no per-glyph theater, so the effect acknowledges focus without performing at it. Touch: inert. Reduced motion: inert. Related: AnimatedText, Magnet, TextLoop.

**TextLoop** — many strings, rotating forever. Tier 1. `TextLoop { items: string[], interval?: 2400, transition?: 'slide' | 'blur' | 'flip', duration?, ease?, pauseOnHover?: true }`. The grammar: outgoing exits upward through the clipping mask over ~400ms, a composed pause of `--motion-hold` sits in the gap (ma, tokenized), and the incoming rises from below settling on the entrance curve; the container animates width between items of different lengths at 200ms so surrounding copy never jumps. A11y is the honest problem here and the spec answers it: the rotating region is `aria-hidden`; an sr-only static rendering carries the full list of items, because a `polite` region firing every 2.4 seconds is a screen-reader denial-of-service. Reduced motion: holds the first item, static. Related: AnimatedText, OptionWheel, Swap (7e — the functional cousin).

**OptionWheel** — the typographic drum selector. Tier 1. `OptionWheel { items: { label, value }[], value?, defaultValue?, onValueChange?, side?: 'left' | 'right', fontSize?: '3rem', spacing?: 1.4, curve?, tilt?: 6, blur?: 2, fade?, inset?: 80, smoothing?, loop?, draggable?: true }`. Options stack along a vertical arc anchored to an edge, the active item sharp and full-contrast at the anchor point, neighbors falling away with progressive scale-down, blur, fade, and slight tilt. Drag rotates 1:1 (fidelity law); release snaps the nearest option on `spring-soft` scaled by `smoothing`; wheel steps one; **any item is a tap target that rotates itself into the active slot** and fires `onValueChange`. Depth is subtractive styling per position — scale-down, blur, fade, tilt — which is why reduced motion keeps the look and drops only the glide: instant snaps, static depth. Full listbox keyboard grammar (focusable, `aria-activedescendant`, arrows, Home/End, typeahead) satisfies 2.5.7 and makes it the showcase component that is genuinely operable. **Silent in v1** — the reference implementation's tick sounds are deliberately excluded; audio arrives, if ever, as the Sound recipe (Appendix C). Related: WheelPicker (7a — the form-control sibling), CylinderCarousel (7g), TextLoop.

**AnimatedCounter** — a number, performed. Tier 1. `AnimatedCounter { value: number, from?, mode?: 'count' | 'reel' | 'flip', duration?: 1200, ease?, format?: Intl.NumberFormatOptions, trigger?: 'inView' | 'mount' | 'manual', once?: true }`. `count` tweens the value on `ease-out` — fast through the small numbers, savoring the approach, jo-ha-kyū in arithmetic; `reel` rolls each digit column independently like a mechanical odometer, columns settling right-to-left; `flip` is the split-flap board at restrained amplitude. `tabular-nums` is forced, not optional — a counter that jitters its own width is measuring nothing. A11y: the live digits are `aria-hidden`; the element's accessible name is the *final* formatted value from frame one, updated only on completion — AT hears the truth, sighted users see the theater. Reduced motion: final value, single fade. Related: Stat (7d-1 — the still frame it performs inside), Badge.Count, Swap.

**Marquee** — autonomous drift. Tier 1. `Marquee { speed?: 40, direction?: 'left' | 'right' | 'up' | 'down', gap?: Space = 6, pauseOnHover?: true, fade?: true, paused? }`. Content is measured and duplicated internally until the track fills twice over (duplicates `aria-hidden`), translating at constant velocity — and here the linear sanction of 5.3/5.5 is explicitly extended from rotation loops to *constant-velocity loops*: drift with easing is a conveyor that stutters, the same bent-wheel argument at a different geometry. `fade` masks the edges with gradient so entries materialize rather than pop. WCAG 2.2.2 is answered structurally: `pauseOnHover` defaults on, `paused` is controlled, focus-within pauses, and the docs require a visible pause affordance whenever marquee content is informative rather than decorative. Reduced motion: a static, designed row — the first viewport-width of content, no crawl. Related: Carousel (7d-1 — someone's steering), Orbit (7g), TextLoop.

**AnimatedList** — the stagger, productized. Tier 1. `AnimatedList { children, preset?: 'fade-up' | 'fade' | 'scale', stagger?: 45, trigger?: 'inView' | 'mount', once?: true, duration?, ease?, render? }`. Children cascade in at `stagger` (defaulting to `--motion-stagger-default`), each entering per the preset on the entrance curve; the 5.10 total-cap rule is enforced in code — the cascade budget is `--motion-duration-slower`, the first ~eight items stagger individually and the remainder land in the final wave, because twelve hundred milliseconds of queue is not composition. Renders a real `ul`/`ol` via `render`, items are real `li`s; nothing about entrance choreography may cost list semantics. Reduced motion: the whole list in one 200ms fade. Related: ScrollReveal (7g — arbitrary children, scroll-tied), Stack, Toast's stack (the Tier 2 cousin).

**AnimatedTabs** — the indicator as spectacle. Tier 1. Composition: **Base UI Tabs underneath** — full roving-tabindex, activation modes, and panel wiring inherited, because a showcase component with broken keyboard tabs would be Kuhaku failing its own floor — with the presentation layer wide open. `AnimatedTabs { …Tabs.Root props, indicator?: 'pill' | 'underline' | 'glow', transition?: { stiffness?, damping? } | 'snappy' | 'soft', blurPanels?: boolean }`. `pill` is the shared-layout capsule gliding *behind* labels with a touch more overshoot than product Tabs would ever permit; `underline` runs the hairline along the baseline, stretching mid-travel; `glow` moves a soft radial highlight. Panels may cross with 4px blur-through when `blurPanels` is set. The shadow-pair sentence from the disambiguation ships on this page verbatim. Reduced motion: indicator teleports, panels cut. Related: Tabs (7b), OptionWheel, Dock.

**AnimatedBorder** — the frame, alive. Tier 1. `AnimatedBorder { variant?: 'rotate' | 'beam' | 'shimmer', width?: 1, colors?, duration?: 4000, radius?, render? }` — a wrapper whose border is the performance: `rotate` spins a conic gradient through the frame via an animated `@property` angle behind a padding-mask; `beam` runs a short luminous segment around the perimeter path; `shimmer` breathes the border's alpha. Constant-velocity loops, linear, under the extended sanction. Two fence rules the docs state loudly: never on form controls — an animated frame on an Input collides with the focus-ring grammar and loses — and the border never carries meaning (it fails 1.4.11 by design; it is jewelry on a surface whose real boundary is the layout). Contained paint cost, IO-suspended offscreen. Reduced motion: static gradient frame at the rotation's designed keyframe. Related: Spotlight (7g), Shader (7g), Card (the fence's favorite victim).

**Magnet** — one element, attracted. Tier 1. `Magnet { padding?: 80, strength?: 2, lag?, disabled?, children }` — entering the padded activation zone translates the child toward the pointer by `offset ÷ strength`, tracking near-1:1 with `lag` smoothing; leaving releases it home on `spring-soft`, the felt-not-seen return. Presentation-only displacement: the child's focus behavior, hit target, and keyboard operation are untouched, and keyboard focus does *not* summon the pull — the effect is a pointer phenomenon, and `:focus-visible` on the child renders its normal ring at rest position. Touch: inert. Reduced motion: inert. **MagneticButton is a recipe on this page:** `<Magnet><Button/></Magnet>`, with the shadow-pair line — product buttons are never magnetic; a hero CTA may be. Related: Proximity, TextHover, Dock magnification (recipe).

**Proximity** — many children, in a field. Tier 1. `Proximity { radius?: 100, strength?: 0.35, lift?: 14, falloff?: 'gaussian' | 'linear', axis?: 'x' | 'xy', children }` — each direct child scales and lifts by its distance to the pointer under the falloff curve: `gaussian` for the organic dock ripple, `linear` for a harder mechanical read; `x` for rows and docks, `xy` for grids. One rAF read-write cycle drives all children (the 5.9 coalescing rule is this component's load-bearing wall). Compositions documented with fences beside them: Dock magnification, the avatar-row lift, marketing icon rails. Touch inert, reduced-motion inert, keyboard unaffected — same presentation-only constitution as Magnet. Related: Magnet, AvatarGroup (7d-2), Dock (7b).

*(Recorded refinements rather than objections: the linear-easing sanction extends from rotation loops to constant-velocity loops — Marquee, AnimatedBorder, Orbit; and AnimatedTabs composes Base UI Tabs internally, consistent with the never-leak rule since no Base UI type reaches its public API.)*

---

# Part 7g — Tier 1 Showcase: Backgrounds, Effects, Cursors & Scroll

## The pre-7g audit

Every pre-existing Avilo component was run through the register filter before this part was written. Verdicts, as accepted:

| Component | Verdict | Rationale |
|---|---|---|
| DotGrid | **Keep** (roster) | Charged-emptiness canon; absorbs MagneticGrid as its `displace` interaction |
| MagneticGrid | **Merge → DotGrid** | Cursor-displacement is an interaction *mode* of the same surface, not a second grid; alias retained |
| BinaryCode | **Merge → AsciiField** | A glyph field with `charset="01"` — a preset, not a component; alias retained |
| ConstellationBackground | **Drop** | The particles.js hero of 2016 — busy, dated, nothing Kuhaku-specific to say; the `-Background` suffix breaks the naming rule besides |
| GridCursor / TrailCursor | **Keep** (roster) | Naming convention already correct |
| AsciiField | **Keep — joins roster** | Physics-driven glyph particles are mechanically distinct from GlyphField's ambient pulse; merging would produce a franken-API |
| AsciiReveal | **Keep — joins roster** | An *entrance* treatment, not a field — image resolving out of glyphs; register-perfect once the family lines below are drawn |
| Dither | **Keep** (roster) | Subtractive computation; the register's signature effect |
| GlitchText | **Merge → AnimatedText** | `mode="scramble"`, docs alias |
| Stipple | **Rename → GlyphField** | The medium is glyphs; "stipple" truthfully names only dot-shading. Stipple survives as the docs alias |
| PerspectiveScroll | **Merge → ParallaxSection** | Both are scroll-bound spatial transforms of a section; perspective becomes `effect="perspective"`, alias retained |
| PerspectiveCarousel | **Rename → CylinderCarousel** | Geometry beats technique as the generic name; PerspectiveCarousel aliases |

## Disambiguation

The cursor family, five members, one axis each: **Cursor** *replaces* the pointer with a custom element; **TrailCursor** leaves a decaying *trace* of its path; **TextCursor** traces the path in *language*; **GridCursor** lights the *cells* the path crosses; **CrosshairCursor** *frames* the pointer with viewport hairlines. Replacement, trace, language, territory, frame. One page-level budget rule joins the ambient one: **at most one cursor component per page, ever** — five cursors is a family, not a stack. **Spotlight vs DotGrid's `reveal`:** Spotlight is a standalone luminous wash that composes over *any* surface; DotGrid's reveal is a property *of the dots* — if the light exists without the grid, it's Spotlight. The computational family: **Dither** treats *pixels* (tonal reduction, no glyphs); **GlyphField** renders a source *as* a resting glyph grid with ambient pulse; **AsciiField** makes glyphs *particles* with physics; **AsciiReveal** uses glyphs as a threshold the real image *resolves through*; **PixelTransition** dissolves *between two faces* through a block grid — treatment, field, simulation, entrance, swap. The scroll trio: **ScrollReveal** fires once as content enters; **ParallaxSection** is continuously bound to scroll position; **PageTransition** operates between routes, not within them.

## Backgrounds

**DotGrid** — the structural ground, made faintly visible. `DotGrid { gap?: 24, size?: 1.5, color?, drift?: boolean | { speed }, interaction?: 'none' | 'reveal' | 'displace', radius?: 120, strength? }`. At rest: CSS radial-gradient tiling — zero canvas, zero JS. `drift` translates the tile field on a slow loop under the constant-velocity sanction. `reveal` masks the dots up to full opacity within `radius` of the pointer; `displace` — MagneticGrid absorbed — pushes dots from the pointer with spring return, and is the one mode that promotes rendering to canvas, hot values on refs per the constitution. Reduced motion: static grid, interactions inert. *Alias: MagneticGrid.* Related: Shader, Spotlight, GridCursor.

**Shader** — one GL surface, five skins. `Shader { variant: 'gradient' | 'grain' | 'mesh' | 'warp' | 'waves', colors?, speed?, intensity?, scale?, seed? }` on the shared `registry:lib` WebGL runtime — one pipeline, per-variant fragment shaders, all rulings in force: DPR clamped 1.5, IO suspension, context-loss degradation (`gradient` → a real CSS gradient; the rest → generated still tiles), reduced-motion holds a designed frame. `colors` default from the theme's tokens so every accent preset re-skins the ambience for free. One doc-level budget rule: **one viewport-scale Shader per page** — GL contexts are a capped resource, and two competing ambient fields is a register violation before it's a performance one. *Aliases: AnimatedGradient, Grain.* Related: DotGrid, Dither, AnimatedBorder.

**Orbit** — elements in slow circulation. `Orbit { radius?: 140, duration?: 20000, direction?, paths?: 1 | 2 | 3, pauseOnHover?, children }` — children distributed on circular paths, rotating at constant velocity (linear, sanctioned), counter-rotated so items stay upright; multi-path rings stagger radius and period. The logo-cloud and integration-diagram component; children are real content (images keep their `alt`), the wrapper presentational. Reduced motion: the arrangement at its designed angles, still. Related: Marquee (drift in a line vs drift in a circle), Proximity.

## Effects

**Spotlight** — a light that follows attention. `Spotlight { size?: 320, intensity?: 0.15, color?, mode?: 'attach' | 'viewport' }` — a pre-painted radial layer moved by `transform` only (5.9), trailing the pointer with slight lag so it reads as light, not crosshair; `attach` scopes it to its container, `viewport` spans the page. Blends via screen/soft-light over dark surfaces — the canonical dark-leaning hero effect. Touch: a designed static glow; reduced motion: same. Related: DotGrid `reveal`, Shader, CrosshairCursor.

**Dither** — tonal reduction as texture. `Dither { src?, children?, algorithm?: 'bayer' | 'floyd-steinberg' | 'atkinson' | 'ordered' | 'noise' | 'halftone', levels?: 4, scale?: 2, palette?: 'mono' | 'theme' | string[], animate?: boolean | { speed } }` — the six-algorithm canvas pipeline, treating images, video frames, or gradient fills; `theme` palette maps output through the neutral ramp so dithered media sits *in* the system rather than on it. `animate` cycles threshold offsets for the living-print effect; off by default — Dither is a treatment first, motion second. The DPR clamp applies doubly here (dither gains nothing above 1×). Reduced motion: first frame, held. Related: Shader `grain`, GlyphField, AsciiReveal, PixelTransition.

**GlyphField** — a silhouette breathing in characters. `GlyphField { src, charset?, cell?: 10, color?, pulse?: { radius, interval, decay } | false }` — an SVG or image silhouette sampled into a resting glyph grid, animated by localized Gaussian pulses that swell and decay across the field — ambient, non-interactive, the quietest member of the family. Canvas-rendered with the hot/cold split; fonts resolved by passing the family string directly (canvas cannot read CSS custom properties — the next/font lesson, now doctrine). Reduced motion: the grid at rest — the form persists, the breathing stops. *Alias: Stipple.* Related: AsciiField, Dither, AnimatedText.

**AsciiField** — glyphs with physics. `AsciiField { source: string | { src }, charset?, density?, repulsion?: { radius, strength }, spring?: { stiffness, damping } }` — each glyph is a particle with a home position, fleeing the pointer within the repulsion radius and spring-returning when it passes. This is the one Tier 1 component where the spring *parameters* are legitimate tuning props, because particle character is identity here, not system voice. Glyph-atlas rendering, single rAF, IO-suspended. `charset` presets include `binary` — BinaryCode's resting place. Touch: inert field at rest. Reduced motion: static field. *Alias: BinaryCode (charset preset).* Related: GlyphField, Proximity (the DOM-scale cousin), DotGrid `displace`.

**AsciiReveal** — the image, resolving out of noise. `AsciiReveal { src, alt, mode?: 'luminance' | 'tonal', trigger?: 'inView' | 'mount' | 'manual', duration?, cachePolicy?: 'session' | 'always' }` plus the imperative ref: `play`, `reset`, `skip`, `replay`. Glyphs seed from the image's luminance map, then resolve region-by-region into the actual pixels — `tonal` interpolating per-cell color through the transition; `cachePolicy` decides whether repeat visitors re-earn the reveal. A real `<img>` with its `alt` exists from frame zero under the canvas — the a11y constitution applied to media: assistive tech never waits for theater. Reduced motion: the image, one fade. Related: Dither, GlyphField, ScrollReveal.

**PixelTransition** — two faces, dissolved through a block grid. Tier 1. `PixelTransition { faces: [ReactNode, ReactNode], trigger?: 'hover' | 'click' | 'inView' | 'manual', gridSize?: 12, color?, duration?, stagger? }` — blocks flip in random-order cascade under the 5.10 total-cap, `color` defaulting to `--background` so the dissolve reads as the page briefly reclaiming the surface. Image→text, image→image, or arbitrary node pairs. The same block-grid engine powers `PageTransition mode="pixel"` at viewport scale — one engine, two registers. Both faces exist in the DOM; the outgoing one is `aria-hidden` while inactive, so AT reads exactly one. Reduced motion: 200ms cross-fade. Related: Dither, PageTransition, AsciiReveal.

**ImageTrail** — images spawned along the pointer's path. Tier 1. `ImageTrail { items: string[], threshold?: 80, maxVisible?: 6, size?, decay?: 800, rotateJitter?: 4, intensity?: 0.6 }` — images spawn at distance-`threshold` intervals along the path (position lerped by `intensity`), scale-and-fade out over `decay`, cycling through `items`; `maxVisible` caps concurrent nodes so the effect can't unbound itself. The editorial-portfolio effect, register-clean for galleries. All images are `aria-hidden` with `alt=""` — pure decoration by contract, never content. Touch and reduced motion: inert. Related: TrailCursor, Spotlight, Marquee.

## Cursors

One constitution for all five, stated once: cursors render in a portal overlay with `pointer-events: none`; they are pointer phenomena — auto-inert on touch and under reduced motion; they never suppress or restyle focus indicators; and where the native cursor is hidden, it is hidden only within the component's scoped container and restored the moment keyboard navigation begins. Motion values initialize off-screen (−9999) so nothing flashes at the origin before the first pointer event.

**Cursor** — the pointer, replaced. `Cursor { children?, size?: 12, lag?: 0.15, blend?: 'difference' | 'normal', scaleOnPress?: true }` — a custom element (dot by default, arbitrary children otherwise) tracking with a light spring lag that makes it feel *carried*; press scales it 0.85 as system-wide press feedback; `difference` blending keeps it legible over any surface. Hides the native cursor within scope. Related: TrailCursor, Magnet.

**TrailCursor** — the path, remembered briefly. `TrailCursor { length?: 12, decay?: 400, width?: 1.5, blend? }` — a single polyline through the last N pointer positions, fading tail-first over `decay`. One polyline, never chained segments — segment chains produce visible joints at every internal point. Presence as ma: a trace that exists only in the interval between movement and forgetting. Related: Cursor, TextCursor, GridCursor.

**TextCursor** — the path, in language. `TextCursor { text: string | string[], spacing?: 24, decay?: 600, maxItems?, rotate?: boolean }` — glyphs or words spawn along the pointer path at distance intervals and fade tail-first; TrailCursor with language instead of line. The restrained default (single mono glyph, short decay) is the register-side setting; the loud multi-word form is documented as tuning, not default. Spawned text is `aria-hidden`. Related: TrailCursor, AnimatedText, ImageTrail.

**GridCursor** — the path, as territory. `GridCursor { cell?: 40, decay?: 600, blend?: 'difference' }` — an invisible cell grid over the container; cells the pointer crosses light instantly and decay on independent timers, `mix-blend-mode: difference` inverting whatever sits beneath. Pure difference blend, one mechanic, no color prop. Imperative DOM writes, zero React state on the hot path. Related: DotGrid, TrailCursor.

**CrosshairCursor** — the pointer, framed. `CrosshairCursor { readout?: boolean, color?, thickness?: 1 }` — two full-viewport hairlines intersecting at the pointer, optional mono coordinate readout at the intersection; lines fade over 200ms on pointer-leave. The precision-instrument register device. Related: Spotlight, Cursor.

## Scroll & Page

**ScrollReveal** — arrival, acknowledged once. `ScrollReveal { preset?: 'fade-up' | 'fade' | 'scale' | 'blur', margin?: '-10%', once?: true, duration?, delay?, ease? }` — wraps arbitrary children; entering the viewport (offset by `margin` so reveals fire *before* the eye arrives, never after) plays the preset on the entrance curve. Block-scale, not list-scale — AnimatedList owns cascades and list semantics; ScrollReveal owns single regions. Content is present in the document throughout — hidden by presentation only — so SEO, find-in-page, and AT read the page as if nothing performs. Reduced motion: visible immediately. Related: AnimatedList, ParallaxSection.

**ParallaxSection** — scroll as a spatial dimension. Compound: `ParallaxSection.Root { effect?: 'layers' | 'perspective', range? } / Layer { speed?: 0.5, depth? }` — layers translate at fractional scroll rates (`layers`) or the whole section tilts and recedes on a 3D transform bound to progress (`perspective` — PerspectiveScroll's resting place). Scrubbed, never tweened: position maps 1:1 to scroll progress via motion's scroll values, the fidelity law applied to the scrollbar — easing a scroll-bound value is lag on an input. Transform-only, IO-suspended. Reduced motion: layers flatten to static composition. *Alias: PerspectiveScroll.* Related: ScrollReveal, PageTransition.

**PageTransition** — the breath between pages. `PageTransition { mode?: 'fade' | 'slide' | 'hold' | 'pixel', duration? }` — the 5.10 signature made component: outgoing route exits swiftly (~200ms, kyū), the screen holds empty for `--motion-hold`, the incoming enters at ease (~400ms). `pixel` runs the PixelTransition block-grid engine at viewport scale — the old route pixelating out, the new resolving in, the screen literally returning to raw material between pages. App Router integration documented against `template.tsx`; the View Transition API path documented as the alternative for adopters who prefer platform machinery. The a11y work is the real spec: focus moves to the new page's main landmark, scroll restoration is preserved, and a polite live region announces the route — a transition that strands focus on a dead page is a broken back button wearing choreography. Reduced motion: instant swap, announcement intact. Related: PixelTransition, useThemeReveal (7b — the same platform machinery at theme scale), ScrollReveal.

**CylinderCarousel** — the drum, as spectacle. `CylinderCarousel { items, value?, onValueChange?, radius?, panelWidth?, spacing?, curve?: 'concave' | 'convex', drag?: true }` — panels distributed on a CSS-3D cylinder, drag rotating 1:1 with release snapping the nearest panel front-and-center on `spring-soft`, tap-to-center on any visible panel (OptionWheel's grammar in 3D), depth conveyed by perspective falloff — off-axis panels dimming and receding rather than blurring at canvas cost. Keyboard: focusable, arrows rotate one panel, Home/End to bounds — the 2.5.7 path, again where reference implementations don't bother. The shadow line ships on the page: product galleries take Carousel (7d-1); the drum is for showcases. Reduced motion: instant rotation snaps; drag still tracks. *Alias: PerspectiveCarousel.* Related: Carousel, OptionWheel, ParallaxSection.

*(Dropped from the roster during this part's review, recorded once: ConstellationBackground, BlobCursor, PixelTrail — the first as dated and off-register, the second because "gooey" is the aesthetic the system defined itself against, the third as mechanically identical to GridCursor.)*

---

# Part 8 — CLI, Registry & Distribution Architecture

## Principle

Distribution is where a design system's opinions meet other people's codebases, and Kuhaku's stance is one sentence long: **own front door, standard plumbing.** The `kuhaku` CLI is the branded, opinionated entry — but it speaks the shadcn registry protocol internally, byte for byte, so everything else in the ecosystem (shadcn's own CLI, v0, coding agents, MCP clients) consumes Kuhaku without knowing Kuhaku exists.

This is not hedging; it is the distribution-layer expression of the token decision in Part 2. There, semantic names were inherited so themes transfer; here, the registry schema is inherited so *tooling* transfers. A proprietary format would purchase nothing but isolation.

## The registry

The registry is the product. It lives at `kuhaku.dev/r/[name].json`, served by the docs site's route handlers — Phase 1 hosts no separate infrastructure until scale demands it — with each item conforming to the standard registry-item schema. Six types carry the whole system.

| Type | Kuhaku usage |
|---|---|
| `registry:base` | **`@kuhaku/base`** — the entire system in one payload: theme CSS, motion tokens, font config, `lib/motion` helpers, core utilities, foundational components. `kuhaku init` is mechanically this one install |
| `registry:component` | All 114 — each declaring files, npm `dependencies`, and `registryDependencies` (the Kuhaku items it composes) |
| `registry:theme` | The token layer alone: neutrals, semantic pairs, radius root, `--motion-*` table, `.dark` block, strict-mode swaps — installable into an existing shadcn project *without* Kuhaku's components, because the foundations are a legitimate product by themselves |
| `registry:font` | Geist + Geist Mono via `next/font/google` (400–700 subset per Part 3), pointing at the fonts, never shipping them; a Fontsource variant ships as a sibling item for non-Next stacks |
| `registry:hook` | `useThemeReveal`, `useReducedMotion`, the scroll and pointer-coalescing hooks Tier 1 shares |
| `registry:lib` | The motion runtime (spring token consumption, `linear()` emission), the Shader WebGL pipeline, the `$mod` keyboard resolver, `cn` |

**Dependency flow** is the registry's quiet superpower and the answer to "how does `motion` reach adopters": every item that animates lists `motion` in its `dependencies`, so the CLI writes it into the adopter's `package.json` at install — no peer-dependency ceremony, no manual step. The same channel carries the argued exceptions: Sonner under Toast, Embla under Carousel, TanStack Table under DataTable, Shiki under CodeBlock. An adopter who never installs DataTable never hears of TanStack. `registryDependencies` meanwhile resolves composition — installing `date-picker` pulls `popover`, `calendar`, and `input` automatically, which is why Part 7's composition notes were never documentation flavor but dependency graph.

**The Base-UI-never-leaks rule, stated as architecture.** Component files import `@base-ui/react/*` internally and only internally: no barrel re-exports Base UI, no public prop is typed as a Base UI type, no Base UI part name appears in Kuhaku's public API — HoverCard wraps PreviewCard, and the adopter never learns this from the types. The rule is enforced, not aspired to: a lint rule in the registry build fails any component whose exported types reference `@base-ui/*`. The payoff is the Phase 2 option: any primitive can be re-implemented in-house, one at a time, and the diff adopters see is an implementation detail, because the API boundary was airtight from day one.

## The kuhaku CLI

`npx kuhaku init` scaffolds or adapts a project: detects framework and Tailwind v4, writes `components.json` with the `@kuhaku` namespace pre-registered, installs the base payload, and asks exactly two questions — accent preset (default: ink) and font acceptance (default: Geist). An init that interrogates is an init that gets abandoned; `--preset [CODE]` skips even those two.

`npx kuhaku add button switch dialog` resolves against the registry with full `registryDependencies` traversal; `kuhaku add --all` exists for the committed. The inspection surface passes through shadcn's verbs unchanged — `--dry-run`, `--diff`, `view`, `search` — because inventing synonyms for solved verbs is the CLI equivalent of renaming `--primary`. Under the hood the CLI is a thin orchestration layer over the same resolution logic shadcn's CLI runs; where drift risk exists it *delegates* rather than reimplements, so protocol evolution upstream is inherited rather than chased.

**Presets.** Six first-party codes ship — ink plus the five accents of Part 2 — each a single portable string in the standard preset format, applied at birth (`kuhaku init --preset kaki`) or retroactively: `kuhaku apply --preset seiji` mirrors `shadcn apply`, reinstalling existing components and updating theme, colors, CSS variables, fonts, and icons while preserving project settings. Switching Kuhaku's entire chromatic personality is therefore a one-command operation at any point in a project's life, not a day-one decision. Because the format is standard, community presets built visually drop onto Kuhaku unmodified — and the Part 2 lightness discipline is what makes that safe rather than reckless.

**Both install paths, documented as equals.** The front door: `npx kuhaku add button`. The ecosystem door: `npx shadcn@latest add @kuhaku/button` — with a registry-directory listing applied for at launch so the namespace resolves with zero configuration. The docs show both on every component page; the CLI page explains why both exist, in the terms of this section's principle sentence. One namespace, one registry, two doors, no second format.

## Monorepo architecture

| Workspace | Contents |
|---|---|
| `apps/docs` | Next.js App Router + Fumadocs — documentation, marketing surface, and registry host (`/r/[name].json` route handlers reading build output) |
| `packages/registry` | Source of truth: component source organized by Part 7's categories, plus `registry.json` — the manifest declaring every item, its files, dependencies, and type |
| `packages/cli` | The `kuhaku` npm package — init/add/apply/diff orchestration |
| `packages/tokens` | The CSS layer as data: neutrals, semantic pairs, motion table, strict-mode swaps — consumed by the registry build *and* by the docs' token-reference pages, so documentation and shipped values cannot disagree |

The build pipeline (`turbo build`) compiles `packages/registry` source into static registry-item JSON: inlining file contents, validating every item against the schema, running the never-leak lint, verifying the dependency graph is acyclic and complete (an item referencing an undeclared registry dependency fails the build, not the adopter), and emitting into `apps/docs/public/r/`. The docs site consumes its own registry — every live demo imports from built output — which makes the documentation an integration test: a component that renders on its own docs page is a component that installs.

## QA & audit

Part 6's claim of "AA, audited per component" is only honest if it is mechanical, so the pipeline enforces it in four layers.

**Automated axe.** Every component's demo matrix — each variant × each interactive state × both modes × strict mode — runs axe-core in CI. Violations fail the build. Not a report: a gate.

**The keyboard matrix.** Every interactive primitive carries a Playwright spec asserting its full APG contract: the Tab stops, the arrow semantics, the Escape scoping, the focus return. These were drafted as testable claims in Part 7 on purpose. The matrix is published in the docs, because an audit adopters can read is worth two they take on faith.

**Manual screen-reader passes.** Before a component's first ship and after any interaction change: a scripted VoiceOver pass (macOS/Safari) and NVDA pass (Windows/Firefox). Automation catches structure; humans catch experience, and no tool hears a double-announcing Swap.

**The performance gate.** Part 5.9's budget as CI: Tier 2 interactions profiled under 4× CPU throttle asserting no dropped-frame windows; Tier 1 components asserting IO-suspension actually suspends.

Visual regression testing (Playwright screenshots across the same matrix) is named as the later addition it is — valuable, but behind the other four in marginal safety per maintenance hour for a solo maintainer. That sequencing is itself a documented decision.

## Agent legibility

**llms.txt** at the root: the system in agent-consumable summary — tiers, token vocabulary, install paths, the component index with one-line purposes. **An MCP server** exposing the registry (search, view, install-instructions) so agent-driven workflows resolve `@kuhaku` without scraping. **shadcn/skills participation:** since the official skill already covers Base UI primitives and registry workflows, Kuhaku ships a complementary skill layer teaching agents what the generic skill cannot know — the tier system (when *not* to animate), the token namespace, the fence rules. An agent that installs MagneticButton into a settings form is an agent the skill failed.

The strategic read, recorded once: agents are becoming a primary installation channel, and a registry illegible to agents is a registry with a closing front door.

## Versioning & the update flow

SemVer on the registry as a whole; no cadence; release when ready — with registry reality acknowledged: installed code belongs to the adopter, so "updating" is re-installation by consent, never mutation. The documented flow: `kuhaku diff button` renders local-versus-registry divergence; clean components re-add directly; customized components get the diff applied by hand or handed to a coding agent with the skill loaded, which is what makes owned-code distribution maintainable rather than merely flattering. Breaking API changes land only in majors with per-component migration notes in the changelog. Token-only changes — a retuned spring, a nudged neutral — ship as minors adopters absorb by re-adding `@kuhaku/theme` alone, the tokens/components separation paying out one last time.

---

# Part 9 — Doc Site IA & Phase Scope

## Principle

The documentation site is not documentation *of* the product; for wedge two, it *is* the product. Kuhaku's bet is that a system whose reasoning is legible earns adoption that a token dump never will. The site is therefore built as three surfaces sharing one codebase: a **book** (the Foundations, written to be read in order), a **reference** (every component, exhaustively specified), and a **machine interface** (the registry routes, the llms surfaces, search, OG images — the site as consumed by CLIs and agents).

The register governs all three. The docs are the first Kuhaku application, and every page is a proof: Section rhythm at 96px, Prose at 65ch, dark by default, motion demonstrating itself. A docs site that violated its own foundations would falsify the book it hosts.

## Site map

| Section | Contents |
|---|---|
| **Home** | The positioning sentence, one Tier 1 composition behaving itself, the two wedges stated, one install command. A landing, not a tour; the docs are the tour |
| **Foundations** | Eight pages, locked order: Principles, Color, Typography, Spacing & Layout, Radius, Motion, Accessibility, Density |
| **Primitives** | 84 pages in the five Part 7 categories, each category opening with its disambiguation block |
| **Animated** | 30 pages in six sub-categories — Text, Interaction, Backgrounds, Effects, Cursors, Scroll & Page — opening with the Tier 1 contract and the fence, stated once where every showcase visitor will pass |
| **Recipes** | Lead, Muted, Morph, MagneticButton, Dock magnification, avatar-row lift, ExpandableTabs, OverflowActions, Announcement, Glimpse, View-Transition theme wipe, Sound, fluid display sizing — each a page with the pattern, the code, and the fence where one applies |
| **CLI / Registry** | Installation (both doors as equals), `init`, `add`, `apply`, the six presets, theming and full token override, using Kuhaku from shadcn's CLI, agents (llms + MCP + skills), the update flow with `diff` |
| **Changelog** | SemVer log, migration notes per breaking change, written in the human "we" |
| **Blocks** | *(Phase 2 — present in navigation from day one, marked, empty. An honest roadmap beats a surprise section)* |
| *Machine surfaces* | `/r/[name].json`, `/llms.txt`, `/llms-full.txt`, per-page `/llms.mdx`, `/api/search`, OG image routes |

## Foundations, page by page

| Page | Content plan |
|---|---|
| **Principles** | Part 1 nearly verbatim: the name, the triad, the six principles, the two wedges, what Kuhaku will not be. The one page with no code on it |
| **Color** | The subtractive principle; the stone ramp with swatches read live from `theme.css` — the tokens-package promise kept in public; semantic pairs in both modes; the ink argument; the five presets applied live to the page itself; chart palette with the colorblind honesty note; the contrast-audit table |
| **Typography** | The scale rendered as itself, every step at its own metrics; the leading and tracking arguments; weights with the 700-display rule; the measure demonstration; `registry:font` install |
| **Spacing & Layout** | The nine-step relationship table as an interactive spacer; the five layout primitives with live compositions; the airy calibrations stated as numbers; the emptiness-first separator doctrine |
| **Radius** | The one-token derivation with a live `--radius` slider re-skinning every example on the page — the most persuasive interactive the site owns, at trivial cost; the concentric-nesting rule with the picture-frame anti-example |
| **Motion** | The flagship and longest page, mirroring Part 5's ten sections: every duration and easing as a hoverable demo, the two springs side by side, the tier architecture, the full micro-interaction table with each row operable, choreography with stagger tokens visualized, reduced motion shown by honoring the reader's own OS setting live |
| **Accessibility** | The AA floor per primitive family, the published keyboard matrix, focus strategy, strict mode with a page-level toggle applying `data-a11y="strict"` to the docs themselves — the audit as demonstration |
| **Density** | The numbers (40px controls, 44px targets, gap floors, one density) and the argued refusal of a global compact mode |

## The component page template

Shared by all 114 pages: live preview → install (both commands) → usage → **API table generated from the TypeScript source** (types and docs cannot disagree — the tokens promise extended to props) → **Motion behavior** (Tier 2 pages: the quantified spec restated exactly; Tier 3 pages: the stillness statement) → Accessibility (the contract *and* its Playwright matrix, linked) → Examples gallery (many composed looks of one canonical primitive) → Related, carrying the disambiguation lines.

Animated pages swap the API table forward and foreground the tuning props, since for Tier 1 the tuning surface *is* the contract.

## Phase scope

**Phase 1 — launch.** All eight Foundations. 112 of 114 components (84 primitives + 30 showcase, less the two below). All recipes. Full CLI (`init`, `add`, `apply`, presets, `diff`), the registry live at `/r`, both install paths, llms surfaces filled, MCP server, the skill layer, registry-directory listing, six preset codes, and the QA pipeline's four gates running in CI. The Tier 1 tuning playground ships in Phase 1 as one shared component instantiated across every showcase page.

**Wave 2 (Phase 1.5).** ColorPicker and SwipeableList — specced, scheduled, honest about cost.

**Phase 2.** Blocks (the section exists, empty, from day one) as the Kuhaku Pro catalogue with a free sampler; Kanban and Gantt explicitly reconsidered, not promised; selective in-house re-implementation of Base UI primitives behind the never-leak boundary, with the Sonner → Base UI Toast migration as the first candidate; visual regression testing joining the QA gates; the compact-density door from Part 6, opened only by demonstrated demand.

## Resolved questions

The seven questions this specification could not answer alone, and the answers given.

1. **Audio doctrine.** The system stays silent. Sound ships as a documented *recipe* built on `use-sound`: gesture-gated, low default volume, with a user-facing mute setting. No component emits sound on its own initiative, and no `prefers-reduced-sound` media query exists to lean on — which is precisely why the burden sits with the adopter who opts in.
2. **NumberField.** Promoted from recipe to component; specified in Part 7a alongside its siblings.
3. **The Tier 1 tuning playground.** Ships in Phase 1 — one shared playground component instantiated on each of the 30 showcase pages. Live prop-tuning with JSX export is not a docs flourish for Tier 1; it is the contract made operable.
4. **Dark strict-mode status hues.** Deferred to a post-spec working session: 7:1 text-use values for success, warning, and destructive on dark surfaces, tuned against real components and measured rather than tabled. Flagged in `theme.css` at the point of use.
5. **Monetization.** The core system is MIT and free, permanently. **Kuhaku Pro** is the paid perimeter: Phase 2 blocks and templates beyond the core, with a free sampler in the Blocks section. Commercial licensing, registry authentication, and payment infrastructure are deferred to a business addendum; the agent skill stays free. Revisable.
6. **Contribution policy.** The curated middle, shadcn's model: bug fixes, documentation, and accessibility PRs are welcome; new components require a proposal-first RFC judged against the published register filter. Documentation voice stays authorial.
7. **Homepage theater budget.** Purposeful plurality: several Tier 1 pieces, each from a different family and each doing a real job, all obeying the published budgets — one viewport-scale ambient surface, one cursor component, no exceptions. The restraint is the demonstration.

---

# Appendix A — Decision register

Every naming, scoping, and architectural decision taken during review, in one place. The register exists so that a question settled once is not relitigated by a future reader — including a future author.

## Aliases

Each resolves to its target in documentation search; none ships as a separate component.

| Alias | Resolves to |
|---|---|
| Pill | `Badge` (the `pill` variant) |
| Tag | `Chip` |
| GlitchText | `AnimatedText mode="scramble"` |
| Stipple | `GlyphField` |
| PerspectiveCarousel | `CylinderCarousel` |
| PerspectiveScroll | `ParallaxSection effect="perspective"` |
| AnimatedGradient | `Shader variant="gradient"` |
| Grain | `Shader variant="grain"` |
| MagneticGrid | `DotGrid interaction="displace"` |
| BinaryCode | `AsciiField charset="binary"` |
| MagneticButton | Recipe: `<Magnet><Button /></Magnet>` |

## Merges

| Absorbed | Into | Reason |
|---|---|---|
| AnimatedToastStack | Toast | Stack physics are Toast's specification, not a second component |
| RangeSlider | Slider | A range is two thumbs on one track — a prop, not a component |
| Loader | Spinner | Consolidated as `variant: spinner \| dots \| bars \| dither \| ascii` |
| Announcement, Glimpse | Banner, HoverCard | Compositions documented as recipes |
| ExpandableTabs, OverflowActions | Recipes | Compositions of Tabs and DropdownMenu respectively |

## Drops

| Dropped | Reason |
|---|---|
| ConstellationBackground | Dated, busy, nothing Kuhaku-specific to say; the name also breaks the generic-naming rule |
| DynamicIsland | A platform's signature, borrowed; imitation is not a register |
| QRCode | A utility, not a design-system concern |
| BlobCursor | "Gooey" is the aesthetic the system defined itself against |
| PixelTrail | Mechanically identical to GridCursor |
| EmptyState | Excluded by brief; every component that needs one exposes a slot |

## Key review decisions

- **Base UI never leaks.** Enforced by a build-time lint rule, not convention. HoverCard wraps PreviewCard and the adopter never learns this from the types.
- **Motion is not opt-in.** No component anywhere exposes an `animated` prop. Tier 2 tunes through tokens only; Tier 1's tuning props *are* its contract.
- **Buy the solved problems.** Sonner (toast physics), Embla (gesture snapping), TanStack Table (column models), Shiki (highlighting) enter as per-item registry dependencies. Re-deriving them would be inventory vanity.
- **Instant is a motion decision.** Menu highlights, menubar sibling swaps, TreeView disclosure, DataTable reorders, and Calendar paging are deliberately unanimated; each carries its argument on its page.
- **The three-kinetic carve-out.** Skeleton, Spinner, and Progress move because movement is their message; they remain Tier 3 in every other respect.
- **Additive change only.** New props default to existing behavior; no existing usage breaks.
- **Generic naming over use-case naming.** Components are named for what they do, never for one application of it — `GlyphField`, not `Stipple`; `Effects/`, not `Brand/`.
- **Field position stays background.** The competitive analysis informs curation and roadmap; it is not brand copy and does not appear in Part 1.
- **Dark `--accent` is neutral-800**, corrected from neutral-850 during Part 2 review so hover washes remain visible on popover surfaces.
- **The `--motion-delay-hint` exception.** Reduced motion collapses every duration token to zero except this one: an intent-confirmation delay is not motion.

---

# Appendix B — Component index

**84 primitives + 30 showcase = 114 components. 112 ship at Phase 1 launch** (ColorPicker and SwipeableList in Wave 2).

## Primitives (Tier 2 / Tier 3)

**7a — Actions & Forms (22).** Button · Input · Textarea · Checkbox · RadioGroup · Switch · Slider · NumberField · Toggle · ToggleGroup · Select · Combobox · TagsInput · Rating · WheelPicker · FileUpload · Form/Field · InputOTP · Label · Calendar · DatePicker · ColorPicker *(Wave 2)*

**7b — Overlays & Navigation (20).** Dialog · AlertDialog · Sheet · Drawer · Popover · Tooltip · HoverCard · DropdownMenu · ContextMenu · Menubar · NavigationMenu · Command · CommandPalette · Tabs · Breadcrumb · Steps · Pagination · Sidebar · ThemeToggle · Dock

**7c — Feedback & Status (9).** Alert · Banner · Toast · Progress · Skeleton · Spinner · Status · Badge · Chip

**7d-1 — Content & Data: containers, disclosure, data (12).** Card · Separator · AspectRatio · ScrollArea · Accordion · Collapsible · Table · DataTable · Carousel · TreeView · Timeline · Stat

**7d-2 — Content & Data: media, code, identity, dates (12).** Avatar · AvatarGroup · ImageZoom · Comparison · Code · Kbd · Quote · CodeBlock · Snippet · ContributionGraph · MiniCalendar · SwipeableList *(Wave 2)*

**7e — Layout & Typography (9).** Stack · Cluster · Grid · Container · Section · Heading · Text · Prose · Swap

## Showcase (Tier 1)

**7f — Typography & Interaction (11).** AnimatedText · TextHover · TextLoop · OptionWheel · AnimatedCounter · Marquee · AnimatedList · AnimatedTabs · AnimatedBorder · Magnet · Proximity

**7g — Backgrounds, Effects, Cursors & Scroll (19).**
*Backgrounds (3):* DotGrid · Shader · Orbit
*Effects (7):* Spotlight · Dither · GlyphField · AsciiField · AsciiReveal · PixelTransition · ImageTrail
*Cursors (5):* Cursor · TrailCursor · TextCursor · GridCursor · CrosshairCursor
*Scroll & Page (4):* ScrollReveal · ParallaxSection · PageTransition · CylinderCarousel

## Hooks & libraries

`useThemeReveal` · `useReducedMotion` · scroll and pointer-coalescing hooks · `lib/motion` (spring runtime) · the Shader WebGL runtime · the `$mod` keyboard resolver · `cn`

---

# Appendix C — Post-spec work items

Carried forward from the specification into implementation. None blocks scaffolding; all block launch.

1. **Dark strict-mode status hues.** Tune 7:1 text-use values for success, warning, and destructive on dark surfaces using OKLCH→sRGB contrast measurement, verified against real components rather than tables. Append measured ratios to `theme.css` as comments at the point of use, replacing the flagged open note.
2. **The business addendum.** Kuhaku Pro's commercial licence text, registry authentication, and payment infrastructure — deliberately excluded from this document, deliberately not deferred indefinitely.
3. **The Sound recipe.** Build and document the `use-sound` recipe per the audio resolution: gesture-gated, low default volume, adopter-facing mute setting, and a written argument for why the system itself stays silent.
4. **Token files into the repository.** Place `theme.css` and `motion.css` at `packages/tokens/src/css/` if not already committed, and wire the docs' token-reference pages to read from them so documentation and shipped values cannot drift.
5. **The `@theme inline` mapping layer.** Author the Tailwind exposure — colour, radius, and font variable mappings — as part of the `registry:theme` item, keeping `theme.css` itself pure plain-CSS tokens for non-Tailwind adopters.
6. **Spring `linear()` emission.** Implement the build step that converts the spring token values into `linear()` approximations for CSS consumers; never hand-write these.

---

*End of specification. Compiled from nine checkpointed parts; all amendments agreed during review are reconciled inline.*