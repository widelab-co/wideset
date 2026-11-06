import type { RemixiconComponentType } from '@remixicon/react';
import type * as React from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { NavigationBarActions } from './NavigationBarActions';
import type { NavigationBarEnd } from './NavigationBarEnd';
import type { NavigationBarItem } from './NavigationBarItem';
import type { NavigationBarNav } from './NavigationBarNav';
import type { NavigationBarStart } from './NavigationBarStart';

/** The app's top bar: menu button and logo, page links or breadcrumbs, tools at the end. */
export type NavigationBarProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * Draws the line along the bottom edge. Turn it off when the page under the bar opens with a
   * large title, or when the bar sits on a grey canvas above content cards.
   * @default true
   */
  divider?: boolean;
};

/** The leading group: menu button, logo and product name. */
export type NavigationBarStartProps = React.HTMLAttributes<HTMLDivElement>;

/** The page links, rendered as a `nav` landmark. */
export type NavigationBarNavProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * Names the landmark for screen readers, which add "navigation" themselves. Change it when the
   * page has another `nav` with the same name, such as a `Sidebar`.
   * @default 'Main'
   */
  'aria-label'?: string;
};

/** The trailing group, pushed to the end of the bar: search, segmented control, actions. */
export type NavigationBarEndProps = React.HTMLAttributes<HTMLDivElement>;

/** A tight row of icon buttons, usually the last thing in `NavigationBar.End`. */
export type NavigationBarActionsProps = React.HTMLAttributes<HTMLDivElement>;

/** Shared options for a page link. */
type NavigationBarItemBaseProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'children'
> & {
  /** Leading icon, a Remix icon component. */
  icon?: RemixiconComponentType;
  /** The page name. */
  label: React.ReactNode;
  /** Content after the label, such as a `Tag` reading "New" or a count. It is part of the link's name. */
  badge?: React.ReactNode;
  /** Marks the link as the current page: active styling plus `aria-current="page"`. */
  active?: boolean;
  /** Blocks navigation and applies disabled styling via `aria-disabled`; the link leaves the tab order. */
  disabled?: boolean;
} & MotionProps;

/** A page link in `NavigationBar.Nav`. Renders an `<a>`; use `asChild` for a router Link. */
export type NavigationBarItemProps = NavigationBarItemBaseProps &
  (
    | {
        /** Merges props onto the child element instead of rendering an `<a>`, e.g. a react-router or Next.js `Link`. The icon, label and badge are injected into it. */
        asChild: true;
        /** The element to render as, e.g. `<Link to="/analytics" />`. Required with `asChild`. */
        children: React.ReactElement;
      }
    | {
        /** Renders the built-in `<a>`; use the slotted branch for router links. */
        asChild?: false;
        children?: never;
      }
  );

export type NavigationBarWithSubComponents = React.ForwardRefExoticComponent<
  NavigationBarProps & React.RefAttributes<HTMLElement>
> & {
  Start: typeof NavigationBarStart;
  Nav: typeof NavigationBarNav;
  Item: typeof NavigationBarItem;
  End: typeof NavigationBarEnd;
  Actions: typeof NavigationBarActions;
};
