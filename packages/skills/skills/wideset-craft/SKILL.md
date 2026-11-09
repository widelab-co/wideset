---
name: wideset-craft
description: The composition and taste layer for any UI built with Wideset, the judgement that turns a correct screen into a sharp one. Use it whenever you generate, design, compose or review a screen, page, flow, form, dashboard, modal or template with `@wideset/react`, even when the request only says "build a screen" or "make it look good". The component references say which component and token exists; this skill says which one to pick, at which size, how to space, align and stack it, and how to check the result. Also use it when someone asks for "bigger", "denser", "calmer", "more premium" or "less generic" Wideset UI.
license: Apache-2.0
---

# Wideset craft

Most generated UI is technically fine and still forgettable: every component is real, every class
is a token, and the screen still looks assembled rather than designed. The difference is a small
set of decisions made **the same way every time**. This skill holds those decisions for Wideset.

It sits on top of `wideset-build` and never contradicts it:

- **What exists**: components, props, tokens. If a rule here names a class or prop, it exists. If
  you need one that is not named, find it in the component source or the docs pages linked from
  [foundations.md](references/foundations.md); do not invent it.
- **How to write the code**: the `wideset-build` skill.
- **Token choice, focus, icons, words and responsive rules**: [foundations.md](references/foundations.md).

## North star

**One screen, one focal point, one size, one accent: calm, scannable, consistent to the pixel.**

The goal is a composition that is right, not rules that were followed. Judge it optically:
**blur the rendered screen** until no word is legible. The masses that remain must be coherent:
one focal point, weight that matches importance, an even rhythm of gaps, even density, shared
edges, space that is meant. If the blurred screen is coherent the sharp one almost always is; if
it is not, no correct token fixes it. How to run the blur test and what to look for:
[composition.md](references/composition.md).

The rules below are knowledge that usually produces that coherence, with the reason for each.
When the blurred screen shows a rule making the composition worse, change it and say why. Fixed
are only the system's own decisions: tokens, text colour by job, status colour only for meaning,
one control height, the type styles that exist.

## Plan before JSX

Write this down before any code, in three or four lines:

1. **Job.** The one thing a person comes to this screen to do.
2. **Primary action.** The single most important control. There is one.
3. **Hierarchy.** What is read first, second and third.
4. **Layout.** Which scaffold from [layout-scaffolds.md](references/layout-scaffolds.md) it uses, the screen's size mode and surface language, and which components fill it.

If you cannot name the job, ask instead of filling the page.

## The rules

Each rule has a reference file with the why, the exact Wideset classes and props, and do/don't
code. Read the reference before you apply a rule for the first time in a session.

