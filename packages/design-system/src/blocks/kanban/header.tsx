import {
  RiArrowDownSLine,
  RiChat1Line,
  RiEditLine,
  RiFilter3Line,
  RiFolder3Fill,
  RiSearchLine,
  RiSettings3Line,
} from '@remixicon/react';
import { Breadcrumbs, Button, IconButton, Tabs } from '@wideset/react';

import { breadcrumbs, views } from './data';

/** The page header: where the board sits and its actions, then the view tabs. Render inside `Tabs`. */
export function PageHeader() {
  return (
    <header className="border-ws-static-subtle shrink-0 border-b">
      <div className="border-ws-static-subtle h-ws-18 px-ws-11 flex items-center justify-between border-b">
        <Breadcrumbs separator="arrow">
          {breadcrumbs.map((crumb, index) => (
            <Breadcrumbs.Item key={crumb}>
              {index === 0 ? <RiFolder3Fill aria-hidden="true" className="size-ws-9" /> : null}
              {crumb}
            </Breadcrumbs.Item>
          ))}
        </Breadcrumbs>
        <div className="gap-ws-5 flex items-center">
          <Button variant="secondary" preset="border" size="sm">
            Share
          </Button>
          <Button variant="secondary" preset="border" size="sm">
            <Button.Icon icon={RiSettings3Line} />
            Settings
          </Button>
          <IconButton
            icon={RiChat1Line}
            variant="secondary"
            preset="ghost"
            size="sm"
            aria-label="Comments"
          />
        </div>
      </div>
      <div className="px-ws-11 flex items-center justify-between">
        <Tabs.List aria-label="Views">
          {views.map((view) => (
            <Tabs.Item key={view.value} value={view.value}>
              <Tabs.Label>{view.label}</Tabs.Label>
            </Tabs.Item>
          ))}
        </Tabs.List>
        <div className="gap-ws-5 flex items-center">
          <Button variant="secondary" preset="ghost" size="sm">
            <Button.Icon icon={RiSearchLine} />
            Search
          </Button>
          <Button variant="secondary" preset="ghost" size="sm">
            <Button.Icon icon={RiFilter3Line} />
            Filter
          </Button>
          <Button variant="secondary" preset="ghost" size="sm">
            <Button.Icon icon={RiEditLine} />
            Customize
          </Button>
          <IconButton
            icon={RiArrowDownSLine}
            variant="secondary"
            preset="ghost"
            size="sm"
            aria-label="More view options"
          />
        </div>
      </div>
    </header>
  );
}
