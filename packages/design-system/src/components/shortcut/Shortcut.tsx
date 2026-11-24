import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import type { ShortcutProps, ShortcutWithSubComponents } from './Shortcut.types';
import { shortcutVariants } from './Shortcut.variants';
import { ShortcutKey } from './ShortcutKey';

const Shortcut = forwardRef<HTMLElement, ShortcutProps>(
  ({ className, emphasis, variant, ...props }, ref) => (
    <kbd
      ref={ref}
      data-slot="shortcut"
      className={cn(shortcutVariants({ emphasis, variant }), className)}
      {...props}
    />
  ),
) as ShortcutWithSubComponents;

Shortcut.displayName = 'Shortcut';
Shortcut.Key = ShortcutKey;

export { Shortcut };
