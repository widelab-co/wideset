# Colour and surfaces

## One accent

### The rule

The brand colour marks **one thing per view: the primary action** (a filled `Button`, default
variant), plus whatever selected state a component draws itself (Tabs, SegmentedControl). A
selected row you build (the open item in a list, a picked card) is neutral, like the active
`Sidebar.Item`: `bg-ws-dynamic-tertiary-alpha-strong-default` and `text-ws-static-strong`, never
a brand tint. One look for "selected" on the whole screen, whatever the column.
Everything else is neutral: text in three greys, surfaces in two whites, borders in one line
colour. Status colours (positive, negative, notice, info) appear only to say a status, through the
components that carry them: `StatusBadge`, `InlineAlert`, `SystemAlert`, Toast, `Button
variant="danger"` for destructive actions.

### Why

A screen with a purple button, an orange badge, a green link and a blue highlight has four places
asking to be looked at, so it has none. With one accent the eye finds the next action instantly,
and status colours keep their meaning because they are not used for decoration.

### Do / don't

- Do: one filled primary per view; the second action `variant="secondary" preset="border"`.
- Do: links and inline actions as `LinkButton` or ghost buttons, not brand-coloured text you style.
- Don't: brand-coloured icons, headings, card borders or backgrounds "to add personality".
- Don't: a second filled primary in the same view. Two equal buttons mean you have not decided.
- Don't: status colour as decoration (a green "Active" heading, a red icon on a neutral setting).
- Don't: palette classes (`text-gray-600`, `bg-purple-500`) or hex. Only `ws` tokens, which also
  switch in dark mode.

The main call to action is the default `Button` (primary, brand colour). No near-black primary.

## Text colours

| Token                   | Use                                                     |
| ----------------------- | ------------------------------------------------------- |
| `text-ws-static-strong` | Titles, key values, the thing to read first             |
| `text-ws-static-base`   | Body text that is read in full                          |
| `text-ws-static-subtle` | Descriptions, metadata, secondary columns, placeholders |

Three levels; never `opacity-*` to make a fourth. In light mode `strong` and `base` are nearly the
same near-black, so they read as one step: the contrast that builds hierarchy is `strong` (or
`base`) against `subtle`, plus weight. Do not rely on `strong` versus `base` to rank two texts.

### What may be `strong`

`strong` is for what is read first, and there is little of it: the page title, section titles, the
title of each item in a list, and the key figures (a price, an error rate, a total). Names, alert
or file names inside a section, values beside a label in a header, and message authors are `base`;
labels and metadata are `subtle`. If a quarter of a screen's text is `strong`, nothing leads.

### Two colours carry a page

A calm page reads in two colours: `strong` for what you look for (titles, item names, figures, the
one column that matters) and `subtle` for everything that explains it (the lede under the title,
descriptions, labels, supporting numbers, metadata). Rank the explaining text by size, not by a
third grey: lede `typography-body-lg`, descriptions `typography-body-md`, metadata
`typography-caption-md`, all `subtle`. Keep `base` for text read in full inside content: field
values, messages, comments, the default table cell.

Report and detail pages, as a role map:

| Text                                         | Class                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| Page title                                   | `typography-subtitle-lg text-ws-static-strong`                                       |
| Lede under the title                         | `typography-body-lg text-ws-static-subtle`                                           |
| Section title                                | `typography-subtitle-xs text-ws-static-strong`                                       |
| Card or insight title                        | `typography-label-strong-md text-ws-static-strong`                                   |
| Card body, description                       | `typography-body-md text-ws-static-subtle`                                           |
| Figure label ("Active users")                | `typography-label-sm text-ws-static-subtle`                                          |
| Key figure                                   | `typography-subtitle-md text-ws-static-strong tabular-nums`                          |
| Change beside a figure                       | `StatusBadge` `positive` / `negative`, `size="sm"`, then "vs. last week" in `subtle` |
| Metadata, dates, axis and column labels      | `typography-caption-md text-ws-static-subtle`                                        |
| Table: item names / numbers / the key column | `strong` / `subtle tabular-nums` / `strong tabular-nums`                             |

## Status colour budget

A status colour says "act on this". Give it only to states that ask for action now (a failure, a
firing alert, the most severe level, an overdue item, a blocker). Lifecycle and routine states
(investigating, identified, monitoring, resolved, rolled back, live, lower severities) are neutral
`StatusBadge`s: their word carries the meaning. On a busy screen, if more than two hues of status
show, neutralise until one or two remain; the red that is left is then impossible to miss.

## Surfaces

### The rule

Pick **one surface language per screen**:

- **Layered** (default for product screens): the page canvas is `bg-ws-static-background`
  (off-white in light, the darkest grey in dark); content sits on `Card`s (`bg-ws-static-container`,
  white, bordered). Elevation means "this is a unit of content".
- **Flat**: one surface (`bg-ws-static-container`) and separation by space and section titles
  only. Good for forms, settings, reading pages and anything inside a Modal or Sidepanel.

### Why

Mixing the two — some content in cards, some floating on the canvas, a card inside a card — gives
the eye three depths to sort out. One language makes the structure obvious and the screen calm.

### Do / don't

- Do: on a layered page, put every block of content in a Card; nothing floats on the grey canvas
  except the page header.
- Do: inside a Card, separate groups with space and `Card.Header` / `Card.Content`, not with
  nested Cards.
- Don't: Card inside Card, Card inside Modal, or a Card with a single line of text.
- Don't: add shadows to Cards. Shadows (`shadow-ws-low`, `-medium`, `-high`) belong to things that
  float: menus, popovers, Modal, Toast, ActionBar. The components set them.
- Don't: tint section backgrounds (`bg-ws-static-highlight-*`) to group content; that is a
  hover or selected state, so it reads as interactive.

## Radius

Use the components' radii; do not override them. For your own containers: `rounded-ws-container-lg`
(16px, Card's) for content blocks, `rounded-ws-control-lg` (8px) for anything control-sized. A
container that holds controls with padding follows outer = inner + padding (a 16px outer radius
around 8px controls with 8px padding).

## Borders

`border-ws-static-base` (the default line), 1px, for dividers and container edges.
`border-ws-static-strong` only where a line must hold its own (a selected outline, a table header
underline the component sets). No dashed or coloured borders for decoration.

## Dark mode

Every screen is checked in dark (`.dark` on a parent). If you used only `ws` tokens it works
without changes; anything that breaks in dark is a hard-coded colour or a missing token. In dark,
layered surfaces get lighter as they rise (canvas darkest, cards lighter) — the tokens do this, do
not invert it.
