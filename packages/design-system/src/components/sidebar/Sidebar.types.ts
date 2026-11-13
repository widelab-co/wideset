import type { RemixiconComponentType } from '@remixicon/react';
import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { sidebarVariants } from './Sidebar.variants';

/** Props for the root Sidebar container. Supports both controlled and uncontrolled collapsed state. */
export type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Whether the sidebar starts collapsed in uncontrolled mode. Has no effect when `collapsed` is provided. */
  defaultCollapsed?: boolean;
  /** Controls the collapsed state. When provided, the sidebar is in controlled mode. */
  collapsed?: boolean;
  /** Fired when the collapsed state changes. Receives the new `collapsed` value. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * What the sidebar sits on. Inside an `AppShell` it follows the app's direction, so leave it
   * off there; set it to override the direction, or for a sidebar outside an `AppShell`.
   * `page`: the page's white with a subtle line on its right edge (Flat).
   * `tinted`: a grey tint over the app's white, no line (Frame).
   * `frame`: no fill and no line, so it shows the grey app frame behind it, its nav centred in
   * the column beside an inset page (Inset, Canvas).
   * @default the AppShell direction's surface, `page` outside an AppShell
   */
  surface?: NonNullable<VariantProps<typeof sidebarVariants>['surface']>;
} & MotionProps;

/** Props for the Sidebar header — the title/branding row. Never scrolls; hidden when empty. */
export type SidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/** Props for the sidebar's bottom area (invite, account). Pinned to the bottom, never scrolls. */
export type SidebarFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** Props for a Sidebar section. Its content stays mounted in both modes; the parts inside adapt. */
export type SidebarSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Makes the section fill the remaining height and scroll its overflow inside a `ScrollArea`. */
  scrollable?: boolean;
};

/** Props for the title of a group of items. Collapsed, it keeps its height and its text stays available to screen readers. */
export type SidebarSectionHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/** Props for content that exists only when the sidebar is expanded, e.g. the product name. */
export type SidebarExpandedProps = {
  /** Content rendered inside the component. */
  children?: React.ReactNode;
};

/** Props for content that exists only when the sidebar is collapsed. */
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
