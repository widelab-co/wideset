import * as React from 'react';

import { FieldLabel } from '../field-label/FieldLabel';
import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarLabelProps } from './ProgressBar.types';

const ProgressBarLabel = ({ children, ...props }: ProgressBarLabelProps) => {
  const { labelId, registerLabel } = useProgressBarContext();

  React.useEffect(registerLabel, [registerLabel]);

  return (
    // The id comes last: the root's aria-labelledby points at it.
    <FieldLabel data-slot="progress-bar-label" {...props} id={labelId}>
      {children}
    </FieldLabel>
  );
};
ProgressBarLabel.displayName = 'ProgressBar.Label';

export { ProgressBarLabel };
