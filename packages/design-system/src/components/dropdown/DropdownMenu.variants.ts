import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

export const dropdownMenuContentClassName = cn(
  'min-w-ws-28',
  'rounded-ws-container-sm p-ws-3 outline-hidden',
  'bg-ws-static-overlay text-ws-dynamic-secondary-default shadow-ws-medium z-ws-popout',
  'max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto',
);

export const dropdownMenuItemClassName = 'min-h-ws-14 outline-hidden';

export const dropdownMenuLabelVariants = cva(
  'typography-label-sm text-ws-dynamic-secondary-default pt-ws-7 pr-ws-5 pb-ws-5 pl-ws-5',
  {
    variants: {
      inset: {
        true: 'pl-ws-8',
      },
    },
  },
);

// The 1px border counts toward the 12px row, leaving 5.5px on each side.
export const dropdownMenuSeparatorClassName = 'border-ws-static-base -mx-ws-3 my-[5.5px] border-t';

export const dropdownMenuSubTriggerClassName = cn(
  dropdownMenuItemClassName,
  'data-[state=open]:bg-ws-dynamic-secondary-alpha-hover',
);
export const dropdownMenuSubTriggerSuffixClassName = 'size-ws-12 justify-center';
export const dropdownMenuSubTriggerIconClassName = 'size-ws-9';

export const dropdownMenuTriggerVariants = cva('cursor-pointer', {
  variants: {
    focusOutline: {
      true: 'focus-visible:wds-focus-visible focus-visible:wds-outline',
    },
  },
});

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
