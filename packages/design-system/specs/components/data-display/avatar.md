---
name: Avatar
import: import { Avatar } from '@wideset/react'
group: data-display
status: stable
parts:
  [
    Avatar,
    AvatarGroup,
    AvatarMore,
    AvatarImage,
    AvatarInitials,
    AvatarIcon,
    AvatarAgent,
    AvatarStatus,
  ]
related: [ListItem, Table, Tag]
docs: https://wideset.co/components/avatar
storybook: components-avatar--default
---

# Avatar

> A person, a team or an agent, shown as a photo, initials, an icon or the agent orb.

## When to use

- Next to a name: owners, assignees, authors, members.
- A row of people on a record (`Avatar.Group`, with `Avatar.More` for the rest).
- The AI agent as a participant (`agent`).

## When not to use

- A category or label → `Tag`.
- A status or count → `StatusBadge`.
- A file or product picture → an `img` in `Card.Media`, or `FileItem` for uploads.
- A decorative icon in a row → the Remix icon itself in `ListItem.Prefix`.

## Anatomy

```tsx
<Avatar src={user.photo} alt="" initials="AK" />   {/* photo, initials if it fails */}
<Avatar initials="TS" />                           {/* monogram, colour from the initials */}
<Avatar icon={<RiRobot2Line />} />                  {/* custom glyph */}
<Avatar agent />                                   {/* agent orb */}
<Avatar />                                         {/* default user icon */}

<Avatar.Group size="sm">
  <Avatar initials="AK" />
  <Avatar initials="TS" />
  <Avatar.More>+8</Avatar.More>
</Avatar.Group>
```

The content mode follows the prop you pass; you don't compose `Avatar.Image` / `Avatar.Initials`
yourself. Named exports (`AvatarGroup`, `AvatarMore`, …) are the same parts for Server Components.

## Choosing props

| Prop             | Value                                      | Use for                                                    |
| ---------------- | ------------------------------------------ | ---------------------------------------------------------- |
| `size`           | `md` (default)                             | Lists and comments.                                        |
|                  | `xs` / `sm`                                | Table cells, chips, menus (`sm` in a `sm` Table).          |
|                  | `lg` / `xl` / `2xl`                        | Profile headers and cards where the person is the subject. |
| `shape`          | `round` (default)                          | A person.                                                  |
|                  | `square`                                   | Anything else: team, workspace, company.                   |
| `status`         | `online` / `offline` / `unavailable`       | Presence only.                                             |
| `color`          | `brand`, `blue`, `teal`, … (`AvatarColor`) | Pin initials' colour for a team or shared inbox.           |
| `selected`       | `true`                                     | The picked avatar, e.g. current assignee in a picker.      |
| `onClick`        | handler                                    | Makes the avatar a button (`role="button"`, focusable).    |
| `layout` (Group) | `row` (default) / `grid`                   | Overlapping single line, or wrapped grid.                  |

`size` and `shape` on `Avatar.Group` apply to every avatar and `Avatar.More` inside.

## States

- `status` dot: presence, announced by its name.
- `selected`: a ring around the avatar.
- Image failure: falls back to `initials`, or to `fallback`.

## Content

- Initials: one or two letters, uppercase. At `xs` and `sm` only the first letter is drawn, as in
  Figma: pass the full initials anyway, the avatar picks.
- `Avatar.More` label is its children: `+8` for an overflow count, an icon for an action. It
  counts nothing; render the avatars you want shown and pass the rest as the label.
- Show the name in text next to a single avatar; the avatar supports the name, never replaces it.

## Accessibility

- A photo's `alt` defaults to `""` (decorative). When no name is in nearby text, set `alt` to it.
- Don't repeat the presence in text; the status dot is announced.
- `Avatar.More` with `onClick` is a `<button>`; icon-only needs `aria-label` ("Add member").
  Without `onClick` it is plain text.
- `agent` reads "Agent" unless you pass `alt`.
- The default user icon and a custom `icon` are decorative. To name such an avatar, put
  `aria-label` on `Avatar`; it is then exposed as an image with that name.

## Do / Don't

```tsx
// Do: an action at the end of a group
<Avatar.Group>
  <Avatar initials="AK" />
  <Avatar.More aria-label="Add member" onClick={invite}><RiAddLine /></Avatar.More>
</Avatar.Group>

// Don't: mix content props — they are mutually exclusive (type error)
<Avatar src={url} icon={<RiUserLine />} />
```

- Don't set `size` per avatar inside a group; set it on the group.
- Don't use `square` for a person or `round` for a company.

## Gotchas

- The `icon` prop takes an element (`icon={<RiRobot2Line />}`), unlike `Tag.Icon`, which takes
  the component.
- `src`, `initials` (alone), `icon` and `agent` are a discriminated union; `initials` next to
  `src` is the fallback, not a second mode.
- Initials colour is derived from the initials; inside `Avatar.Group` colours are spread so
  duplicates differ. Pass `color` only to pin it.

## API

Full props: `https://wideset.co/components/avatar.md` · Types:
`packages/design-system/src/components/avatar/Avatar.types.ts`
