'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { cn } from '@/lib/wideset/utils';

import type { DropdownMenuSeparatorProps } from './DropdownMenu.types';

export const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    data-slot="dropdown-menu-separator"
    // Figma's Divider row is 12px: Gap/4 (6px) above and below a 1px line drawn out of flow.
    // The border here is in flow, so each margin gives up half of it to keep the row at 12px.
    className={cn('border-ws-static-base -mx-ws-3 my-[5.5px] border-t', className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = 'DropdownMenu.Separator';
