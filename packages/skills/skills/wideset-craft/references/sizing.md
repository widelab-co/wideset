# Sizing: one control size per screen

## The rule

Every interactive control on a screen shares **one height**. The default is `md`: **40px**. Change
the size only when the person asks ("bigger", "denser") or the screen type demands it, and then
change it for the whole screen.

## Why

Height is the first thing the eye compares. A 32px filter next to a 40px search field next to a
48px button reads as three components that were never designed together, even when each one is
correct. One height makes a toolbar, a form row or a header read as one line, and it makes every
other decision (padding, icon size, type size) follow automatically, because Wideset pairs them per
size. Consistency is what reads as "designed"; variety in size reads as "assembled".

## The size map

Wideset's heights come from four tokens: `h-ws-forms-xs` 24px, `-sm` 32px, `-md` 40px, `-lg` 48px.
Not every component names its sizes the same way, and **not every default is `md`**. This table is
the "same height" row for each mode, with the `size` you must pass to get it:

| Component                                          | Default mode (40px)         | Compact (32px) | Large (48px) | Note                                                          |
| -------------------------------------------------- | --------------------------- | -------------- | ------------ | ------------------------------------------------------------- |
| Button, IconButton, SplitButton                    | `md` (default)              | `sm`           | `lg`         | `xs` (24px) only inside dense rows                            |
| TextInput, Select, MultiSelect, ComboBox, Textarea | `md` (default)              | `sm`           | `lg`         |                                                               |
| SegmentedControl                                   | `md` (default)              | `sm`           | `lg`         |                                                               |
| FilterButton                                       | `size="md"`                 | `sm` (default) | `lg`         | Its default is `sm` (32px): pass `md` next to 40px controls   |
| Chip                                               | `size="lg"` (40px)          | `md` (default) | —            | Its default `md` is 32px; `lg` is 40px                        |
| Tabs                                               | `size="lg"` for page tabs   | `sm` (default) | `lg`         | The default `sm` suits tabs inside a card or panel            |
| Table rows                                         | `sm` (default, 40px)        | `sm`           | `md` (48px)  | Row height matches the control height                         |
| Checkbox, RadioButton, Switch                      | `lg` (default)              | `sm`           | `lg`         | Label text matches the fields                                 |
| StatusBadge, Tag                                   | `md` (default)              | `sm`           | `lg`         | Badges are content, not controls; never match the 40px height |
| Avatar                                             | `md` in lists, `sm` in rows | `sm`           | `lg`         |                                                               |

Icons follow the control: pass the icon component and let the control size it; never set `size-*`
on an icon inside a control.

## Default mode

```tsx
// Do: one height across the toolbar; FilterButton is told to be 40px
<div className="gap-ws-5 flex items-center">
  <TextInput>
    <TextInput.Prefix inner>
      <TextInput.Icon icon={RiSearchLine} />
    </TextInput.Prefix>
    <TextInput.Input placeholder="Search orders" aria-label="Search orders" />
  </TextInput>
  <FilterButton size="md" label="Status" options={statusOptions} onChange={setStatus} />
  <Button variant="secondary" preset="border">Export</Button>
  <Button>New order</Button>
</div>

// Don't: FilterButton left at its default (32px) between 40px controls, a 48px button for emphasis
<div className="gap-ws-5 flex items-center">
  <TextInput placeholder="Search orders" aria-label="Search orders" />
  <FilterButton label="Status" options={statusOptions} onChange={setStatus} />
  <Button size="lg">New order</Button>
</div>
```

## Compact

For data tools, admin grids, dense side panels, and when someone asks for "denser" or "more on
the screen". Every control `sm` (32px), Table stays `sm`, Tabs `sm`, gaps one step down (`gap-ws-5`
→ `gap-ws-4` in toolbars, `gap-ws-12` → `gap-ws-9` between sections), body text stays
`typography-body-md` (do not shrink reading text to fit). `Chip` is `md` here, which is its default.

A compact region inside a default page is allowed when it is a self-contained tool: a Sidepanel
with a property list, a table toolbar. The rest of the page stays `md`.

## Large

For "bigger", touch-first, kiosk, tablet or accessibility-first requests. Every control `lg`
(48px), Tabs `lg`, Table `md`, page padding one step up (`p-ws-12` → `p-ws-14`), body
`typography-body-lg`. Large is a mode for the whole screen, never a way to emphasise one button:
emphasis is the primary colour, not size.

## Special cases

- **Inline actions in a table row or a list item**: ghost `IconButton` `size="sm"` or `xs`; the
  row, not the page, sets their scale.
- **Modal and Sidepanel footers**: the same size as the page they open from (`md` by default).
- **A single hero action** (empty state, result) stays `md`; centring and space make it the focal
  point, not a bigger size. The exception is the submit of a sign-in or sign-up card: Figma's Sign
  In draws it `lg` (48px) and full width under `md` fields, the only filled button on the screen.
- **Checkbox and Switch in a form** use `lg` (their default) so their label lines up with field
  values.

## Checks

- List every control's size on the screen: there is exactly one value (plus `sm`/`xs` for in-row
  actions).
- No control carries a `size` that differs from the screen's mode (Tabs `sm` inside a card is the
  exception).
- No `h-*`, `py-*` or `text-*` override on a control to fake a size.
