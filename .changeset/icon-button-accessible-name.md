---
'@wideset/react': minor
---

**Breaking:** Require either `aria-label` or `aria-labelledby` on IconButton and remove the redundant `IconButton.Icon`, `IconButtonIcon`, and `IconButtonIconProps` exports. The naming requirement also applies when using `asChild`, and to TextInput.IconButton and Toast.IconAction.

Add an accessible action name to previously unnamed buttons:

```tsx
// Before
<IconButton icon={RiCloseLine} />

// After
<IconButton icon={RiCloseLine} aria-label="Close" />
```

Alternatively, use `aria-labelledby` to reference an element containing the action name. With `asChild`, pass the naming attribute to IconButton so it is forwarded to the child element.

Pass the icon through IconButton's required `icon` prop instead of composing `IconButton.Icon`. For uses of the removed alias inside a regular Button, use `Button.Icon` or the named `ButtonIcon` export and `ButtonIconProps` type.
