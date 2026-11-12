// TODO(custom): page title row (title, actions) composed by hand.
import { RiAddLine } from '@remixicon/react';
import { Button, cn, Tabs } from '@wideset/react';

import { SEGMENTS } from './data';

/**
 * The page header: the title and the page's actions, then the segment tabs. The total is in the
 * table's footer; a tab takes a `Tabs.Count` only when the product asks for one. Render inside
 * `Tabs`. In Flat, Frame and Inset a line splits it from the list; in Canvas it sits on the grey
 * with no line (`line={false}`) and the list is a white section.
 */
export function PageHeader({ line = true }: { line?: boolean }) {
  return (
    <header className={cn('px-ws-12 shrink-0', line && 'border-ws-static-subtle border-b')}>
      <div className="gap-ws-9 pt-ws-12 mx-auto flex w-full max-w-[80rem] flex-col">
        <div className="gap-ws-9 flex flex-wrap items-center justify-between">
          <h1 className="typography-subtitle-md text-ws-static-strong">Customers</h1>
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
            </Tabs.Item>
          ))}
        </Tabs.List>
      </div>
    </header>
  );
}
