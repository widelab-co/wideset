import { cva } from 'class-variance-authority';
import { cn } from '@/lib/wideset/utils';

/**
 * The menu surface. Hard rule for floating menus: never narrower than Size/28 (10rem —
 * Bootstrap's floor; shadcn uses 8rem, Material 112dp). Trigger-matching popovers
 * (Select/MultiSelect) override the floor with max(trigger, Size/28).
 */
export const dropdownMenuContentVariants = cva(
  cn(
    'min-w-ws-28',
    'rounded-ws-container-sm p-ws-3 outline-hidden',
    'bg-ws-static-overlay text-ws-dynamic-secondary-default shadow-ws-medium z-ws-popout',
  ),
);

export const dropdownMenuContentMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(
        'origin-radix-dropdown-menu',
        'transition-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        'data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:ws-slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-ws-2',
        'data-[side=right]:ws-slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-ws-2',
        'ease-(--ws-motion-ease-smooth-out) data-[state=open]:duration-(--ws-motion-duration-fast)',
        'data-[state=closed]:duration-(--ws-motion-duration-quick)',
      ),
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});
