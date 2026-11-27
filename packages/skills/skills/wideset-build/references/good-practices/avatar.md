# Avatar

## When to use

- Next to a name: owners, assignees, authors, members.
- A row of people on a record (`Avatar.Group`, with `Avatar.More` for the rest).
- The AI agent as a participant (`agent`).

## When not to use

- A category or label → `Tag`.
- A status or count → `StatusBadge`.
- A file or product picture → an `img` in `Card.Media`, or `FileItem` for uploads.
- A decorative icon in a row → the Remix icon itself in `ListItem.Prefix`.

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
- A `row` group rings each avatar in the container colour, so the overlap reads as a gap on a
  container surface (a card, a panel). On any other background the ring shows as a halo. Set the grouped Avatar’s outline color to match its
  surface, for example `className="outline-ws-static-background"` on a background surface.
