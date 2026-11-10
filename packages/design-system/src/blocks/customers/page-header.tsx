// TODO(custom): page title row (title, count, actions) composed by hand.
import { RiAddLine } from '@remixicon/react';
import { Button, cn, StatusBadge, Tabs } from '@wideset/react';

import { type Customer, SEGMENTS } from './data';

/**
 * The page header: the title with the total and the page's actions, then the segment tabs with
 * their counts. Render inside `Tabs`. In Flat, Frame and Inset a line splits it from the list; in
 * Canvas it sits on the grey with no line (`line={false}`) and the list is a white section.
 */
export function PageHeader({ customers, line = true }: { customers: Customer[]; line?: boolean }) {
  return (
    <header className={cn('px-ws-12 shrink-0', line && 'border-ws-static-subtle border-b')}>
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
