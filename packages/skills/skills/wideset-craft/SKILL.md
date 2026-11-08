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
When two rules pull apart, choose whatever makes the screen easier to scan and calmer.

The test is the **squint test**: blur the screen. If you cannot say in one glance what matters
most, the composition is broken, and no amount of alignment fixes it.

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

| #   | Rule                                                                                                                                                                                                                                 | Reference                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1   | **One control size per screen: `md` (40px).** Every button, field, filter and segmented control on a screen shares one height. Go `sm` or `lg` only when the person asks or the screen type demands it.                              | [sizing.md](references/sizing.md)                                 |
| 2   | **Leave sizes at their defaults where they are 40px; never mix them.** `FilterButton` and `Chip` default to a smaller size, so pass `size="md"` and `size="lg"`; page `Tabs` take `size="lg"`, and inside a card or panel stay `sm`. | [sizing.md](references/sizing.md)                                 |
| 3   | **Flat type scale.** Body and labels at 14px, one page title, section titles one step up. Hierarchy comes from weight and colour, not size jumps.                                                                                    | [typography.md](references/typography.md)                         |
| 4   | **Spacing has a hierarchy.** Tight inside a control, medium between fields, wide between sections; the gap grows with the size of what it separates. Only `ws` steps.                                                                | [spacing.md](references/spacing.md)                               |
| 5   | **Choose width deliberately.** Reading and form columns stop around 40rem; only data-dense tables and boards run full width. Never stretch a composed screen edge to edge.                                                           | [spacing.md](references/spacing.md)                               |
| 6   | **One left axis.** The page title, the section titles and the content start on the same vertical line.                                                                                                                               | [spacing.md](references/spacing.md)                               |
| 7   | **One accent: the primary action.** Brand colour appears on one filled primary button per view (and the selected state of navigation). Everything else is neutral; status uses status colours only.                                  | [surfaces.md](references/surfaces.md)                             |
| 8   | **Pick one surface language per screen.** Off-white canvas with white cards, or one flat surface separated by space. Not both, never cards inside cards.                                                                             | [surfaces.md](references/surfaces.md)                             |
| 9   | **The right component and container for the job.** Checkbox for a setting saved later, Switch for one that applies now; Modal for something short, Sidepanel for detail in context, a page for a flow.                               | [components-and-actions.md](references/components-and-actions.md) |
| 10  | **Action hierarchy.** One primary per view, secondary as border, the rest ghost; actions sit where the eye ends (top right of a page, bottom right of a form or modal).                                                              | [components-and-actions.md](references/components-and-actions.md) |
| 11  | **States are part of the design.** Every list, table and panel has its empty, loading and error state designed with the same care as the full one.                                                                                   | [components-and-actions.md](references/components-and-actions.md) |
| 12  | **Data reads in columns.** Numbers right-aligned with `tabular-nums`, consistent decimals and units, text left, status as a badge.                                                                                                   | [data.md](references/data.md)                                     |
| 13  | **Motion belongs to the components.** Do not add your own transitions; the components animate with Wideset's motion tokens and respect reduced motion.                                                                               | [motion.md](references/motion.md)                                 |

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

