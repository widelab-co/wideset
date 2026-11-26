---
'@wideset/react': minor
---

**Breaking:** Remove `Tabs.Item.active`; control selection through `Tabs.value` instead so styling, the indicator, and `aria-selected` share the same state. Add ref forwarding to Tabs, Tabs.List, Tabs.Item, and Tabs.Label.

Move selection from the individual item's `active` prop to the root's `value`:

```tsx
// Before
<Tabs>
  <Tabs.List>
    <Tabs.Item value="overview" active={selectedTab === 'overview'}>Overview</Tabs.Item>
    <Tabs.Item value="billing" active={selectedTab === 'billing'}>Billing</Tabs.Item>
  </Tabs.List>
</Tabs>

// After — selectedTab and setSelectedTab come from your component's state.
<Tabs value={selectedTab} onValueChange={setSelectedTab}>
  <Tabs.List>
    <Tabs.Item value="overview">Overview</Tabs.Item>
    <Tabs.Item value="billing">Billing</Tabs.Item>
  </Tabs.List>
</Tabs>
```

Uncontrolled tabs continue to use `defaultValue` on the root.
