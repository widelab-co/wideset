# Sizing: one control size per screen

## The rule

Every interactive control on a screen shares **one height**. The default is `sm`: **32px**, the
height Figma's Screens and the blocks draw. Change the size only when the person asks ("bigger",
"roomier", "touch") or the screen type demands it, and then change it for the whole screen.

## Why

Height is the first thing the eye compares. A 32px filter next to a 40px search field next to a
48px button reads as three components that were never designed together, even when each one is
correct. One height makes a toolbar, a form row or a header read as one line, and it makes every
other decision (padding, icon size, type size) follow automatically, because Wideset pairs them per
size. Consistency is what reads as "designed"; variety in size reads as "assembled".

32px is the default because product screens are working tools: it fits more content without
shrinking reading text, and it is what the Figma file draws.

## The size map

Wideset's heights come from four tokens: `h-ws-forms-xs` 24px, `-sm` 32px, `-md` 40px, `-lg` 48px.
Not every component names its sizes the same way, and **most component defaults are `md` (40px),
not the screen default**. This table is the "same height" row for each mode, with the `size` you
must pass to get it:

| Component                                          | Default (32px)              | Comfortable (40px)        | Large (48px) | Note                                                         |
| -------------------------------------------------- | --------------------------- | ------------------------- | ------------ | ------------------------------------------------------------ |
| Button, IconButton, SplitButton                    | `size="sm"`                 | `md` (default)            | `lg`         | `xs` (24px) only inside dense rows                           |
| TextInput, Select, MultiSelect, ComboBox, Textarea | `size="sm"`                 | `md` (default)            | `lg`         |                                                              |
| SegmentedControl                                   | `size="sm"`                 | `md` (default)            | `lg`         |                                                              |
| FilterButton                                       | `sm` (default)              | `size="md"`               | `lg`         |                                                              |
| Chip                                               | `md` (default, 32px)        | `size="lg"` (40px)        | —            |                                                              |
| Tabs                                               | `sm` (default)              | `size="lg"` for page tabs | `lg`         | Tabs inside a card or panel stay `sm` in every mode          |
| Table rows                                         | `sm` (default, 40px)        | `sm`                      | `md` (48px)  | `size="sm"` is the smallest Table                            |
| Checkbox, RadioButton, Switch                      | `sm`                        | `lg` (default)            | `lg`         | Label text matches the fields                                |
| StatusBadge, Tag                                   | `sm`                        | `md` (default)            | `lg`         | Badges are content, not controls; never match the row height |
| Avatar                                             | `md` in lists, `sm` in rows | the same                  | `lg`         |                                                              |

Icons follow the control: pass the icon component and let the control size it; never set `size-*`
on an icon inside a control.

## Default

```tsx
// Do: one 32px height across the toolbar; the components that default to 40px are told sm
<div className="gap-ws-5 flex items-center">
  <TextInput size="sm">
    <TextInput.Prefix inner>
      <TextInput.Icon icon={RiSearchLine} />
    </TextInput.Prefix>
    <TextInput.Input placeholder="Search orders" aria-label="Search orders" />
  </TextInput>
  <FilterButton label="Status" options={statusOptions} onChange={setStatus} />
  <Button size="sm" variant="secondary" preset="border">Export</Button>
  <Button size="sm">New order</Button>
</div>

// Don't: Button and TextInput left at their 40px default beside a 32px FilterButton,
// a 48px button for emphasis
<div className="gap-ws-5 flex items-center">
  <TextInput placeholder="Search orders" aria-label="Search orders" />
  <FilterButton label="Status" options={statusOptions} onChange={setStatus} />
  <Button size="lg">New order</Button>
</div>
```

## Denser

When someone asks for "denser" or "more on the screen", the controls are already 32px: keep them,
take the gaps one step down (`gap-ws-5` → `gap-ws-4` in toolbars, `gap-ws-12` → `gap-ws-9` between
sections). Body text stays `typography-body-md`
(do not shrink reading text to fit).

## Comfortable

For "bigger", "roomier", "more comfortable", or a screen used rarely by people outside the
product (a public form, a one-time setup). Every control `md` (40px): leave Button, fields and
SegmentedControl at their defaults, `FilterButton size="md"`, `Chip size="lg"`, page `Tabs
size="lg"`, Checkbox and Switch at their `lg` default.

## Large

For touch-first, kiosk, tablet or accessibility-first requests. Every control `lg` (48px), Tabs
`lg`, Table `md`, page padding one step up (`p-ws-12` → `p-ws-14`), body `typography-body-lg`.
Large is a mode for the whole screen, never a way to emphasise one button: emphasis is the primary
colour, not size.

## Special cases

- **Inline actions in a table row or a list item**: ghost `IconButton` `size="xs"`; the row, not
  the page, sets their scale.
- **Modal and Sidepanel footers**: the same size as the page they open from (`sm` by default).
- **A single hero action** (empty state, result) stays at the screen's size; centring and space
  make it the focal point, not a bigger size.
- **Sign-in and sign-up** follow Figma's Sign In, not the default: `md` (40px) fields and a `lg`
  (48px) full-width submit, the only filled button on the screen.
- **Checkbox and Switch in a form** take the size that lines their label up with the field values
  (`sm` beside 32px fields, `lg` beside 40px ones).

## Checks

- List every control's size on the screen: there is exactly one value (plus `xs` for in-row
  actions).
- Every Button, IconButton, SplitButton, field and SegmentedControl carries `size="sm"`, unless
  the screen is in another mode.
- No control carries a `size` that differs from the screen's mode (Tabs `sm` inside a card is the
  exception).
- No `h-*`, `py-*` or `text-*` override on a control to fake a size.
