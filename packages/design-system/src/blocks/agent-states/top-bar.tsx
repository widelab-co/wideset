import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, IconButton } from '@wideset/react';
import type { ReactNode } from 'react';

type TopBarProps = {
  sidebarId: string;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  /** Where you are, outermost first: the project or repository, then the thread. */
  crumbs: string[];
  /**
   * More about where the work happens, after the crumbs: a branch and the one it goes into. It
   * is the first to give way: it shows only while the bar is wide enough for it.
   */
  meta?: ReactNode;
  /** The thread's actions, at the right end. */
  children?: ReactNode;
};

/**
 * The bar at the top of the session's half of the card. It belongs to the surround: edge to
 * edge, 48px, a line under it that meets the line of the pane's bar across the divider. The
 * sidebar's toggle is pulled left so its glyph, not its box, sits 20px from the edge; then where
 * you are; the actions at the far end. Nothing in it wraps: the thread's name, the last crumb,
 * truncates, and `meta` leaves when the bar is narrower than 44rem, so the name and the actions
 * always have their room.
 */
export function TopBar({
  sidebarId,
  collapsed,
  onCollapsedChange,
  crumbs,
  meta,
  children,
}: TopBarProps) {
  return (
    <header className="h-ws-18 border-ws-static-base gap-ws-5 px-ws-11 @container flex shrink-0 items-center border-b">
      <IconButton
        icon={RiSideBarLine}
        variant="secondary"
        preset="ghost"
        size="sm"
        iconClassName="text-ws-static-subtle size-ws-9"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        aria-controls={sidebarId}
        onClick={() => onCollapsedChange(!collapsed)}
        className="-ml-ws-5 shrink-0"
      />
      {/* Only the last crumb gives way: its list item may shrink, and its text truncates. */}
      <Breadcrumbs separator="arrow" className="min-w-0 [&_li:last-child]:min-w-0 [&_ol]:min-w-0">
        {crumbs.map((crumb, index) =>
          index < crumbs.length - 1 ? (
            <Breadcrumbs.Item key={crumb} asChild>
              <a href={`#${crumb.toLowerCase().replace(/\s+/g, '-')}`}>{crumb}</a>
            </Breadcrumbs.Item>
          ) : (
            <Breadcrumbs.Item key={crumb} className="min-w-0">
              <span className="px-ws-2 truncate">{crumb}</span>
            </Breadcrumbs.Item>
          ),
        )}
      </Breadcrumbs>
      {meta && (
        <div className="typography-caption-md text-ws-static-subtle gap-ws-3 hidden min-w-0 items-center @min-[44rem]:flex">
          {meta}
        </div>
      )}
      <div className="gap-ws-3 ml-auto flex shrink-0 items-center">{children}</div>
    </header>
  );
}
