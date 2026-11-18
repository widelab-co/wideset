'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/wideset/utils';

import { useChipContext } from './Chip.context';
import type { ChipIconProps } from './Chip.types';
import { chipIconSlotVariants, chipIconVariants } from './Chip.variants';

const ChipIcon = forwardRef<SVGSVGElement, ChipIconProps>(
  ({ className, icon: Icon, ...props }, ref) => {
    const { size, variant, style } = useChipContext();

    return (
      <span data-slot="chip-icon" className={chipIconSlotVariants({ size })}>
        <Icon
          ref={ref}
          {...props}
          aria-hidden="true"
          focusable="false"
          className={cn(chipIconVariants({ size, variant, style }), className)}
        />
      </span>
    );
  },
);

ChipIcon.displayName = 'Chip.Icon';

export { ChipIcon };