| Decision           | Default                                                                                                                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Control height     | `md` (40px): Button, IconButton, TextInput, Select, MultiSelect, ComboBox, SegmentedControl; `FilterButton size="md"`, `Chip size="lg"`                                                                     |
| Page tabs          | `Tabs size="lg"`; `Tabs` inside a card or panel keep their default `sm`                                                                                                                                     |
| Page surface       | Set once per app by its visual direction; in Flat (the default) `main` is white like the `Sidebar` beside it, cards on it `Card` bordered                                                                   |
| Page title         | `typography-subtitle-lg text-ws-static-strong` (32px), one per page                                                                                                                                         |
| Section title      | `typography-subtitle-xs` or `Card.Title`                                                                                                                                                                    |
| Body / description | `typography-body-md text-ws-static-subtle`                                                                                                                                                                  |
| Text colours       | `text-ws-static-strong` (headings, key values), `-base` (body), `-subtle` (secondary, metadata)                                                                                                             |
| Page padding       | `p-ws-12` (24px); page sections `gap-ws-16` (40px); inside a card `gap-ws-12` (24px)                                                                                                                        |
| Composed side rail | `w-[20rem]` (never under 18rem), `p-ws-12`; items `gap-ws-11`, parts of an item `gap-ws-3`; nothing touches the edge                                                                                        |
| Content width      | forms and reading `max-w-[40rem]`; composed pages `max-w-[80rem] mx-auto`; tables may fill                                                                                                                  |
| Wide windows       | past 1440px the frame (sidebar, top bar, edge panels) keeps filling the window; the content column stops at its cap and centres                                                                             |
| Side panel         | sections stack from the top with a section gap; never spread over the panel's height (`justify-between`, `mt-auto`)                                                                                         |
| Trailing edge      | counts, shortcuts, group actions and arrows in one column end on one right edge: use the `suffix` / `action` slots, not `absolute`                                                                          |
| Shortcut hints     | shown on hover and keyboard focus (`Sidebar.Item suffixOnHover`), never all the time                                                                                                                        |
| Row targets        | a row that does one thing is one button or link across the whole row: hover fill on the whole row, inset focus ring; never only its text                                                                    |
| Nested corners     | a shape around a round one is a pill, and its curve shares the centre: inset the round item by the same padding on every side (a coin in a picker, an avatar in a chip)                                     |
| Round controls     | a round control is round in every state: give the button itself the full radius, never a round wrapper around a square hover, press or focus ring                                                           |
| Shadows in flow    | cards inside a grey column or board take the lightest shadow (`shadow-ws-forms-base`); Elevation/Low and up are for raised surfaces (an inset page, a floating panel or bar)                                |
| Product mark       | one mark in every screen, its size set by the place (32px in a sidebar or top bar, 36px in a larger switcher), drawn with tokens so it inverts in dark                                                      |
| Primary action     | `<Button>` (primary, filled), one per view                                                                                                                                                                  |
| Secondary action   | `<Button variant="secondary" preset="border">`                                                                                                                                                              |
| Tertiary / in-row  | `preset="ghost"` or `IconButton` with an `aria-label`                                                                                                                                                       |
| Icon button size   | the height of the controls beside it, one height per bar: the screen's size (`md`; `sm` in a compact screen, where `Sidebar.Trigger` already is); `xs` only for actions inside a row, card or column header |
| Icons              | Remix line icons (`Ri…Line`), passed to the component; size comes from the control                                                                                                                          |

Pass the sizes in the first two rows explicitly: they are not those components' defaults.

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

- "bigger", "more touch-friendly", "for a kiosk / tablet" → every control `lg` (48px), body
  `typography-body-lg`, page padding one step up. See [sizing.md](references/sizing.md#large).
- "denser", "compact", "more on screen", a data tool or admin grid → every control `sm` (32px),
  Table `size="sm"`, gaps one step down. See [sizing.md](references/sizing.md#compact).
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
- Every text in `text-ws-static-strong`, or every label in uppercase

[review.md](references/review.md) adds the tells that show in layout and sizing.

## Workflow

1. **Decide before you build.** Write down in one line: the screen type (list, detail, form,
   dashboard, settings, flow, empty), its focal point, the size mode and the surface language.
2. **Compose from real components** using the `wideset-build` references; apply the rules above.
3. **Design the other states** (empty, loading, error, long content, narrow width, dark mode).
4. **Review** with [review.md](references/review.md): run the squint test and the scored
   checklist. Below 85% is not done; fix and re-check. Then run `wideset-review`.
5. **Report the decisions** you made (size mode, surface language, width) so a person can
   overrule them in one sentence.
