import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { RadioButtonGroupProps } from './RadioButton.types';

const RadioButtonGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  RadioButtonGroupProps
>(({ orientation = 'vertical', className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    aria-orientation={orientation}
    data-orientation={orientation}
    className={cn(
      'flex',
      orientation === 'vertical' ? 'gap-ws-7 flex-col' : 'gap-ws-11',
      className,
    )}
    data-slot="radio-button-group"
    {...props}
  />
));

RadioButtonGroup.displayName = 'RadioButton.Group';

export { RadioButtonGroup };
