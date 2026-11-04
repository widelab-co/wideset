import * as React from 'react';
import { cn } from 'src/lib/utils';

import { HelperText } from '../helper-text/HelperText';
import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarDescriptionProps } from './ProgressBar.types';

export const ProgressBarDescription = React.forwardRef<HTMLDivElement, ProgressBarDescriptionProps>(
  ({ id, className, children, ...props }, ref) => {
    const { variant, setDescriptionId } = useProgressBarContext();
    const generatedId = React.useId();
    const descriptionId = id ?? generatedId;

    React.useEffect(() => {
      setDescriptionId(descriptionId);
      return () => setDescriptionId(undefined);
    }, [descriptionId, setDescriptionId]);

    return (
      <div
        ref={ref}
        id={descriptionId}
        data-slot="progress-bar-description"
        // Figma puts a Gap/3 top padding on the Helper Text instance; with the
        // Gap/5 of the root that makes 12px from the bar to the text.
        className={cn('pt-ws-3', className)}
        {...props}
      >
        <HelperText state={variant} showIcon={variant === 'success' || variant === 'error'}>
          {children}
        </HelperText>
      </div>
    );
  },
);
ProgressBarDescription.displayName = 'ProgressBar.Description';
