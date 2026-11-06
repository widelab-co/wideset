# List with search and filters

> A page of records the user narrows with a search field and filters, then pages through.

## Problem

Users need to find a few records among many: type to search, filter by a fixed attribute, see
how many match, page through, and understand an empty result. Wideset gives the parts
(`Table`, a search field composed from `TextInput`, `FilterButton`, `Pagination`); filtering,
sorting and paging are your state. There is no empty-state, skeleton or spinner component.

## Structure

```
section                                   — flex column, gap-ws-9
├ toolbar (div, flex-wrap, gap-ws-5)
│ ├ TextInput (search composition)        — Prefix inner + Icon, Input type="search", Suffix inner + ClearButton
│ ├ FilterButton                          — one per filterable attribute
│ └ p role="status"                       — result count, ml-auto
├ Table                                    — or a ul of ListItems for one-line records
│ └ Table.Body                            — rows | loading row | empty row (one cell, colSpan)
└ Pagination                              — only when there is more than one page
```

## Example

```tsx
import { RiSearchLine } from '@remixicon/react';
import { Button, FilterButton, Pagination, StatusBadge, Table, TextInput } from '@wideset/react';
import { useState } from 'react';

type Status = 'active' | 'paused' | 'archived';
type Project = { id: string; name: string; owner: string; status: Status };

const STATUS = {
  active: { label: 'Active', color: 'positive' },
  paused: { label: 'Paused', color: 'notice' },
  archived: { label: 'Archived', color: 'neutral' },
} as const;
const PAGE_SIZE = 10;

export function ProjectList({ projects, loading }: { projects: Project[]; loading: boolean }) {
  const [query, setQuery] = useState('');
  const [statuses, setStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();
  const filtered = projects.filter(
    (p) => p.name.toLowerCase().includes(q) && (!statuses.length || statuses.includes(p.status)),
  );
  const pagesCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = q !== '' || statuses.length > 0;
  const clearFilters = () => {
    setQuery('');
    setStatuses([]);
    setPage(1);
  };

  return (
    <section className="gap-ws-9 flex flex-col">
      <div className="gap-ws-5 flex flex-wrap items-center">
        <TextInput
          className="w-[20rem] max-w-full"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
        >
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input
            type="search"
            placeholder="Search projects"
            aria-label="Search projects"
          />
          <TextInput.Suffix inner>
            <TextInput.ClearButton />
          </TextInput.Suffix>
        </TextInput>
        <FilterButton
          label="Status"
          placeholder="Status"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused' },
            { value: 'archived', label: 'Archived' },
          ]}
          value={statuses}
          onChange={(next) => {
            setStatuses(next);
            setPage(1);
          }}
        />
        <p role="status" className="typography-body-sm text-ws-static-subtle ml-auto">
          {loading ? 'Loading projects…' : `${filtered.length} projects`}
        </p>
      </div>

      <Table aria-busy={loading || undefined}>
        <Table.Head>
          <Table.Row>
            <Table.Header>Project</Table.Header>
            <Table.Header>Owner</Table.Header>
            <Table.Header>Status</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={3} align="center">
                Loading projects…
              </Table.Cell>
            </Table.Row>
          ) : rows.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={3} align="center">
                <div className="gap-ws-5 py-ws-12 flex flex-col items-center">
                  <p className="typography-body-md text-ws-static-subtle">
                    {hasFilters ? 'No projects match your search or filters.' : 'No projects yet.'}
                  </p>
                  {hasFilters && (
                    <Button variant="secondary" preset="border" size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          ) : (
            rows.map((p) => (
              <Table.Row key={p.id}>
                <Table.Cell>{p.name}</Table.Cell>
                <Table.Cell>{p.owner}</Table.Cell>
                <Table.Cell>
                  <StatusBadge color={STATUS[p.status].color}>{STATUS[p.status].label}</StatusBadge>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      {pagesCount > 1 && (
        <Pagination pagesCount={pagesCount} activePage={page} onChangeActivePage={setPage} />
      )}
    </section>
  );
}
```

## Variants

- **Sorting.** `sortable`, `sortDirection` and `onSort` on `Table.Header`; sort before slicing
  and go back to page 1.
- **Rows per page.** `rowsPerPageOptions={[10, 25, 50]}` with `itemsPerPage` +
  `onChangeItemsPerPage` on `Pagination`; reset `activePage` to 1 when the size changes.
- **Compact paging.** `type="overflow"` on `Pagination` for narrow areas.
- **Bulk actions.** `selectionMode="multiple"` on `Table`, a `Checkbox` per row, `selected` on
  each `Table.Row`; selection is an array of ids you keep. `ActionBar` can carry the bulk actions.
- **Long tables.** `stickyHeader` inside a `ScrollArea` with a `max-h-[…]`.
- **One-line records** (files, people). A `ul` of `li` > `ListItem` inside a `Card` instead of
  `Table`. ListItem always looks clickable; if rows open something, prefer `ActionTile`.
- **Server-side data.** Same structure; `pagesCount` comes from the server total, and `loading`
  is true while a page or filter request runs. Keep the previous rows visible if you prefer and
  only set `aria-busy`.
- **Row detail.** See [detail-in-sidepanel](detail-in-sidepanel.md).

## Accessibility

- The search input needs `aria-label` (or a visible label); `type="search"` gives the search
  semantics and the mobile search key.
- Announce the result count in a `role="status"` element so screen reader users hear that the
  list changed.
- `FilterButton` lists the chosen values in its trigger; its clear button is labelled by
  `clearFilterAriaLabel` (default "Clear filter").
- Set `aria-busy` on the table while loading; say "Loading…" in text, not only visually.
- Pagination is a `nav`; rename it with `navigationAriaLabel` when a page has two.

## Anti-patterns

- The deprecated `Search` component; compose `TextInput` as above.
- `Chip`s or `SegmentedControl` as a multi-value filter in a toolbar; use `FilterButton`
  (`MultiSelect` in a form).
- Leaving the page number past the end after a filter narrows the list.
- An empty table body with no message, or the same message for "no data yet" and "no matches".
- Rendering hundreds of rows without `Pagination` or virtualization.
- A clickable row (`interactive` + `onClick`) as the only way to reach the detail; keyboard
  users need a real control in the row.
