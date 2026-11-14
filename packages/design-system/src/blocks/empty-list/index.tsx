import { RiAddLine, RiSearchLine } from '@remixicon/react';
import { AppShell, Button, TextInput } from '@wideset/react';
import { useState } from 'react';

import { EmptyState } from './empty-state';
import { AppSidebar } from './sidebar';

/**
 * Empty list (Flat direction): Customers before the first record. The page keeps its frame, the
 * title with its primary action and the search, and the table's place holds the empty state: what
 * will appear and the two ways in. A search over it shows the other state, no results, with the
 * way back.
 */
export default function EmptyList() {
  const [query, setQuery] = useState('');
  const searched = query.trim();

  return (
    <AppShell direction="flat">
      <AppSidebar />
      <AppShell.Main className="flex flex-col">
        <header className="border-ws-static-subtle px-ws-12 shrink-0 border-b">
          <div className="h-ws-20 gap-ws-9 mx-auto flex w-full max-w-[80rem] items-center justify-between">
            <h1 className="typography-title-md text-ws-static-strong">Customers</h1>
            <Button size="sm">
              <Button.Icon icon={RiAddLine} />
              Add customer
            </Button>
          </div>
        </header>

        <div className="px-ws-12 min-h-0 flex-1 overflow-y-auto">
          <div className="gap-ws-9 py-ws-9 mx-auto flex h-full w-full max-w-[80rem] flex-col">
            <TextInput
              size="sm"
              className="w-[18rem] max-w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            >
              <TextInput.Prefix inner>
                <TextInput.Icon icon={RiSearchLine} />
              </TextInput.Prefix>
              <TextInput.Input
                type="search"
                placeholder="Search by name or domain"
                aria-label="Search customers"
              />
              <TextInput.Suffix inner>
                <TextInput.ClearButton />
              </TextInput.Suffix>
            </TextInput>

            {/* The table's place: the state sits a little above the middle of what is left. */}
            <div className="pb-ws-20 flex flex-1 items-center justify-center">
              {searched ? (
                <EmptyState
                  title={`No customers match “${searched}”`}
                  description="Search looks at company names and domains."
                >
                  <Button
                    size="sm"
                    variant="secondary"
                    preset="border"
                    onClick={() => setQuery('')}
                  >
                    Clear search
                  </Button>
                </EmptyState>
              ) : (
                <EmptyState
                  illustration="folder"
                  title="No customers yet"
                  description="The companies you work with appear here, with their plan, revenue, health and owner."
                >
                  <Button size="sm" variant="secondary" preset="border">
                    Import CSV
                  </Button>
                  <Button size="sm" variant="secondary" preset="border">
                    Add customer
                  </Button>
                </EmptyState>
              )}
            </div>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
