---
name: Accordion
import: import { Accordion } from '@wideset/react'
group: layout
status: stable
parts:
  [
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionIcon,
    AccordionTitle,
    AccordionCaption,
    AccordionContent,
  ]
related: [Tabs, Card, Sidepanel]
docs: https://wideset.co/components/accordion
storybook: components-accordion--default
---

# Accordion

> Stacked sections the user opens in place, one or several at a time.

## When to use

- Long secondary content split into named sections: FAQs, settings groups, order details.
- The user scans section names first and opens only what they need.
- Several sections may be open together (`type="multiple"`).

## When not to use

- Peer sections that replace each other in one area → `Tabs`.
- Content everyone must read; don't hide it → plain sections with headings.
- A separate surface for one subject → `Card`.
- Detail of a record over the page → `Sidepanel`.
- Steps done in order → `ProgressStepper`.

## Anatomy

```tsx
<Accordion type="single" collapsible defaultValue="shipping">
  <Accordion.Item value="shipping">
    <Accordion.Trigger>
      <Accordion.Icon icon={RiTruckLine} />
      {/* optional, first */}
      <div className="flex flex-col">
        <Accordion.Title>Shipping</Accordion.Title>
        <Accordion.Caption>2–4 business days, free</Accordion.Caption>
        {/* optional */}
      </div>
    </Accordion.Trigger>
    <Accordion.Content>Orders leave the warehouse within two business days.</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

A plain string is enough inside `Accordion.Trigger`; use `Title` + `Caption` for two lines. The
chevron is drawn for you. Named exports (`AccordionItem`, …) are the same parts.

## Choosing props

| Prop                                       | Value                                        | Use for                                                          |
| ------------------------------------------ | -------------------------------------------- | ---------------------------------------------------------------- |
| `type` (required)                          | `single`                                     | One section open at a time.                                      |
|                                            | `multiple`                                   | Sections opened independently.                                   |
| `collapsible`                              | `true` (with `single`)                       | Lets the user close the open section.                            |
| `defaultValue` / `value` + `onValueChange` | `string` (`single`), `string[]` (`multiple`) | Uncontrolled / controlled open sections.                         |
| `contained`                                | `false` (default)                            | Divider-separated rows; inside a card or panel that frames them. |
|                                            | `true`                                       | Each section its own bordered card; standalone on a page.        |
| `disabled`                                 | on root or `Accordion.Item`                  | Lock all sections, or one (it keeps its open/closed state).      |

## States

- Hover, press, focus: live. `contained` sections also tint on hover.
- Disabled: dimmed; arrow keys skip it.

## Content

- Section titles: nouns, sentence case, one line.
- Caption: one short line that answers the question before opening (a time, a price, a count).
- Every section has an icon or none.

## Accessibility

- Radix gives the button, `aria-expanded`, `aria-controls` and arrow-key navigation.
- Title and caption both form the trigger's accessible name; keep the caption short.
- `Accordion.Icon` is hidden from screen readers.
- Triggers are not wrapped in headings. If the sections are part of the page outline, add a
  visible heading above the accordion; don't rely on triggers as headings.

## Do / Don't

```tsx
// Do: single + collapsible so the open section can be closed again
<Accordion type="single" collapsible>…</Accordion>

// Don't: Accordion.Title/Caption side by side — wrap them in a column
<Accordion.Trigger>
  <Accordion.Title>Shipping</Accordion.Title>
  <Accordion.Caption>Free</Accordion.Caption>   // lays out in a row
</Accordion.Trigger>
```

- Don't nest accordions.
- Don't put a `contained` accordion inside a bordered `Card`; use the default dividers.

## Gotchas

- `type` is required (Radix). Without `collapsible`, a `single` accordion can't be closed once open.
- `contained` and `defaultMotion` are set once on `Accordion`, not per item.
- `Accordion.Item`, `Accordion.Trigger` and `Accordion.Content` throw outside `<Accordion>`.
- Every `Accordion.Item` needs a unique `value`.

## API

Full props: `https://wideset.co/components/accordion.md` · Types:
`packages/design-system/src/components/accordion/Accordion.types.ts`
