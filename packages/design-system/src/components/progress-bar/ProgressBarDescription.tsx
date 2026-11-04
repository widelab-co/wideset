import * as React from 'react';
import { cn } from 'src/lib/utils';

import { HelperText } from '../helper-text/HelperText';
import { helperTextVariants } from '../helper-text/HelperText.variants';
import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarDescriptionProps } from './ProgressBar.types';

const ProgressBarDescription = ({ className, children, ...props }: ProgressBarDescriptionProps) => {
  const { status, descriptionId, registerDescription } = useProgressBarContext();

  React.useEffect(registerDescription, [registerDescription]);

  return (
    <HelperText
      data-slot="progress-bar-description"
      {...props}
      state={status}
      showIcon={status === 'success' || status === 'error'}
      className={cn(helperTextVariants({ state: status }), className)}
      id={descriptionId}
    >
      {children}
    </HelperText>
  );
};
ProgressBarDescription.displayName = 'ProgressBar.Description';

export { ProgressBarDescription };
