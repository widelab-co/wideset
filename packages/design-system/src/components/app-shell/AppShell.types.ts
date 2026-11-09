import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import type { appShellVariants } from './AppShell.variants';
import type { AppShellMain } from './AppShellMain';

/** The app's visual direction: how the navigation and the page meet the window. */
export type AppShellDirection = NonNullable<VariantProps<typeof appShellVariants>['direction']>;

/** Props for the full-height row that holds the `Sidebar` and `AppShell.Main`. */
export type AppShellProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * The app's visual direction, chosen once for the whole app. A `Sidebar` inside takes the
   * matching surface on its own.
   * `flat`: one white surface; a line splits the sidebar from the page. For simple, dense tools.
   * `frame`: the sidebar on a grey tint, the page white and full-bleed. For side-by-side panels.
   * `inset`: the sidebar on the grey app frame, the page a raised white card inside it. For apps
   * with a strong page edge and several regions.
   * @default 'flat'
   */
  direction?: AppShellDirection;
  /** A `Sidebar` (or another navigation) followed by `AppShell.Main`. */
  children?: React.ReactNode;
};

/** Props for the page area: a `<main>` styled for the shell's direction. */
export type AppShellMainProps = React.HTMLAttributes<HTMLElement> & {
  /** The page: its header and content. `AppShell.Main` is its only scroll container. */
  children?: React.ReactNode;
};

export type AppShellContextValue = {
  direction: AppShellDirection;
};

export type AppShellWithSubComponents = React.ForwardRefExoticComponent<
  AppShellProps & React.RefAttributes<HTMLDivElement>
> & {
  Main: typeof AppShellMain;
};