| #   | Rule                                                                                                                                                                                                                                                 | Reference                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | **One control size per screen: `sm` (32px).** Every button, field, filter and segmented control on a screen shares one height, as Figma's Screens draw them. Go `md` (40px) or `lg` only when the person asks or the screen type demands it.         | [sizing.md](references/sizing.md)                                 |
| 2   | **Pass `size="sm"`; never mix sizes.** Button, IconButton, SplitButton, the fields and SegmentedControl default to `md` (40px), so they take `size="sm"`; `FilterButton`, `Chip` and `Tabs` are 32px at their defaults.                              | [sizing.md](references/sizing.md)                                 |
| 3   | **Flat type scale.** Body and labels at 14px, one page title, section titles one step up. Hierarchy comes from weight and colour, not size jumps.                                                                                                    | [typography.md](references/typography.md)                         |
| 4   | **Spacing has a hierarchy.** Tight inside a control, medium between fields, wide between sections; the gap grows with the size of what it separates. Only `ws` steps.                                                                                | [spacing.md](references/spacing.md)                               |
| 5   | **Choose width deliberately.** Reading and form columns stop around 40rem; only data-dense tables and boards run full width. Never stretch a composed screen edge to edge.                                                                           | [spacing.md](references/spacing.md)                               |
| 6   | **One left axis.** The page title, the section titles and the content start on the same vertical line.                                                                                                                                               | [spacing.md](references/spacing.md)                               |
| 7   | **One accent: the primary action.** Brand colour appears on one filled primary button per view. A selected row looks like the active `Sidebar.Item` (neutral fill), never a brand tint. Everything else is neutral; status uses status colours only. | [surfaces.md](references/surfaces.md)                             |
| 8   | **Pick one surface language per screen.** Off-white canvas with white cards, or one flat surface separated by space. Not both, never cards inside cards.                                                                                             | [surfaces.md](references/surfaces.md)                             |
| 9   | **The right component and container for the job.** Checkbox for a setting saved later, Switch for one that applies now; Modal for something short, Sidepanel for detail in context, a page for a flow.                                               | [components-and-actions.md](references/components-and-actions.md) |
| 10  | **Action hierarchy.** One primary per view, secondary as border, the rest ghost; actions sit where the eye ends (top right of a page, bottom right of a form or modal).                                                                              | [components-and-actions.md](references/components-and-actions.md) |
| 11  | **States are part of the design.** Every list, table and panel has its empty, loading and error state designed with the same care as the full one.                                                                                                   | [components-and-actions.md](references/components-and-actions.md) |
| 12  | **Data reads in columns.** Numbers right-aligned with `tabular-nums`, consistent decimals and units, text left, status as a badge.                                                                                                                   | [data.md](references/data.md)                                     |
| 13  | **Motion belongs to the components.** Do not add your own transitions; the components animate with Wideset's motion tokens and respect reduced motion.                                                                                               | [motion.md](references/motion.md)                                 |
| 14  | **Colour by job.** Text that is looked for is `strong`, text that is read is `base`, text that only labels is `subtle`; brand, status and chart highlight colours each appear only for a reason in the data.                                         | [text-colour.md](references/text-colour.md)                       |

Four more habits apply to every screen:

- **Show real content.** Plausible names, numbers and dates, and enough rows to test the layout.
  Labels describe; they do not sell (see the words in [foundations.md](references/foundations.md)).
- **Remove before adding.** If an element serves no decision, it goes. [review.md](references/review.md)
  lists what to remove first.
- **Weaken what is secondary before strengthening what matters.** Most text is `text-ws-static-base`
  or `-subtle`; numbers and names outrank their labels. See [hierarchy.md](references/hierarchy.md).
- **Prefer whitespace to dividers, and a divider to a box.** Boxes inside boxes are the first sign
  of a generated UI, and a surface gets a border or a shadow, not both.

## Defaults at a glance

When nothing in the request says otherwise, use exactly these:

