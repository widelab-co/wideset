import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

/**
 * Viewport gutter, applied on both axes. `100%` (not `100vw`/`100vh`) resolves
 * against the initial containing block on a fixed element, so it excludes the
 * scrollbar. `--spacing-ws-5` = 8px, matching Sidepanel's inset.
 */
const VIEWPORT_INSET =
  'w-[calc(100%-2*var(--spacing-ws-5))] max-h-[calc(100%-2*var(--spacing-ws-5))]';

export const modalContainerVariants = cva(
  cn(
    'rounded-ws-container-md z-ws-modal fixed top-1/2 left-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border',
    // Figma draws every generic Modal frame at 600px wide.
    'max-w-[600px]',
    VIEWPORT_INSET,
    'bg-ws-static-overlay border-ws-dynamic-secondary-default shadow-ws-high',
    // The dialog itself can take focus (nothing focusable inside, or a consumer's
    // onOpenAutoFocus); it needs no ring, and without this the browser draws its own.
    'outline-hidden',
  ),
);

export const modalContainerMotionVariants = cva('', {
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

export const modalOverlayClassName = 'bg-ws-static-scrim-base fixed inset-0 z-ws-modal';

export const modalOverlayMotionVariants = cva('', {
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
 * Right-hand gutter the header reserves for the close button that
 * `Modal.Content` positions over it: Gap/11 (content inset) + Gap/5 (Figma's
 * Header row gap) + Components/Forms/Small. Composed from tokens so it tracks
 * the scale.
 */
export const modalCloseGutter =
  'pr-[calc(var(--spacing-ws-11)+var(--spacing-ws-5)+var(--spacing-ws-forms-sm))]';
