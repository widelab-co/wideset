---
'@wideset/react': minor
'@wideset/skills': patch
---

`Switch`: `className` now lands on the switch control, the same element as `ref` and the other props, and the new `wrapperClassName` styles the row around it. `label` and children are mutually exclusive in the types. `Switch.Description` (`SwitchDescription`) adds supporting text under a composed label and is announced as the switch's description (`aria-describedby`, merged with a caller's value).

**Breaking:** classes that laid out the row through `className` (`w-full justify-between`) now style the control: move them to `wrapperClassName`. Passing both `label` and children is a type error (the label used to win and children were dropped). `SwitchProps` is now a union, so `interface X extends SwitchProps` fails (TS2312): use a type alias.

```tsx
// before
<Switch className="w-full justify-between" label="Email notifications" />;
interface SettingProps extends SwitchProps {
  hint?: string;
}

// after
<Switch wrapperClassName="w-full justify-between" label="Email notifications" />;
type SettingProps = SwitchProps & { hint?: string };
```
