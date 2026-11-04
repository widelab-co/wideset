import * as React from 'react';

import { FieldLabel } from '../field-label/FieldLabel';
import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarLabelProps } from './ProgressBar.types';

export const ProgressBarLabel = ({ id, ...props }: ProgressBarLabelProps) => {
  const { setLabelId } = useProgressBarContext();
  const generatedId = React.useId();
  const labelId = id ?? generatedId;

  React.useEffect(() => {
    setLabelId(labelId);
    return () => setLabelId(undefined);
  }, [labelId, setLabelId]);

  return <FieldLabel id={labelId} data-slot="progress-bar-label" {...props} />;
};
ProgressBarLabel.displayName = 'ProgressBar.Label';
