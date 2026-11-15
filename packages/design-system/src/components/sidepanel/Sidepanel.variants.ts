import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

export const sidepanelPanelVariants = cva(
  // outline-hidden: the panel itself can take focus; it needs no ring, and without the reset the
  // browser draws its own.
  'bg-ws-static-container rounded-ws-container-lg z-ws-drawer fixed flex max-h-[calc(100vh-2*var(--ws-size-5))] w-full flex-col overflow-hidden outline-hidden',
  {
    variants: {
      side: {
        left: 'inset-y-ws-5 left-ws-5',
        right: 'inset-y-ws-5 right-ws-5',
      },
      size: {
        sm: 'max-w-[35rem]',
        md: 'max-w-[44rem]',
        lg: 'max-w-[60rem]',
      },
    },
    defaultVariants: {
      side: 'right',
      size: 'md',
    },
  },
);

export const sidepanelPanelMotionVariants = cva('', {
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
    side: {
      left: '',
      right: '',
    },
  },
  compoundVariants: [
    {
      enabled: true,
      side: 'left',
      className:
        'data-[state=closed]:[--tw-exit-translate-x:calc(var(--ws-size-8)*-1)] data-[state=open]:[--tw-enter-translate-x:calc(var(--ws-size-8)*-1)]',
    },
    {
      enabled: true,
      side: 'right',
      className:
        'data-[state=open]:slide-in-from-right-ws-8 data-[state=closed]:slide-out-to-right-ws-8',
    },
  ],
  defaultVariants: { enabled: true, side: 'right' },
});

export const sidepanelOverlayClassName = 'bg-ws-static-scrim-base fixed inset-0 z-ws-drawer';

export const sidepanelOverlayMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        'data-[state=open]:duration-(--ws-motion-duration-fast)',
        'data-[state=closed]:duration-(--ws-motion-duration-quick)',
      ),
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});
