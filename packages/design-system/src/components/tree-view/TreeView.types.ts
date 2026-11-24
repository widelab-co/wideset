import type { RemixiconComponentType } from '@remixicon/react';
import type { HTMLAttributes, LiHTMLAttributes } from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { RemixiconProps } from '../../types/icon.types';
import type { TreeViewGroup } from './TreeViewGroup';
import type { TreeViewIcon } from './TreeViewIcon';
import type { TreeViewItem } from './TreeViewItem';
import type { TreeViewLabel } from './TreeViewLabel';
import type { TreeViewSuffix } from './TreeViewSuffix';

/**
 * A hierarchy of items that fold open and shut, such as files and folders. Name the tree with
 * `aria-label` or `aria-labelledby`.
 */
export type TreeViewProps = Omit<HTMLAttributes<HTMLUListElement>, 'defaultValue'> &
  MotionProps & {
    /**
     * The `value` of the selected item (controlled). Only items without a `TreeView.Group`
     * are selected; an item with one folds open and shut instead.
     */
    value?: string;
    /**
     * The item selected on first render (uncontrolled). For a controlled tree with nothing
     * selected, pass `value=""`: `undefined` hands the selection back to the tree.
     */
    defaultValue?: string;
    /** Fired with the item's `value` when an item is selected by click, Enter or Space. */
    onValueChange?: (value: string) => void;
    /** The `value`s of the items whose group is open (controlled). */
    expanded?: string[];
    /**
     * The `value`s of the items whose group is open on first render (uncontrolled).
     * @default []
     */
    defaultExpanded?: string[];
    /** Fired with every open item's `value` when an item folds open or shut. */
    onExpandedChange?: (expanded: string[]) => void;
  };

/**
 * One item in the tree: a row, and a `TreeView.Group` under it when it holds more items.
 * Every item needs a `TreeView.Label`: it is the item's name and what type-ahead matches.
 */
export type TreeViewItemProps = Omit<LiHTMLAttributes<HTMLLIElement>, 'value'> & {
  /** Identifies the item in `value` and `expanded`. Unique across the tree. */
  value: string;
  /**
   * The item stays in the keyboard order but cannot be selected or folded.
   * @default false
   */
  disabled?: boolean;
};

/** The items one level in, under the row of the item that holds them. */
export type TreeViewGroupProps = HTMLAttributes<HTMLUListElement>;

/** The item's name, required in every item; the tree reads it out and types ahead to it. */
export type TreeViewLabelProps = HTMLAttributes<HTMLSpanElement>;

/** Trailing content at the end of a row: a count, a status letter, a dot. */
export type TreeViewSuffixProps = HTMLAttributes<HTMLSpanElement>;

/** An icon before the item's label. */
export type TreeViewIconProps = RemixiconProps & {
  /** The icon component, from `@remixicon/react`. */
  icon: RemixiconComponentType;
  /** Shown instead of `icon` while the item's group is open, such as an open folder. */
  expandedIcon?: RemixiconComponentType;
};

export type TreeViewContextType = {
  currentValue: string | undefined;
  currentExpanded: string[];
  tabStop: string | undefined;
  motion: boolean;
  focusItem: (value: string) => void;
};

export type TreeViewItemContextType = {
  expanded: boolean;
  labelId: string;
  suffixId: string;
};

export type TreeViewWithSubComponents = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TreeViewProps> & React.RefAttributes<HTMLUListElement>
> & {
  displayName?: string;
  Item: typeof TreeViewItem;
  Group: typeof TreeViewGroup;
  Icon: typeof TreeViewIcon;
  Label: typeof TreeViewLabel;
  Suffix: typeof TreeViewSuffix;
};
