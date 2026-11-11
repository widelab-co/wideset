import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, IconButton } from '@wideset/react';
import type { ReactNode } from 'react';

type TopBarProps = {
  sidebarId: string;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  /** Where you are, outermost first: the project or repository, then the thread. */
  crumbs: string[];
  /** The thread's actions, at the right end. */
  children?: ReactNode;
};

/**
 * The bar at the top of the session's half of the card. It belongs to the surround: edge to
 * edge, 48px, a line under it that meets the line of the pane's bar across the divider. The
 * sidebar's toggle is pulled left so its glyph, not its box, sits 20px from the edge; then where
 * you are; the actions at the far end.
 */
export function TopBar({ sidebarId, collapsed, onCollapsedChange, crumbs, children }: TopBarProps) {
  return (
    <header className="h-ws-18 border-ws-static-base gap-ws-5 px-ws-11 flex shrink-0 items-center border-b">
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
        className="-ml-ws-5"
      />
      <Breadcrumbs separator="arrow" className="min-w-0">
        {crumbs.map((crumb, index) =>
          index < crumbs.length - 1 ? (
            <Breadcrumbs.Item key={crumb} asChild>
              <a href={`#${crumb.toLowerCase().replace(/\s+/g, '-')}`}>{crumb}</a>
            </Breadcrumbs.Item>
          ) : (
            <Breadcrumbs.Item key={crumb}>{crumb}</Breadcrumbs.Item>
          ),
        )}
      </Breadcrumbs>
      <div className="gap-ws-3 ml-auto flex shrink-0 items-center">{children}</div>
    </header>
  );
}
