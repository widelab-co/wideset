import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { appShellVariants } from './AppShell.variants';
import type { AppShellMain } from './AppShellMain';
import type { AppShellSidebarTrigger } from './AppShellSidebarTrigger';
import type { AppShellTopBar } from './AppShellTopBar';
import type { AppShellTopBarActions } from './AppShellTopBarActions';

/** The app's visual direction: how the navigation and the page meet the window. */
export type AppShellDirection = NonNullable<VariantProps<typeof appShellVariants>['direction']>;

/** Props for the full-height row that holds the `Sidebar` and `AppShell.Main`. */
export type AppShellProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * The app's visual direction, chosen once for the whole app. A `Sidebar` inside takes the
   * matching surface on its own; its `surface` prop overrides it.
   * `inset`: the sidebar on the grey app frame, the page a raised white card inside it. The
   * default, for apps with navigation and several regions.
   * `flat`: one white surface; a line splits the sidebar from the page. For simple, dense tools.
   * `frame`: the sidebar on a grey tint, the page white and full-bleed. For side-by-side panels.
   * `canvas`: a grey page whose content sits in white sections, usually under a top bar. For pages
   * made of separate modules (an overview, a wallet).
   * @default 'inset'
   */
  direction?: AppShellDirection;
  /** A `Sidebar` (or another navigation) followed by `AppShell.Main`. */
  children?: React.ReactNode;
};

/** Props for the page area: a `<main>` styled for the shell's direction. */
export type AppShellMainProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * The page: an optional `AppShell.TopBar` first, then its header and content. `AppShell.Main`
   * is its only scroll container.
   */
  children?: React.ReactNode;
};

/**
 * Props for the slim bar at the top of the page: the sidebar's toggle, where you are, and the
 * page's small tools. It stays put while the page scrolls under it.
 */
export type AppShellTopBarProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * `AppShell.SidebarTrigger`, then `Breadcrumbs`, then `AppShell.TopBarActions`. Loose text in
   * the bar takes the crumbs' size and colour (12px, subtle) on its own.
   */
  children?: React.ReactNode;
};

/** Props for the group at the far end of `AppShell.TopBar`. */
export type AppShellTopBarActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Small tools for the page: `sm` buttons and icon buttons, an avatar group, a status. */
  children?: React.ReactNode;
};

/**
 * Props for the button in `AppShell.TopBar` that collapses and expands the shell's `Sidebar`.
 * The `Sidebar` keeps the state: use its `collapsed`, `defaultCollapsed` and `onCollapsedChange`.
 */
export type AppShellSidebarTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  /** Accessible label used when the sidebar is collapsed (the button expands it). Ignored when `aria-label` is set. @default 'Expand sidebar' */
  expandLabel?: string;
  /** Accessible label used when the sidebar is expanded (the button collapses it). Ignored when `aria-label` is set. @default 'Collapse sidebar' */
  collapseLabel?: string;
} & MotionProps;

/** What the shell's `Sidebar` reports about itself, for `AppShell.SidebarTrigger`. */
export type AppShellSidebarState = {
  isCollapsed: boolean;
  toggle: () => void;
  /** The sidebar root's `id`, for the trigger's `aria-controls`. */
  sidebarId: string;
};

export type AppShellContextValue = {
  direction: AppShellDirection;
  /** The `Sidebar` inside this shell, once it has mounted. */
  sidebar: AppShellSidebarState | null;
  /** Called by `Sidebar` with its state, and with `null` when it unmounts. */
  registerSidebar: (sidebar: AppShellSidebarState | null) => void;
};

export type AppShellWithSubComponents = React.ForwardRefExoticComponent<
  AppShellProps & React.RefAttributes<HTMLDivElement>
> & {
  Main: typeof AppShellMain;
  TopBar: typeof AppShellTopBar;
  TopBarActions: typeof AppShellTopBarActions;
  SidebarTrigger: typeof AppShellSidebarTrigger;
};