| Decision           | Default                                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Control height     | `sm` (32px): `size="sm"` on Button, IconButton, SplitButton, TextInput, Select, MultiSelect, ComboBox, Textarea, SegmentedControl; `FilterButton`, `Chip` at their defaults           |
| Page tabs          | `Tabs` at their default `sm`, on the page and inside a card or panel                                                                                                                  |
| Page canvas        | `bg-ws-static-background` (off-white); content on `Card` (white `bg-ws-static-container`)                                                                                             |
| Page title         | `typography-subtitle-lg text-ws-static-strong` (32px), one per page                                                                                                                   |
| Section title      | `typography-subtitle-xs` or `Card.Title`                                                                                                                                              |
| Body / description | `typography-body-md text-ws-static-base`; labels and metadata `-subtle`                                                                                                               |
| Text colours       | `text-ws-static-strong` (headings, key values), `-base` (body), `-subtle` (secondary, metadata)                                                                                       |
| Page padding       | `p-ws-12` (24px); page sections `gap-ws-16` (40px); inside a card `gap-ws-12` (24px)                                                                                                  |
| Content width      | forms and reading `max-w-[40rem]`; composed pages `max-w-[80rem] mx-auto`; tables may fill                                                                                            |
| Primary action     | `<Button size="sm">` (primary, filled), one per view                                                                                                                                  |
| Secondary action   | `<Button size="sm" variant="secondary" preset="border">`                                                                                                                              |
| Tertiary / in-row  | `preset="ghost"` or `IconButton` with an `aria-label`                                                                                                                                 |
| Icon button size   | the height of the controls beside it, one height per bar: the screen's size (`sm`; `md` in a comfortable screen); `xs` only for actions inside a row, card or column header           |
| Selected row       | the active `Sidebar.Item` look in every column: `aria-current` with `bg-ws-dynamic-tertiary-alpha-strong-default text-ws-static-strong`; one selected style per screen, no brand tint |
| List row           | a title (`strong`) and at most one line of `subtle` metadata, a status badge at its start; ids and tags live in the detail ([hierarchy.md](references/hierarchy.md#list-rows))        |
| Status colour      | only for states that ask for action now (failure, firing, the top severity); lifecycle states are neutral badges ([surfaces.md](references/surfaces.md#status-colour-budget))         |
| Icons              | Remix line icons (`Ri…Line`), passed to the component; size comes from the control                                                                                                    |

Pass `size="sm"` explicitly to the components in the first row that name it: their default is `md`.

## The emphasis budget

Each screen gets a limited amount of loudness:

| Emphasis                                        | Allowance per view           |
| ----------------------------------------------- | ---------------------------- |
| Filled primary button                           | 1                            |
| Coloured status or danger fill                  | Only where state requires it |
| Page title, `typography-subtitle-lg`            | 1                            |
| Elevated surface (`shadow-ws-medium` or higher) | Only while it floats         |

When something new has to stand out, take the emphasis from something else.

## When the person asks for something else

The defaults are deliberate, so change them **only when asked**, and then change them
**everywhere on the screen at once**:

- "bigger", "roomier", "more comfortable", a public form or one-time setup → every control `md`
  (40px), `FilterButton size="md"`, `Chip size="lg"`, page `Tabs size="lg"`. See
  [sizing.md](references/sizing.md#comfortable).
- "touch-friendly", "for a kiosk / tablet" → every control `lg` (48px), body
  `typography-body-lg`, page padding one step up. See [sizing.md](references/sizing.md#large).
- "denser", "compact", "more on screen" → controls stay `sm`, gaps one step down. See
  [sizing.md](references/sizing.md#denser).
- "more premium", "calmer", "less generic" → remove before you add: fewer surfaces, fewer
  colours, fewer sizes, more space. See [review.md](references/review.md).

Never mix modes on one screen. A compact table inside a default page is fine (the table is the
data tool); a `sm` button next to a `md` field is not.

## Anti-slop list

These mark a screen as generated. Remove them on sight:

- A row of four identical metric cards with an icon in a tinted circle, added because the page looked empty
- Gradient text, gradient buttons, or a gradient hero behind an app page
- Every section wrapped in a card with a shadow, and cards inside cards
- A filled icon in a coloured square beside every heading
- Headings like "Welcome back!", "Overview" or "Your dashboard at a glance" over content that needs no introduction
- Decorative badges with no meaning ("New", "Pro", "Beta") and dots for status nobody asked about
- Centred text in an app; centre only empty states and short confirmations
- Emoji as icons
- Fake charts or progress with invented percentages
- Five button styles on one screen
- Lorem ipsum, "John Doe", "Item 1, Item 2, Item 3"
- Rainbow tags: a different colour for every category when the colours mean nothing
- Every text in `text-ws-static-strong` (names, values, list items all near-black), or every label in uppercase
- A status colour on every badge: amber "Identified", blue "Monitoring", green "Resolved" beside the one red that matters

[review.md](references/review.md) adds the tells that show in layout and sizing.

## Workflow

1. **Decide before you build.** Write down in one line: the screen type (list, detail, form,
   dashboard, settings, flow, empty), its focal point, the size mode and the surface language.
2. **Compose from real components** using the `wideset-build` references; start from the rules
   above.
3. **Render it and run the blur test** ([composition.md](references/composition.md)). Fix the
   composition until the blurred screen is coherent, before any detail.
4. **Design the other states** (empty, loading, error, long content, narrow width, dark mode), and
   blur-test the empty state too.
5. **Check the detail** with [review.md](references/review.md): the scored checklist, then
   `wideset-review`.
6. **Report the decisions** you made (size mode, surface language, width) and every departure from
   the tables with its reason, so a person can overrule them in one sentence.
