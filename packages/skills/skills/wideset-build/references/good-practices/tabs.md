# Tabs

## When to use

- Content splits cleanly into peer groups (Overview / Members / Comments) and the user moves
  between them on the same page.
- A row of route-level sections inside a page, rendered as router links (`asChild` + `active`).

## When not to use

- Picking one value or view mode that changes the current content in place (list vs grid,
  a filter) → `SegmentedControl`.
- App-level navigation between areas of the product → `Sidebar`.
- Showing where the page sits in a hierarchy → `Breadcrumbs`.
- Steps that must be done in order → `ProgressStepper`.
- Sections the user reads one after another or expands several at once → `Accordion`.

## Do / Don't

```tsx
// Do: router links keep the tab look through asChild + active
<Tabs.Item value="billing" asChild active={pathname === '/billing'}>
  <a href="/billing"><Tabs.Label>Billing</Tabs.Label></a>
</Tabs.Item>

// Don't: an icon passed as a bare child
<Tabs.Item value="x"><RiTeamLine /></Tabs.Item>
```

- Don't mix `size` or `type` between tab rows on one screen.
- Don't use `pills` for page sections; it reads as a filter.

## Gotchas

- `type` and `size` are set once on `Tabs`; items and list read them from context. There is no
  `type` on `Tabs.Item`.
- `divider={false}` has no effect on `pills` and `ghost`; they never draw it.
- With the divider, a `regular` list is full width so the line spans its container; the tabs
  stay left-aligned. To put tabs and an action in one row, set `divider={false}` and draw the
  line on the row.
- `Tabs.List`, `Tabs.Item` and `Tabs.Count` throw outside `<Tabs>`.
- Animations follow `MotionProvider`; set `defaultMotion={false}` on `Tabs` to turn them off here.
