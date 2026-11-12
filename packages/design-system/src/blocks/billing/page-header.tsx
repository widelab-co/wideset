// TODO(custom): Breadcrumbs pulled left (-ml-ws-5) to line up with the title; Breadcrumbs has no flush option.
import { Breadcrumbs } from '@wideset/react';
import type { ReactNode } from 'react';

/** Where the page sits (Settings › Billing), its title and one line on the workspace's state. */
export function PageHeader({ summary }: { summary: ReactNode }) {
  return (
    <header className="gap-ws-5 flex flex-col">
      {/* The crumbs are padded pills: pull them back so their text starts on the title's edge. */}
      <Breadcrumbs separator="arrow" className="-ml-ws-5">
        <Breadcrumbs.Item asChild>
          <a href="#settings">Settings</a>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Billing</Breadcrumbs.Item>
      </Breadcrumbs>
      <div className="gap-ws-3 flex flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Billing</h1>
        <p className="typography-body-md text-ws-static-base">{summary}</p>
      </div>
    </header>
  );
}
