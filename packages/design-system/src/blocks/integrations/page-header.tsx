// TODO(custom): page header (title, a line of description, search field on the right); no PageHeader in Wideset.
import { RiSearchLine } from '@remixicon/react';
import { TextInput } from '@wideset/react';

import { WORKSPACE } from './data';

type PageHeaderProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

/** The page's title, what the page is for, and the search over every app. */
export function PageHeader({ query, onQueryChange }: PageHeaderProps) {
  return (
    <header className="gap-ws-9 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Integrations</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Connect the tools {WORKSPACE.name} already uses. Orbit syncs them every 15 minutes.
        </p>
      </div>
      <TextInput
        size="sm"
        className="w-[20rem] max-w-full"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      >
        <TextInput.Prefix inner>
          <TextInput.Icon icon={RiSearchLine} />
        </TextInput.Prefix>
        <TextInput.Input type="search" placeholder="Search apps" aria-label="Search apps" />
        <TextInput.Suffix inner>
          <TextInput.ClearButton aria-label="Clear search" />
        </TextInput.Suffix>
      </TextInput>
    </header>
  );
}
