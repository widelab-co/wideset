import { RiAddLine } from '@remixicon/react';
import { Button, StatusBadge, Tabs } from '@wideset/react';

import { type Customer, SEGMENTS } from './data';

/**
 * The page header: the title with the total and the page's actions, then the segment tabs with
 * their counts. Render inside `Tabs`; the line under it splits it from the list (Flat).
 */
export function PageHeader({ customers }: { customers: Customer[] }) {
  return (
    <header className="border-ws-static-subtle px-ws-12 shrink-0 border-b">
      <div className="gap-ws-9 pt-ws-12 mx-auto flex w-full max-w-[80rem] flex-col">
        <div className="gap-ws-9 flex flex-wrap items-center justify-between">
          <div className="gap-ws-5 flex items-center">
            <h1 className="typography-subtitle-md text-ws-static-strong">Customers</h1>
            <StatusBadge size="lg" shape="rounded">
              {customers.length}
            </StatusBadge>
          </div>
          <div className="gap-ws-5 flex items-center">
            <Button variant="secondary" preset="border" size="sm">
              Import
            </Button>
            <Button variant="secondary" preset="border" size="sm">
              Export
            </Button>
            <Button size="sm">
              <Button.Icon icon={RiAddLine} />
              Add customer
            </Button>
          </div>
        </div>
        <Tabs.List aria-label="Segments">
          {SEGMENTS.map((segment) => (
            <Tabs.Item key={segment.value} value={segment.value}>
              <Tabs.Label>{segment.label}</Tabs.Label>
              <Tabs.Count>{customers.filter(segment.match).length}</Tabs.Count>
            </Tabs.Item>
          ))}
        </Tabs.List>
      </div>
    </header>
  );
}
