import { RiAlertFill, RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { HelperTextProps } from './HelperText.types';
import { helperTextIconVariants, helperTextVariants } from './HelperText.variants';

const iconsByState = {
  error: RiErrorWarningFill,
  warning: RiAlertFill,
  success: RiCheckboxCircleFill,
};

export const HelperText = React.forwardRef<HTMLSpanElement, HelperTextProps>(
  ({ children, state, showIcon, className, ...props }, ref) => {
    if (!children && !showIcon) return null;

    const Icon = iconsByState[state as keyof typeof iconsByState];

    return (
      <span
        ref={ref}
        data-slot="helper-text"
        role={state === 'error' ? 'alert' : undefined}
        className={cn(helperTextVariants({ state }), className)}
        {...props}
      >
        {showIcon && state && state !== 'default' && (
          <Icon
            aria-hidden="true"
            focusable="false"
            className={helperTextIconVariants({ state })}
          />
        )}
        {children}
      </span>
    );
  },
);
HelperText.displayName = 'HelperText';
