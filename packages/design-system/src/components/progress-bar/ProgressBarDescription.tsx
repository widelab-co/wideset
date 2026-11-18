import * as React from 'react';

import { HelperText } from '../helper-text/HelperText';
import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarDescriptionProps } from './ProgressBar.types';

const ProgressBarDescription = React.forwardRef<HTMLSpanElement, ProgressBarDescriptionProps>(
  ({ id, children, ...props }, ref) => {
    const { status, registerDescription } = useProgressBarContext();
    const generatedId = React.useId();
    const descriptionId = id ?? generatedId;
    const showIcon = status === 'success' || status === 'error';
    const hasText = Boolean(children);

    React.useLayoutEffect(
      () => (hasText ? registerDescription(descriptionId) : undefined),
      [hasText, descriptionId, registerDescription],
    );

    return (
      <HelperText
        // Remount per status so an error is announced as a fresh alert.
        key={status}
        ref={ref}
        data-slot="progress-bar-description"
        {...props}
        state={status}
        showIcon={showIcon}
        id={descriptionId}
      >
        {children}
      </HelperText>
    );
  },
);
ProgressBarDescription.displayName = 'ProgressBar.Description';

export { ProgressBarDescription };
