import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import type { ShortcutKeyProps } from './Shortcut.types';
import { shortcutKeyVariants } from './Shortcut.variants';

type Modifier = { symbol: 'command' | 'shift' | 'option' | 'control'; name: string };

/**
 * The modifier glyphs of Figma's `.Shortcut Symbol`: the variant each one draws and the name a
 * screen reader announces instead of the glyph's Unicode name. Any other key is the Letter variant
 * and is read as written.
 */
const MODIFIERS = new Map<string, Modifier>([
  ['⌘', { symbol: 'command', name: 'Command' }],
  ['⇧', { symbol: 'shift', name: 'Shift' }],
  ['⌥', { symbol: 'option', name: 'Option' }],
  ['⌃', { symbol: 'control', name: 'Control' }],
]);

const ShortcutKey = forwardRef<HTMLElement, ShortcutKeyProps>(
  ({ className, children, ...props }, ref) => {
    const modifier = typeof children === 'string' ? MODIFIERS.get(children) : undefined;

    return (
      <kbd
        ref={ref}
        data-slot="shortcut-key"
        className={cn(shortcutKeyVariants({ symbol: modifier?.symbol }), className)}
        {...props}
      >
        {modifier ? (
          <>
            <span aria-hidden="true">{children}</span>
            <span className="sr-only">{modifier.name}</span>
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
