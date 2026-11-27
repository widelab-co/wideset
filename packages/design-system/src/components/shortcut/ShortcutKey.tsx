import type { RemixiconComponentType } from '@remixicon/react';
import {
  RiArrowDownLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiArrowUpLine,
  RiCornerDownLeftLine,
} from '@remixicon/react';
import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import type { ShortcutKeyProps } from './Shortcut.types';
import { shortcutKeyVariants } from './Shortcut.variants';

type KeySymbol = {
  symbol: 'command' | 'shift' | 'option' | 'control' | 'enter' | 'arrow';
  name: string;
  /** Drawn instead of the glyph: Remix icons, as the rest of Wideset draws these keys. */
  icon?: RemixiconComponentType;
};

/**
 * The glyphs of Figma's `.Shortcut Symbol`: the variant each one draws and the name a screen
 * reader announces instead of the glyph's Unicode name. The modifiers are drawn as text, Enter and
 * the arrows as Remix icons. Any other key is the Letter variant and is read as written.
 */
const SYMBOLS = new Map<string, KeySymbol>([
  ['⌘', { symbol: 'command', name: 'Command' }],
  ['⇧', { symbol: 'shift', name: 'Shift' }],
  ['⌥', { symbol: 'option', name: 'Option' }],
  ['⌃', { symbol: 'control', name: 'Control' }],
  ['↵', { symbol: 'enter', name: 'Enter', icon: RiCornerDownLeftLine }],
  ['↑', { symbol: 'arrow', name: 'Up Arrow', icon: RiArrowUpLine }],
  ['↓', { symbol: 'arrow', name: 'Down Arrow', icon: RiArrowDownLine }],
  ['←', { symbol: 'arrow', name: 'Left Arrow', icon: RiArrowLeftLine }],
  ['→', { symbol: 'arrow', name: 'Right Arrow', icon: RiArrowRightLine }],
]);

const ShortcutKey = forwardRef<HTMLElement, ShortcutKeyProps>(
  ({ className, children, ...props }, ref) => {
    const symbol = typeof children === 'string' ? SYMBOLS.get(children) : undefined;
    const Icon = symbol?.icon;

    return (
      <kbd
        ref={ref}
        data-slot="shortcut-key"
        className={cn(shortcutKeyVariants({ symbol: symbol?.symbol }), className)}
        {...props}
      >
        {symbol ? (
          <>
            {Icon ? (
              <Icon aria-hidden="true" className="shrink-0" />
            ) : (
              <span aria-hidden="true">{children}</span>
            )}
            <span className="sr-only">{symbol.name}</span>
          </>
        ) : (
          children
        )}
      </kbd>
    );
  },
);

ShortcutKey.displayName = 'Shortcut.Key';

export { ShortcutKey };
