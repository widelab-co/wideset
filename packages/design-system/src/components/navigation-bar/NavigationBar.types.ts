import type { RemixiconComponentType } from '@remixicon/react';
import type * as React from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { RemixiconProps } from '../../types/icon.types';
import type { NavigationBarActions } from './NavigationBarActions';
import type { NavigationBarEnd } from './NavigationBarEnd';
import type { NavigationBarIcon } from './NavigationBarIcon';
import type { NavigationBarItem } from './NavigationBarItem';
import type { NavigationBarLabel } from './NavigationBarLabel';
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

/**
 * A page link in `NavigationBar.Nav`. Renders an `<a>`; with `asChild` it renders its only child
 * instead, such as a router `Link`, which then holds the parts.
 */
export type NavigationBarItemProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'children'
> & {
  /** Marks the link as the current page: active styling plus `aria-current="page"`. */
  active?: boolean;
  /**
   * Blocks navigation and dims the link via `aria-disabled`; the link leaves the tab order and
   * loses its `href`. With `asChild`, clicks never reach the child, so its `onClick` and a router
   * `Link`'s navigation do not run.
   */
  disabled?: boolean;
} & MotionProps &
  (
    | {
        /** Merges the link's props onto its only child instead of rendering an `<a>`, e.g. a react-router or Next.js `Link`. */
        asChild: true;
        /** The element to render as, e.g. `<Link to="/analytics" />`, holding the icon and the label. Required with `asChild`. */
        children: React.ReactElement;
      }
    | {
        /** Renders the built-in `<a>`; use the `asChild` branch for a router `Link`. */
        asChild?: false;
        /** `NavigationBar.Icon`, `NavigationBar.Label` and anything after the label, such as a `Tag`. */
        children?: React.ReactNode;
      }
  );

/** The leading icon of a `NavigationBar.Item`; it follows the item's state. */
export type NavigationBarIconProps = RemixiconProps & {
  /** Icon component from `@remixicon/react`. */
  icon: RemixiconComponentType;
};

/** The page name of a `NavigationBar.Item`; it truncates when the bar runs out of room. */
export type NavigationBarLabelProps = React.HTMLAttributes<HTMLSpanElement>;

export type NavigationBarItemContextValue = {
  active: boolean;
  disabled: boolean;
};

export type NavigationBarWithSubComponents = React.ForwardRefExoticComponent<
  NavigationBarProps & React.RefAttributes<HTMLElement>
> & {
  Start: typeof NavigationBarStart;
  Nav: typeof NavigationBarNav;
  Item: typeof NavigationBarItem;
  Icon: typeof NavigationBarIcon;
  Label: typeof NavigationBarLabel;
  End: typeof NavigationBarEnd;
  Actions: typeof NavigationBarActions;
};
