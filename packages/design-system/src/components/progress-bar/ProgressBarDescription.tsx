import * as React from 'react';

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
    const isRendered = Boolean(children) || showIcon;

    React.useLayoutEffect(
      () => (isRendered ? registerDescription(descriptionId) : undefined),
      [isRendered, descriptionId, registerDescription],
    );

    return (
      <HelperText
        // A new element per status: an error then mounts as a fresh alert and is announced.
        key={status}
        ref={ref}
        data-slot="progress-bar-description"
        {...props}
        state={status}
        showIcon={showIcon}
        // HelperText carries Figma's Gap/3 padding; with the root's Gap/5 that is 12px from the bar.
        className={className}
        id={descriptionId}
      >
        {children}
      </HelperText>
    );
  },
);
ProgressBarDescription.displayName = 'ProgressBar.Description';

export { ProgressBarDescription };
