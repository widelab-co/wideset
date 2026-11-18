'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/wideset/utils';

import { useChipContext } from './Chip.context';
import type { ChipLabelProps } from './Chip.types';
import { chipLabelVariants } from './Chip.variants';

const ChipLabel = forwardRef<HTMLSpanElement, ChipLabelProps>(({ className, ...props }, ref) => {
  useChipContext();

  return (
    <span
      ref={ref}
      className={cn(chipLabelVariants(), className)}
      data-slot="chip-label"
      {...props}
    />
  );
});

ChipLabel.displayName = 'Chip.Label';

export { ChipLabel };
