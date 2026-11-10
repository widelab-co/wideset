import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import { useChipContext } from './Chip.context';
import type { ChipActionProps } from './Chip.types';
import { chipActionVariants, chipMotionVariants } from './Chip.variants';

const ChipAction = forwardRef<HTMLButtonElement, ChipActionProps>(
  ({ className, disabled, type = 'button', ...props }, ref) => {
    const { size, variant, style, disabled: chipDisabled, motion } = useChipContext();

    return (
      <button
        ref={ref}
        type={type}
        disabled={chipDisabled || disabled}
        className={cn(
          chipActionVariants({ size, variant, style }),
          chipMotionVariants({ enabled: motion }),
          className,
        )}
        data-slot="chip-action"
        {...props}
      />
    );
  },
);

ChipAction.displayName = 'Chip.Action';

export { ChipAction };
