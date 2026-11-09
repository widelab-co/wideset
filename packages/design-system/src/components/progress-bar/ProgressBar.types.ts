import type * as ProgressPrimitive from '@radix-ui/react-progress';

import type { MotionProps } from '../../motion/Motion.types';

export type ProgressBarProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
  MotionProps & {
    /**
     * Semantic state — colours the bar fill and the circle's arc or icon. `default` for a task in
     * progress, `neutral` for quantities like usage, `warning` when close to a limit, `error` when
     * over it or failed, `success` when done.
     */
    variant?: 'default' | 'neutral' | 'warning' | 'success' | 'error';
    /** Label shown above the bar (bar type only); it also names the bar. */
    label?: string;
    /** Helper text shown below the indicator (bar type only). */
    description?: string;
    /** Shape of the progress indicator. */
    type?: 'bar' | 'circle';
    /** Aligns the percentage label to a fixed width to prevent layout shift during animation (circle type only). */
    fixedWidth?: boolean;
  };
