import { RiAddLine } from '@remixicon/react';
import { AppShell, Button, FilterButton, Select, Tabs } from '@wideset/react';
import { useState } from 'react';

import { KanbanColumn } from './board';
import { assigneeOptions, columns, sortOptions, teamOptions } from './data';
import { PageHeader } from './header';
import { KanbanSidebar } from './sidebar';

/** Kanban: a project board in the Flat direction, the sidebar and the page on one white surface. */
export default function Kanban() {
  const [teams, setTeams] = useState<string[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  // "Assigned to" narrows every column to the chosen people; a stack keeps its tasks with its person.
  const visibleColumns =
    assignees.length === 0
      ? columns
      : columns.map((column) => {
          const items = column.items.filter(
            (item) => item.assignee != null && assignees.includes(item.assignee.name),
          );
          return { ...column, items, count: items.length };
        });
  const [sort, setSort] = useState('newest');

  return (
    <AppShell direction="flat">
      <KanbanSidebar />
      <AppShell.Main className="flex flex-col">
        <Tabs defaultValue="board" divider={false} className="min-h-0 flex-1">
          <PageHeader />
          <Tabs.Content value="board" className="gap-ws-9 py-ws-7 flex min-h-0 flex-1 flex-col">
            <div className="gap-ws-5 px-ws-11 flex items-center">
              <FilterButton
                label="Team"
                placeholder="Team"
                options={teamOptions}
                value={teams}
                onChange={setTeams}
              />
              <FilterButton
                label="Assigned to"
                placeholder="Assigned to"
                options={assigneeOptions}
                value={assignees}
                onChange={setAssignees}
              />
              <Select
                size="sm"
                preset="ghost"
                aria-label="Sort tasks"
                options={sortOptions}
                value={sort}
                onValueChange={setSort}
                className="w-auto"
              />
              <Button variant="secondary" preset="border" size="sm" className="ml-auto">
                <Button.Icon icon={RiAddLine} />
                Create
              </Button>
            </div>
            <div className="gap-ws-9 px-ws-11 flex min-h-0 flex-1 overflow-x-auto">
              {visibleColumns.map((column) => (
                <KanbanColumn key={column.id} column={column} />
              ))}
            </div>
          </Tabs.Content>
        </Tabs>
      </AppShell.Main>
    </AppShell>
  );
}
