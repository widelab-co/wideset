import { RiCloseLine } from '@remixicon/react';
import { forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import { IconButton } from '../button/IconButton';
import { useChipContext } from './Chip.context';
import type { ChipIconButtonProps } from './Chip.types';
import { chipIconButtonVariants, chipMotionVariants } from './Chip.variants';

const ChipIconButton = forwardRef<HTMLButtonElement, ChipIconButtonProps>(
  ({ className, disabled, icon = RiCloseLine, ...props }, ref) => {
    const { size, variant, style, disabled: chipDisabled, motion } = useChipContext();

    return (
      <IconButton
        ref={ref}
        icon={icon}
        preset="ghost"
        variant="secondary"
        size="xs"
        disabled={chipDisabled || disabled}
        defaultMotion={false}
        className={cn(
          chipIconButtonVariants({ size, variant, style }),
          chipMotionVariants({ enabled: motion }),
          className,
        )}
        data-slot="chip-icon-button"
        {...props}
      />
    );
  },
);

ChipIconButton.displayName = 'Chip.IconButton';

export { ChipIconButton };
