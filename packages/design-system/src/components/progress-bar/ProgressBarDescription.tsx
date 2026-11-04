import * as React from 'react';
import { cn } from 'src/lib/utils';

import { HelperText } from '../helper-text/HelperText';
import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarDescriptionProps } from './ProgressBar.types';

const ProgressBarDescription = React.forwardRef<HTMLSpanElement, ProgressBarDescriptionProps>(
  ({ id, className, children, ...props }, ref) => {
    const { status, registerDescription } = useProgressBarContext();
    const generatedId = React.useId();
    const descriptionId = id ?? generatedId;
    const showIcon = status === 'success' || status === 'error';
    // HelperText renders nothing without text or an icon; the root must not point at a missing id.
    const isRendered = children != null || showIcon;

    React.useEffect(
      () => (isRendered ? registerDescription(descriptionId) : undefined),
      [isRendered, descriptionId, registerDescription],
    );

    return (
      <HelperText
        ref={ref}
        data-slot="progress-bar-description"
        {...props}
        state={status}
        showIcon={showIcon}
        // Figma puts Gap/3 above the Helper Text; with the root's Gap/5 that is 12px from the bar.
        className={cn('pt-ws-3', className)}
        id={descriptionId}
      >
        {children}
      </HelperText>
    );
  },
);
ProgressBarDescription.displayName = 'ProgressBar.Description';

export { ProgressBarDescription };
