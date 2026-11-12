'use client';

import * as React from 'react';
import { cn } from '@/lib/wideset/utils';

import { SwitchContext } from './Switch.context';

export const SwitchDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, id: idProp, ...props }, ref) => {
  const context = React.useContext(SwitchContext);
  const id = idProp ?? context?.descriptionId;
  const onDescriptionIdChange = context?.onDescriptionIdChange;

  React.useEffect(() => {
    onDescriptionIdChange?.(id);
    return () => onDescriptionIdChange?.(undefined);
  }, [id, onDescriptionIdChange]);

  return (
    <div
      ref={ref}
      id={id}
      data-slot="switch-description"
      className={cn('text-ws-static-subtle typography-body-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
});

SwitchDescription.displayName = 'Switch.Description';
