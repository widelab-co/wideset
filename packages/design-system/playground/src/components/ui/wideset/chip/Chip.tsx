'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/wideset/utils';

import { useDefaultMotion } from '@/lib/wideset/motion/MotionProvider';
import { ChipContext } from './Chip.context';
import type { ChipProps, ChipWithSubComponents } from './Chip.types';
import { chipSurfaceMotionVariants, chipVariants } from './Chip.variants';
import { ChipAction } from './ChipAction';
import { ChipIcon } from './ChipIcon';
import { ChipIconButton } from './ChipIconButton';
import { ChipLabel } from './ChipLabel';

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      size = 'md',
      variant = 'primary',
      style = 'filled',
      disabled = false,
      defaultMotion,
      children,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);

    return (
      <ChipContext.Provider value={{ size, variant, style, disabled, motion }}>
        <div
          className={cn(
            chipVariants({ size, variant, style }),
            chipSurfaceMotionVariants({ enabled: motion }),
            className,
          )}
          ref={ref}
          data-slot="chip"
          data-disabled={disabled || undefined}
          {...props}
        >
          {children}
        </div>
      </ChipContext.Provider>
    );
  },
) as ChipWithSubComponents;

Chip.displayName = 'Chip';
Chip.Action = ChipAction;
Chip.Icon = ChipIcon;
Chip.IconButton = ChipIconButton;
Chip.Label = ChipLabel;

export { Chip };
