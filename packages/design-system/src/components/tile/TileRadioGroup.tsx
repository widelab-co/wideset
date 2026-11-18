import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { FieldLabel } from '../field-label/FieldLabel';
import type { TileRadioGroupProps } from './Tile.types';

/**
 * Owns single selection across a set of `Tile.Radio` children: renders
 * `role="radiogroup"` and supplies arrow-key navigation, roving tabindex and
 * form `name`.
 *
 * Pass `label` to give the group an accessible name. Without one a screen
 * reader announces "radio group" and nothing else. Carbon's `TileGroup` gets
 * this from `<fieldset><legend>`; here the label is wired with
 * `aria-labelledby`, which names the `radiogroup` element itself rather than an
 * outer `fieldset` whose role has been overridden.
 *
 * Otherwise mirrors `RadioButton.Group`'s contract (`value`, `onValueChange`,
 * `name`, `orientation`, `required`) so the two are interchangeable in a form.
 */
const TileRadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  TileRadioGroupProps
>(({ className, label, orientation = 'vertical', required, ...props }, ref) => {
  const labelId = React.useId();
  // An explicit aria-label / aria-labelledby from the consumer wins over `label`.
  const isLabelled = !!props['aria-label'] || !!props['aria-labelledby'];

  const group = (
    <RadioGroupPrimitive.Root
      ref={ref}
      orientation={orientation}
      required={required}
      aria-labelledby={label && !isLabelled ? labelId : undefined}
      className={cn('gap-ws-5 flex', orientation === 'vertical' && 'flex-col', className)}
      data-slot="tile-radio-group"
      {...props}
    />
  );

  if (!label) return group;

  return (
    <div className="gap-ws-5 flex flex-col">
      <FieldLabel id={labelId} required={required}>
        {label}
        <FieldLabel.RequiredIndicator />
      </FieldLabel>
      {group}
    </div>
  );
});

TileRadioGroup.displayName = 'Tile.RadioGroup';

export { TileRadioGroup };
