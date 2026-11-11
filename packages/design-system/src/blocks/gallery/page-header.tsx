// TODO(custom): page header (title, a line of description, search field on the right); no PageHeader in Wideset.
import { RiSearchLine } from '@remixicon/react';
import { TextInput } from '@wideset/react';

import { workspace } from './data';

type PageHeaderProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

/**
 * The page's title, what the library is for, and the search over every template. No filled
 * button here: the one primary action is adding a template, in its detail.
 */
export function PageHeader({ query, onQueryChange }: PageHeaderProps) {
  return (
    <header className="gap-ws-9 flex flex-wrap items-end justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">Templates</h1>
        <p className="typography-body-md text-ws-static-subtle">
          Playbooks, e-mail sequences, reports and dashboards, free to add to {workspace.name}.
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
        <TextInput.Input
          type="search"
          placeholder="Search templates"
          aria-label="Search templates"
        />
        <TextInput.Suffix inner>
          <TextInput.ClearButton aria-label="Clear search" />
        </TextInput.Suffix>
      </TextInput>
    </header>
  );
}
