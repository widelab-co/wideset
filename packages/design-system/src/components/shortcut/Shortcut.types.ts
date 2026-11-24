import type { VariantProps } from 'class-variance-authority';
import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from 'react';

import type { shortcutVariants } from './Shortcut.variants';
import type { ShortcutKey } from './ShortcutKey';

/** The keyboard shortcut for an action: its keys, in the order they are pressed. */
export type ShortcutProps = HTMLAttributes<HTMLElement> & {
  /**
   * `strong` draws the keys in a bordered cap, for the end of a menu or sidebar row. `weak` shows
   * the bare keys, for a shortcut inside a line of text.
   */
  emphasis?: VariantProps<typeof shortcutVariants>['emphasis'];
  /**
   * `inverse` draws the keys for a dark surface, such as the default `Tooltip`.
   * @default 'default'
   */
  variant?: VariantProps<typeof shortcutVariants>['variant'];
  /** The keys, one `Shortcut.Key` each, in the order they are pressed. */
  children?: ReactNode;
  /** Additional CSS classes for layout overrides. */
  className?: string;
};

/** One key of a `Shortcut`. */
export type ShortcutKeyProps = HTMLAttributes<HTMLElement> & {
  /**
   * The key as printed on the keyboard: a letter or digit (`K`, `8`), a named key (`Esc`, `Tab`)
   * or a symbol. `⌘`, `⇧`, `⌥` and `⌃` are read to screen readers as Command, Shift, Option and
   * Control; `↵`, `↑`, `↓`, `←` and `→` are drawn as icons and read as Enter and the arrow keys.
   */
  children?: ReactNode;
  /** Additional CSS classes for layout overrides. */
  className?: string;
};

export type ShortcutWithSubComponents = ForwardRefExoticComponent<
  PropsWithoutRef<ShortcutProps> & RefAttributes<HTMLElement>
> & {
  Key: typeof ShortcutKey;
};
