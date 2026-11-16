import { RiSearchLine, RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, Button, IconButton } from '@wideset/react';
import { useEffect, useId, useState } from 'react';

import { CommandPalette } from './command-palette';
import { type Command, commands, recentAtStart, suggested } from './data';
import { HomePage } from './home-page';
import { WorkspaceSidebar } from './sidebar';

/** How many recent items the empty palette lists. */
const RECENT_LIMIT = 4;

/** ⌘ on Apple keyboards, Ctrl elsewhere; both open the palette everywhere. */
const MODIFIER =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl';

/**
 * Command palette (panel over Home, Inset direction): Ctrl+K or ⌘K anywhere, the search control in
 * the page bar or the sidebar's search field open it. Running a page, customer or deal moves it to
 * the top of Recent; a starting point has nowhere to go, so running only closes the palette.
 */
export default function CommandPaletteBlock() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(true);
  const [recent, setRecent] = useState(recentAtStart);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen((current) => !current);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const run = (command: Command) => {
    if (command.group !== 'Actions') {
      setRecent((current) =>
        [command.id, ...current.filter((id) => id !== command.id)].slice(0, RECENT_LIMIT),
      );
    }
    setOpen(false);
  };

  return (
    <AppShell direction="inset">
      <WorkspaceSidebar
        id={sidebarId}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        onSearch={() => setOpen(true)}
      />
      <AppShell.Main>
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSideBarLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item>Home</Breadcrumbs.Item>
            </Breadcrumbs>
            {/* The palette's door in the bar, with its shortcut, so it can be found by sight. */}
            <Button
              variant="secondary"
              preset="ghost"
              size="sm"
              aria-haspopup="dialog"
              aria-keyshortcuts="Control+K Meta+K"
              onClick={() => setOpen(true)}
              className="-mr-ws-5 ml-auto"
            >
              <Button.Icon icon={RiSearchLine} />
              Search
              <span className="text-ws-static-subtle">{`${MODIFIER} K`}</span>
            </Button>
          </div>
        </div>

        <HomePage />
      </AppShell.Main>

      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        commands={commands}
        recent={recent}
        suggested={suggested}
        onRun={run}
      />
    </AppShell>
  );
}
