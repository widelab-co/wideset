import * as React from 'react';

import { FieldLabel } from '../field-label/FieldLabel';
import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarLabelProps } from './ProgressBar.types';

const ProgressBarLabel = React.forwardRef<HTMLLabelElement, ProgressBarLabelProps>(
  ({ id, children, ...props }, ref) => {
    const { registerLabel } = useProgressBarContext();
    const generatedId = React.useId();
    const labelId = id ?? generatedId;

    React.useEffect(() => registerLabel(labelId), [labelId, registerLabel]);

    return (
      <FieldLabel ref={ref} data-slot="progress-bar-label" {...props} id={labelId}>
        {children}
      </FieldLabel>
    );
  },
);
ProgressBarLabel.displayName = 'ProgressBar.Label';

export { ProgressBarLabel };
