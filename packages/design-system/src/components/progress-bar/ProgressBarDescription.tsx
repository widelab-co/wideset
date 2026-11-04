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
      // The state comes from the root, so a red bar cannot sit above a green message.
      state={status}
      showIcon={status === 'success' || status === 'error'}
      // HelperText spreads className over its own classes, so they are merged here.
      className={cn(helperTextVariants({ state: status }), className)}
      // The id comes last: the root's aria-describedby points at it.
      id={descriptionId}
    >
      {children}
    </HelperText>
  );
};
ProgressBarDescription.displayName = 'ProgressBar.Description';

export { ProgressBarDescription };
