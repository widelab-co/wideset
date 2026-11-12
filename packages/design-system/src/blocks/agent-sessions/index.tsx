import { cn } from '@wideset/react';
import { useId, useState } from 'react';

import { account, chatGroups, product, workspace } from './canon';
import { codeGroups, type CodeSession, NOW, repositories, type Repository } from './data';
import type { Mode } from './model';
import { PageHeader } from './page-header';
import { SelectionBar } from './selection-bar';
import { SessionsTable } from './sessions-table';
import { type FilterValues, SessionsToolbar } from './sessions-toolbar';
import { AgentSidebar } from './sidebar';
import { TopBar } from './top-bar';

/** One column of the page: the header, the toolbar and the list share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
const NO_FILTERS: FilterValues = { query: '', states: [] };
const GROUPS = { chat: chatGroups, code: codeGroups };

/** Every session of every repository, changed one by one; a repository left empty goes. */
const mapSessions = (
  all: Repository[],
  change: (sessions: CodeSession[]) => CodeSession[],
): Repository[] =>
  all
    .map((repository) => ({ ...repository, sessions: change(repository.sessions) }))
    .filter((repository) => repository.sessions.length > 0);

/**
 * The sessions that pass `keep`. A subagent goes with its parent when `withParent` says so (an
 * archived session takes its subagents along); one that stays while its parent goes is shown as
 * a session of its own, so it never reads as the child of the row above it.
 */
const keepSessions = (
  sessions: CodeSession[],
  keep: (session: CodeSession) => boolean,
  withParent = false,
) => {
  let parentKept = true;
  return sessions.flatMap((session) => {
    if (!session.child) parentKept = keep(session);
    if (!keep(session) || (withParent && !parentKept)) return [];
    return [{ ...session, child: session.child && parentKept }];
  });
};

/**
 * Agent sessions (Inset direction): every Code session in one place, in Tandem's shell with Code
 * mode on. The page in the card is a list to work through, not a dashboard: a title, a search and
 * a filter by state, then one card holding the sessions under their repositories. The sessions
 * that need you come first and are the tallest rows: each says what it asks and is answered where
 * it stands, so Allow once on the waiting approval is the screen's one filled button. Selecting
 * rows brings up Stop and Archive.
 *
 * The sidebar lists the same sessions; picking one there moves the focus to its row here. The
 * Chat | Code switch changes the sidebar's list only: this block is the one page.
 */
export default function AgentSessions() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<Mode>('code');
  const [all, setAll] = useState(repositories);
  const [filters, setFilters] = useState(NO_FILTERS);
  const [selected, setSelected] = useState<string[]>([]);

  const words = filters.query.trim().toLowerCase();
  const shown = mapSessions(all, (sessions) =>
    keepSessions(
      sessions,
      (session) =>
        (filters.states.length === 0 || filters.states.includes(session.state)) &&
        `${session.title} ${session.branch}`.toLowerCase().includes(words),
    ),
  );
  const picked = all
    .flatMap((repository) => repository.sessions)
    .filter((session) => selected.includes(session.id));

  const change = (ids: string[], next: (session: CodeSession) => CodeSession) =>
    setAll((current) =>
      mapSessions(current, (sessions) =>
        sessions.map((session) => (ids.includes(session.id) ? next(session) : session)),
      ),
    );

  /** An answer sets the session going again: it says what was answered and waits no more. */
  const answer = (id: string, said: string) =>
    change([id], ({ request, ...session }) => ({
      ...session,
      state: 'working',
      last:
        request?.kind === 'approval'
          ? `You ${said} \`${request.command}\``
          : `You answered: ${said}`,
      lastAt: NOW,
    }));

  /** Only a session at work or waiting can be stopped; it pauses where it is. */
  const stop = () => {
    change(selected, (session) =>
      session.state === 'working' || session.state === 'needs-you'
        ? { ...session, request: undefined, state: 'paused', last: 'Stopped by you', lastAt: NOW }
        : session,
    );
    setSelected([]);
  };

  const archive = () => {
    setAll((current) =>
      mapSessions(current, (sessions) =>
        keepSessions(sessions, (session) => !selected.includes(session.id), true),
      ),
    );
    setSelected([]);
  };

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <AgentSidebar
        id={sidebarId}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        product={product}
        workspace={workspace}
        account={account}
        mode={mode}
        onModeChange={setMode}
        groups={GROUPS[mode]}
        openId={null}
        // This page is the sidebar's All sessions.
        allOpen
        // A session picked in the sidebar is found in the list: the focus goes to its name.
        onOpen={(id) => document.getElementById(`session-${id}`)?.focus()}
        onNew={() => {}}
      />

      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          sidebarId={sidebarId}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          crumbs={['All sessions']}
        />

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <PageHeader />
            <section aria-label="Sessions" className="gap-ws-9 flex flex-col">
              <SessionsToolbar values={filters} onChange={setFilters} />
              <SessionsTable
                repositories={shown}
                selected={selected}
                onSelectedChange={setSelected}
                onAnswer={answer}
                onClearFilters={() => setFilters(NO_FILTERS)}
              />
            </section>
          </div>
        </div>
      </main>

      <SelectionBar
        count={picked.length}
        canStop={picked.some(({ state }) => state === 'working' || state === 'needs-you')}
        onClear={() => setSelected([])}
        onStop={stop}
        onArchive={archive}
      />
    </div>
  );
}
