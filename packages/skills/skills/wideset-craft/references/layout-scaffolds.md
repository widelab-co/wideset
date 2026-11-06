# Layout scaffolds

Start from one of these. Each describes the layout you write; components fill it. The shell around them is the app-shell pattern in `wideset-build`, in the app's visual direction (Flat, Frame, Inset or Canvas; the directions pattern there). For a whole new app, start from the closest starting point instead (`https://wideset-docs.widelab.workers.dev/blocks.md`): a finished screen in its direction beats a scaffold.

## List page

For a collection: invoices, customers, projects.

```
Page header (title, count, primary action)
Filters row (TextInput search, FilterButton…)        gap-ws-12 below the header
Table                                                gap-ws-9 below the filters
Pagination
```

Selecting rows raises an `ActionBar`. A row opens a `Sidepanel` when context matters, or a page when the object is large. Empty, filtered-empty and loading states are separate designs.

## Detail page

For one object.

```
Breadcrumbs
Header (name, StatusBadge, actions at the right)
Tabs (when there are distinct sections)
Two columns: main content (wide, `max-w-[48rem]`), facts (narrow, about 20rem, Tile)
```

Use one column below `lg`. Do not add tabs for fewer than three sections.

## Settings page

```
Page title
Section heading + description (left)     Controls (right)     lg and up
Divider
Next section
```

Save per section with a footer `Button`, or apply instantly with `Switch`. Do not mix the two inside one section.

## Form page

A single column of `max-w-[40rem]`, sections separated by `ws-16`, the footer aligned with the fields. See the form-page pattern in `wideset-build`.

## Dashboard

Only when someone asked for one, in `max-w-[80rem] mx-auto`. A single row of three or four plain key figures (never a second row), then one or two main tables or panels, then a secondary feed. Order by decision, not by symmetry, and let sections differ in size. Wideset has no chart components: see [data.md](data.md).

## Modal content

Title, one sentence, the fields, the footer. Past three or four fields, or when the person needs the page behind it, use a `Sidepanel` or a page instead.

## Flow

A flow of several steps gets its own page. One question per step, Back on the far left, Continue on the right.

## Empty state

Centred inside its region: a short heading, one sentence on what appears here, one action. No illustration is better than a decorative one.
