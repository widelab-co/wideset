import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

export const tooltipContentVariants = cva(
  'rounded-ws-control-md z-ws-popout px-ws-5 flex flex-col gap-0',
  {
    variants: {
      variant: {
        inverse: 'bg-ws-static-overlay drop-shadow-ws-medium text-ws-static-strong',
        default:
          'bg-ws-static-inverse-background drop-shadow-ws-controls-tooltip text-ws-static-inverse-strong',
      },
      size: {
        md: 'py-ws-4',
        sm: 'py-ws-3 has-[p]:py-ws-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export const tooltipContentMotionVariants = cva('', {
  variants: {
    enabled: {
      true: cn(
        'origin-radix-tooltip',
        'transition-none',
        'animate-in fade-in-0 zoom-in-(--ws-motion-scale-small)',
        'duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-smooth-out)',
        'data-[state=instant-open]:animate-none',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-(--ws-motion-scale-small)',
        'data-[state=closed]:duration-(--ws-motion-duration-quick)',
      ),
      false: '',
    },
  },
  defaultVariants: { enabled: true },
});

export const tooltipLabelVariants = cva('', {
  variants: {
    variant: {
      inverse: 'text-ws-static-strong',
      default: 'text-ws-static-inverse-strong',
    },
    size: {
      md: 'typography-body-strong-md',
      sm: 'typography-body-strong-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export const tooltipDescriptionVariants = cva('', {
  variants: {
    variant: {
      inverse: 'text-ws-static-subtle',
      default: 'text-ws-static-inverse-subtle',
    },
    size: {
      md: 'typography-body-md',
      sm: 'typography-body-sm',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

// Placed from the parent content's data-side, the side Radix resolved after collision flipping, not
// the requested side prop: a flipped tooltip keeps its arrow pointing at the trigger. Only the
// direct parent counts, so a tooltip content nested inside another one cannot match both sides.
export const tooltipArrowVariants = cva(
  cn(
    'absolute',
    '[[data-side=top]>&]:h-ws-3 [[data-side=top]>&]:w-ws-5 [[data-side=top]>&]:top-full [[data-side=top]>&]:left-1/2 [[data-side=top]>&]:-translate-x-1/2 [[data-side=top]>&]:[clip-path:polygon(0_0,100%_0,50%_100%)]',
    '[[data-side=right]>&]:h-ws-5 [[data-side=right]>&]:w-ws-3 [[data-side=right]>&]:top-1/2 [[data-side=right]>&]:right-full [[data-side=right]>&]:-translate-y-1/2 [[data-side=right]>&]:[clip-path:polygon(100%_0,0_50%,100%_100%)]',
    '[[data-side=bottom]>&]:h-ws-3 [[data-side=bottom]>&]:w-ws-5 [[data-side=bottom]>&]:bottom-full [[data-side=bottom]>&]:left-1/2 [[data-side=bottom]>&]:-translate-x-1/2 [[data-side=bottom]>&]:[clip-path:polygon(50%_0,100%_100%,0_100%)]',
    '[[data-side=left]>&]:h-ws-5 [[data-side=left]>&]:w-ws-3 [[data-side=left]>&]:top-1/2 [[data-side=left]>&]:left-full [[data-side=left]>&]:-translate-y-1/2 [[data-side=left]>&]:[clip-path:polygon(0_0,100%_50%,0_100%)]',
  ),
  {
    variants: {
      variant: {
        inverse: 'bg-ws-static-overlay',
        default: 'bg-ws-static-inverse-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
