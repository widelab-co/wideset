import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

import { menuFadeMotion } from '../../motion/recipes';

export const popupContainerClassName = cn(
  'rounded-ws-container-lg flex w-[492px] flex-col',
  'bg-ws-static-overlay',
  'shadow-ws-high',
  'z-ws-popout',
  'outline-hidden',
);

export const popupContainerMotionVariants = cva('', {
  variants: {
    enabled: { true: menuFadeMotion, false: '' },
  },
  defaultVariants: { enabled: true },
});
