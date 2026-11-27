import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

/** Where the stack of toasts sits on the screen, above everything else. */
export const toastContainerVariants = cva(
  'z-ws-notification gap-ws-5 fixed flex w-full max-w-[24rem] flex-col',
  {
    variants: {
      position: {
        'top-right': 'top-ws-9 right-ws-9',
        'top-left': 'top-ws-9 left-ws-9',
        'bottom-right': 'bottom-ws-9 right-ws-9',
        'bottom-left': 'bottom-ws-9 left-ws-9',
        'top-center': 'top-ws-9 left-1/2 -translate-x-1/2 transform',
        'bottom-center': 'bottom-ws-9 left-1/2 -translate-x-1/2 transform',
      },
    },
    defaultVariants: { position: 'bottom-right' },
  },
);

export const toastVariants = cva('inline-flex w-full items-center', {
  variants: {
    status: {
      neutral: '',
      info: '',
      success: '',
      error: '',
    },
    variant: {
      basic: 'rounded-ws-container-md shadow-ws-medium min-h-ws-18 py-ws-5 pr-ws-5 pl-ws-9',
      expanded:
        'bg-ws-static-overlay rounded-ws-container-lg shadow-ws-high pt-ws-9 overflow-hidden',
    },
  },
  compoundVariants: [
    {
      status: 'neutral',
      variant: 'basic',
      className: 'bg-ws-semantic-inverse-neutral text-ws-semantic-on-inverse-neutral',
    },
    {
      status: 'info',
      variant: 'basic',
      className: 'bg-ws-semantic-inverse-info text-ws-semantic-on-inverse-info',
    },
    {
      status: 'success',
      variant: 'basic',
      className: 'bg-ws-semantic-inverse-positive text-ws-semantic-on-inverse-positive',
    },
    {
      status: 'error',
      variant: 'basic',
      className: 'bg-ws-semantic-inverse-negative text-ws-semantic-on-inverse-negative',
    },
  ],
  defaultVariants: {
    status: 'neutral',
  },
});

type ToastStatus = NonNullable<VariantProps<typeof toastVariants>['status']>;
type ToastVariant = NonNullable<VariantProps<typeof toastVariants>['variant']>;

type ToastButtonVariantConfig = {
  variants: {
    status: Record<ToastStatus, string>;
    variant: Record<ToastVariant, string>;
  };
  compoundVariants: Array<{
    status: ToastStatus;
    variant: ToastVariant;
    className: string;
  }>;
};

const toastButtonVariants = {
  variants: {
    status: {
      neutral: '',
      info: '',
      success: '',
      error: '',
    },
    variant: {
      basic: '',
      expanded: '',
    },
  },
  compoundVariants: (['info', 'success', 'error'] satisfies ToastStatus[]).map((status) => ({
    status,
    variant: 'basic',
    className:
      'text-ws-semantic-on-inverse-negative hover:text-ws-semantic-on-inverse-negative active:text-ws-semantic-on-inverse-negative',
  })),
} satisfies ToastButtonVariantConfig;

export const toastActionVariants = cva('box-border py-0', toastButtonVariants);

export const toastDismissVariants = cva('ml-ws-3 size-ws-14 p-0', toastButtonVariants);

export const toastMotionVariants = cva('', {
  variants: {
    enabled: { true: '', false: '' },
    exiting: { true: '', false: '' },
  },
  compoundVariants: [
    {
      enabled: true,
      exiting: false,
      className:
        'animate-[ws-toast-in_var(--ws-motion-duration-medium)_var(--ws-motion-ease-smooth-out)_backwards]',
    },
    {
      enabled: true,
      exiting: true,
      className:
        'animate-[ws-toast-out_var(--ws-motion-duration-quick)_var(--ws-motion-ease-smooth-out)_forwards]',
    },
  ],
  defaultVariants: { enabled: true, exiting: false },
});

export const toastViewportMotionVariants = cva('', {
  variants: {
    enabled: { true: 'group/toasts grid grid-cols-[100%] gap-0', false: '' },
    stacked: { true: '', false: '' },
    side: { top: '', bottom: '' },
  },
  compoundVariants: [
    { enabled: true, side: 'bottom', className: 'items-end [--ws-toast-direction:1]' },
    { enabled: true, side: 'top', className: 'items-start [--ws-toast-direction:-1]' },
    {
      enabled: true,
      stacked: true,
      className:
        "hover:before:absolute hover:before:inset-x-0 hover:before:h-[200%] hover:before:content-['']",
    },
    { enabled: true, stacked: true, side: 'bottom', className: 'hover:before:bottom-full' },
    { enabled: true, stacked: true, side: 'top', className: 'hover:before:top-full' },
  ],
  defaultVariants: { enabled: true, stacked: false, side: 'bottom' },
});

export const toastStackItemMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(
        'relative col-start-1 row-start-1',
        'transition-[translate,scale,opacity] duration-(--ws-motion-duration-medium) ease-(--ws-motion-ease-smooth-out)',
      ),
      false: '',
    },
    stacked: { true: '', false: '' },
    side: { top: '', bottom: '' },
    depth: { 0: '', 1: '', 2: '', 3: '' },
  },
  compoundVariants: [
    { enabled: true, side: 'bottom', className: 'origin-bottom' },
    { enabled: true, side: 'top', className: 'origin-top' },
    {
      enabled: true,
      stacked: true,
      depth: 1,
      className: cn(
        '-translate-y-[calc(var(--ws-motion-distance-medium)*var(--ws-toast-direction))] scale-94 opacity-60',
        'group-hover/toasts:-translate-y-[calc((100%+var(--ws-motion-distance-base))*var(--ws-toast-direction))] group-hover/toasts:scale-100 group-hover/toasts:opacity-100',
      ),
    },
    {
      enabled: true,
      stacked: true,
      depth: 2,
      className: cn(
        '-translate-y-[calc(var(--ws-motion-distance-medium)*2*var(--ws-toast-direction))] scale-88 opacity-36',
        'group-hover/toasts:-translate-y-[calc((200%+var(--ws-motion-distance-base)*2)*var(--ws-toast-direction))] group-hover/toasts:scale-100 group-hover/toasts:opacity-100',
      ),
    },
    {
      enabled: true,
      stacked: true,
      depth: 3,
      className:
        'pointer-events-none -translate-y-[calc(var(--ws-motion-distance-medium)*3*var(--ws-toast-direction))] scale-82 opacity-0',
    },
  ],
  defaultVariants: { enabled: true, stacked: false, side: 'bottom', depth: 0 },
});

export const toastIconExpandedVariants = cva('size-ws-11', {
  variants: {
    status: {
      neutral: '',
      info: 'text-ws-semantic-info',
      success: 'text-ws-semantic-positive',
      error: 'text-ws-semantic-negative',
    },
  },
});
