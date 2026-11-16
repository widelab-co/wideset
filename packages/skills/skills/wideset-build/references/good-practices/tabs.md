# Tabs

## When to use

- Content splits cleanly into peer groups (Overview / Members / Comments) and the user moves
  between them on the same page.
- A row of route-level sections inside a page, with the root `value` derived from the URL and `onValueChange` handling navigation.

## When not to use

- Picking one value or view mode that changes the current content in place (list vs grid,
  a filter) → `SegmentedControl`.
- App-level navigation between areas of the product → `Sidebar`.
- Showing where the page sits in a hierarchy → `Breadcrumbs`.
- Steps that must be done in order → `ProgressStepper`.
- Sections the user reads one after another or expands several at once → `Accordion`.

## Do / Don't

```tsx
import { Tabs } from '@wideset/react';
import { useLocation, useNavigate } from 'react-router-dom';

// Do: keep URL-driven selection and its content panels together.
function RoutingTabs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentTab = pathname === '/billing' ? 'billing' : 'overview';

  return (
    <Tabs
      value={currentTab}
      onValueChange={(value) => {
        if (value !== currentTab) navigate('/' + value);
      }}
    >
      <Tabs.List>
        <Tabs.Item value="overview">
          <Tabs.Label>Overview</Tabs.Label>
        </Tabs.Item>
        <Tabs.Item value="billing">
          <Tabs.Label>Billing</Tabs.Label>
        </Tabs.Item>
      </Tabs.List>
      <Tabs.Content value="overview">Overview content</Tabs.Content>
      <Tabs.Content value="billing">Billing content</Tabs.Content>
    </Tabs>
  );
}

// Don't: an icon passed as a bare child
<Tabs.Item value="x">
  <RiTeamLine />
</Tabs.Item>;
```

- Don't mix `size` or `type` between tab rows on one screen.
- Don't use `pills` for page sections; it reads as a filter.

## Gotchas

- `type` and `size` are set once on `Tabs`; items and list read them from context. There is no
  `type` on `Tabs.Item`.
- `divider={false}` has no effect on `pills` and `ghost`; they never draw it.
- `Tabs.List`, `Tabs.Item` and `Tabs.Count` throw outside `<Tabs>`.
- Animations follow `MotionProvider`; set `defaultMotion={false}` on `Tabs` to turn them off here.
