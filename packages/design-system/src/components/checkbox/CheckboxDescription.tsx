import * as React from 'react';
import { cn } from 'src/lib/utils';

import { CheckboxContext } from './Checkbox.context';

export const CheckboxDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, id: idProp, ...props }, ref) => {
  const context = React.useContext(CheckboxContext);
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
      data-slot="checkbox-description"
      className={cn('text-ws-static-subtle typography-body-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CheckboxDescription.displayName = 'Checkbox.Description';
