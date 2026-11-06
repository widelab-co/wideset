import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

// Figma 15244:10530. Padding (2) and gap (8) are unbound in Figma; Gap/2 and Gap/5 carry them.
// w-max keeps the centred bar from shrinking to the half of the viewport `left-1/2` leaves it.
export const actionBarVariants = cva(
  cn(
    'z-ws-sticky fixed flex w-max items-center',
    'gap-ws-5 p-ws-2 rounded-ws-container-md bg-ws-static-background shadow-ws-high',
    'data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0',
  ),
  {
    variants: {
      position: {
        top: 'top-ws-9',
        bottom: 'bottom-ws-9',
      },
      align: {
        left: 'left-ws-9',
        center: 'left-1/2 -translate-x-1/2',
        right: 'right-ws-9',
      },
    },
    defaultVariants: {
      position: 'bottom',
      align: 'center',
    },
  },
);

export const actionBarMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        'ease-(--ws-motion-ease-smooth-out) data-[state=open]:duration-(--ws-motion-duration-slow)',
        'data-[state=closed]:duration-(--ws-motion-duration-medium)',
      ),
      false: '',
    },
    position: {
      top: '',
      bottom: '',
    },
  },
  compoundVariants: [
    {
      enabled: true,
      position: 'top',
      className:
        'data-[state=open]:ws-slide-in-from-top-4 data-[state=closed]:ws-slide-out-to-top-4',
    },
    {
      enabled: true,
      position: 'bottom',
      className:
        'data-[state=open]:slide-in-from-bottom-ws-4 data-[state=closed]:slide-out-to-bottom-ws-4',
    },
  ],
  defaultVariants: { enabled: true, position: 'bottom' },
});
