# Hierarchy in practice

## Reading ladder

The roles, classes and sizes are in [typography.md](typography.md). In short: one 32px page title (`typography-title-md`), card and section titles at 16px (`typography-subtitle-xs`), body and values in `typography-body-md`, labels and metadata quieter in `text-ws-static-subtle`. Skip a level rather than inventing one. Two sizes and three colours (look for, read, label) are enough for most screens.
Which texts may be `strong`, and why `strong` versus `base` does not rank anything: see
[surfaces.md](surfaces.md#what-may-be-strong).

## List rows

A selectable row in a list (an inbox, a list of incidents, orders or chats) is a title and **at
most one line of metadata** under it: the title in `typography-label-strong-sm
text-ws-static-strong`, the metadata in `typography-caption-md text-ws-static-subtle`, a badge at
the start of that line when the row has a status. Ids, tags, owners and everything else live in
the detail the row opens, not in the row. Three lines per row (meta, title, meta) turns the list
into grey noise and hides the titles it exists to show.

## Page heading

```tsx
import { RiAddLine } from '@remixicon/react';
import { Button } from '@wideset/react';

export function PageHeader() {
  return (
    <header className="gap-ws-9 flex items-start justify-between">
      <div className="gap-ws-3 flex flex-col">
        <h1 className="typography-title-md text-ws-static-strong">Invoices</h1>
        <p className="typography-body-md text-ws-static-base">
          142 open, 18 overdue. Totals are in your billing currency.
        </p>
      </div>
      <Button size="sm">
        <Button.Icon icon={RiAddLine} />
        New invoice
      </Button>
    </header>
  );
}
```

The description is useful, not a greeting. The one filled button is the job of the page.

## Metrics

A metric needs comparison to mean anything. Prefer a single row of plain numbers with labels and a delta to a set of decorated cards. If a number drives no decision, remove it.

Tables, numbers and key figures: see [data.md](data.md). Actions: see [components-and-actions.md](components-and-actions.md).
