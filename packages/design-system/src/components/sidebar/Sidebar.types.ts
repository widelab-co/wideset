import type { RemixiconComponentType } from '@remixicon/react';
import type * as React from 'react';

import type { MotionProps } from '../../motion/Motion.types';

/** Props for the root Sidebar container. Supports both controlled and uncontrolled collapsed state. */
export type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Whether the sidebar starts collapsed in uncontrolled mode. Has no effect when `collapsed` is provided. */
  defaultCollapsed?: boolean;
  /** Controls the collapsed state. When provided, the sidebar is in controlled mode. */
  collapsed?: boolean;
  /** Fired when the collapsed state changes. Receives the new `collapsed` value. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * What the sidebar sits on, set by the app's visual direction (see the directions pattern).
   * `page`: the page's white with a subtle line on its right edge (Flat, Figma's default).
   * `tinted`: a grey tint over the app's white, no line (Frame).
   * `frame`: no fill and no line, so it shows the grey app frame (`bg-ws-static-background` on the
   * root) around an inset page (Inset, Canvas).
   */
  surface?: 'page' | 'tinted' | 'frame';
} & MotionProps;

/** Props for the Sidebar header — the title/branding row. Never scrolls; hidden when empty. */
export type SidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/** Props for the sidebar's bottom area (invite, account). Pinned to the bottom, never scrolls. */
export type SidebarFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** Props for a Sidebar section wrapper that groups expanded and collapsed content slots. */
export type SidebarSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Makes the section fill the remaining height and scroll its overflow inside a `ScrollArea`. */
  scrollable?: boolean;
};

/** Props for content shown when the sidebar is expanded. */
export type SidebarExpandedProps = {
  /** Content rendered inside the component. */
  children?: React.ReactNode;
};

/** Props for content shown when the sidebar is collapsed. */
export type SidebarCollapsedProps = {
  /** Content rendered inside the component. */
  children?: React.ReactNode;
};

/** Shared options for a navigation item. */
type SidebarItemBaseProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
  /** Leading icon. Rendered on its own when the sidebar is collapsed. */
  icon?: RemixiconComponentType;
  /** Row label. Hidden when the sidebar is collapsed, where it falls back to `aria-label`. */
  label?: React.ReactNode;
  /**
   * Trailing content on the row's right edge: a count (`3`) or a `StatusBadge`. Not interactive,
   * since the row is a link. Hidden when the sidebar is collapsed.
   */
  suffix?: React.ReactNode;
  /**
   * Shows the `suffix` only while the row is hovered or has keyboard focus, as for a keyboard
   * shortcut (`⌘1`): a hint, not content. It keeps its space, so the label never shifts. Leave it
   * off for counts and badges, which are content.
   */
  suffixOnHover?: boolean;
  /**
   * A child of the item above it (Figma `Nesting=Level 1`), e.g. a page inside "Pages": indented
   * so its icon starts under the parent's label. One level only; the indent is the whole cue, so
   * draw no guide line. Collapsed, nested items line up like the rest.
   */
  nested?: boolean;
  /** Marks the row as the current page: active styling plus `aria-current="page"`. */
  active?: boolean;
  /** Blocks navigation and applies disabled styling via `aria-disabled`. */
  disabled?: boolean;
} & MotionProps;

/** Props for a Sidebar navigation row. Renders an `<a>`; use `asChild` for a router Link. */
export type SidebarItemProps = SidebarItemBaseProps &
  (
    | {
        /** Merges props onto the child element instead of rendering an `<a>` — e.g. a react-router or tanstack-router `Link`. The icon and label are injected into it. */
        asChild: true;
        /** The element to render as, e.g. `<Link to="/dashboard" />`. Required with `asChild`. */
        children: React.ReactElement;
      }
    | {
        /** Renders the built-in item element; use the slotted branch for custom links. */
        asChild?: false;
        children?: never;
      }
  );

/** Props for the Sidebar toggle trigger button. */
export type SidebarTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Merges props onto the immediate child element instead of rendering the default icon button. */
  asChild?: boolean;
  /** Accessible label used when the sidebar is collapsed (button expands it). Defaults to `'Expand sidebar'`. Ignored when `aria-label` is set explicitly. */
  expandLabel?: string;
  /** Accessible label used when the sidebar is expanded (button collapses it). Defaults to `'Collapse sidebar'`. Ignored when `aria-label` is set explicitly. */
  collapseLabel?: string;
} & MotionProps;

export type SidebarContextValue = {
  isCollapsed: boolean;
  toggle: () => void;
  motion: boolean;
  /** The root element's `id`, referenced by the trigger's `aria-controls`. */
  sidebarId: string;
};

/** Props for a named group of items inside a `Sidebar.Section`. */
export type SidebarGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  /**
   * The group's heading, e.g. a team name. Text only: the heading aligns with the item icons
   * below it, so it takes no icon of its own. Hidden when the sidebar is collapsed, where it
   * still names the group for screen readers.
   */
  label: React.ReactNode;
  /**
   * One action for the whole group, e.g. `<IconButton size="xs" icon={RiAddLine} … />` that adds
   * a page. It ends the heading row, its icon on the same right edge as the item suffixes and the
   * header's buttons. Hidden when the sidebar is collapsed.
   */
  action?: React.ReactNode;
  /** The group's `Sidebar.Item`s. */
  children?: React.ReactNode;
};
