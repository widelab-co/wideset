import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

export const statusModalContainerVariants = cva(
  cn(
    'bg-ws-static-overlay rounded-ws-container-lg shadow-ws-high z-ws-modal fixed top-1/2 left-1/2 flex w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden',
    'before:z-ws-deep before:absolute before:inset-0 before:block before:bg-inherit before:bg-linear-to-b before:content-[""]',
    // The dialog itself can take focus: no browser ring (see modalContainerVariants).
    'outline-hidden',
  ),
  {
    variants: {
      status: {
        neutral: '',
        positive: 'before:from-ws-semantic-positive',
        notice: 'before:from-ws-semantic-notice',
        information: 'before:from-ws-semantic-info',
        error: 'before:from-ws-semantic-negative',
      },
      orientation: {
        horizontal: 'text-left',
        vertical: 'text-center',
      },
    },
  },
);

export const statusModalContainerMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        'data-[state=open]:zoom-in-(--ws-motion-scale-large) data-[state=closed]:zoom-out-(--ws-motion-scale-large)',
        'ease-(--ws-motion-ease-smooth-out) data-[state=open]:duration-(--ws-motion-duration-fast)',
        'data-[state=closed]:duration-(--ws-motion-duration-quick)',
      ),
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});

export const statusModalOverlayClassName = 'bg-ws-static-scrim-base fixed inset-0 z-ws-modal';

export const statusModalOverlayMotionVariants = cva('', {
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

/**
 * Right-hand gutter the text column must reserve when the close button shares
 * its row: Gap/11 (content inset) + Gap/12 (row gap) + Components/Forms/Small.
 * Composed from tokens rather than hard-coded, so it tracks the scale.
 */
export const statusModalCloseGutter =
  'pr-[calc(var(--spacing-ws-11)+var(--spacing-ws-12)+var(--spacing-ws-forms-sm))]';

export const statusModalIconVariants = cva('', {
  variants: {
    status: {
      positive: '',
      notice: '',
      information: '',
      error: '',
    },
    orientation: {
      horizontal: 'rounded-ws-control-md size-ws-13 p-ws-4',
      vertical: 'rounded-ws-control-xl size-ws-18 p-ws-7 self-center',
    },
  },
  compoundVariants: [
    {
      status: 'positive',
      orientation: 'horizontal',
      className: 'bg-ws-semantic-inverse-positive text-ws-semantic-on-inverse-positive',
    },
    {
      status: 'positive',
      orientation: 'vertical',
      className: 'bg-ws-semantic-positive text-ws-semantic-on-subtle-positive',
    },
    {
      status: 'notice',
      orientation: 'horizontal',
      className: 'bg-ws-semantic-inverse-notice text-ws-semantic-on-inverse-notice',
    },
    {
      status: 'notice',
      orientation: 'vertical',
      className: 'bg-ws-semantic-notice text-ws-semantic-on-subtle-notice',
    },
    {
      status: 'information',
      orientation: 'horizontal',
      className: 'bg-ws-semantic-inverse-info text-ws-semantic-on-inverse-info',
    },
    {
      status: 'information',
      orientation: 'vertical',
      className: 'bg-ws-semantic-info text-ws-semantic-on-subtle-info',
    },
    {
      status: 'error',
      orientation: 'horizontal',
      className: 'bg-ws-semantic-inverse-negative text-ws-semantic-on-inverse-negative',
    },
    {
      status: 'error',
      orientation: 'vertical',
      className: 'bg-ws-semantic-negative text-ws-semantic-on-subtle-negative',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
  },
});
