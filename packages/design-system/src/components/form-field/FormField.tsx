import * as React from 'react';
import { cn } from 'src/lib/utils';

import { FieldLabel } from '../field-label/FieldLabel';
import { HelperText } from '../helper-text/HelperText';
import type { FormFieldProps } from './FormField.types';
import {
  formFieldContentVariants,
  formFieldLabelVariants,
  formFieldVariants,
} from './FormField.variants';

export const FormField = React.forwardRef<HTMLDivElement | HTMLFieldSetElement, FormFieldProps>(
  (
    {
      children,
      variant = 'vertical',
      className,
      WrapperComponent = 'div',
      errorText,
      helperText,
      helperTextId: helperTextIdProp,
      label,
      ...props
    },
    ref,
  ) => {
    const generatedHelperTextId = React.useId();
    const helperTextId = helperTextIdProp || generatedHelperTextId;
    const hasHelperText = Boolean(errorText || helperText);

    const helperTextComponent = hasHelperText ? (
      <HelperText
        key={errorText ? 'error' : 'helper'}
        state={errorText ? 'error' : 'default'}
        showIcon={!!errorText}
        id={helperTextId}
      >
        {errorText || helperText}
      </HelperText>
    ) : null;

    let control = children;
    if (
      hasHelperText &&
      React.isValidElement<React.AriaAttributes>(children) &&
      children.type !== React.Fragment
    ) {
      const own = children.props;
      // A control that already points at helperTextId keeps one copy, so the text is read once.
      const describedBy = new Set(own['aria-describedby']?.split(/\s+/).filter(Boolean));
      describedBy.add(helperTextId);
      control = React.cloneElement(children, {
        'aria-describedby': [...describedBy].join(' '),
        'aria-invalid': errorText ? true : own['aria-invalid'],
      });
    }

    const content = (
      <>
        <div className={formFieldLabelVariants({ variant })}>
          <FieldLabel {...props}>{label}</FieldLabel>
          {variant === 'horizontal' && helperTextComponent}
        </div>
        <div className={formFieldContentVariants({ variant })}>
          {control}
          {variant === 'vertical' && helperTextComponent}
        </div>
      </>
    );
    const combinedClassName = cn(formFieldVariants({ variant }), className);

    if (WrapperComponent === 'fieldset') {
      return (
        <fieldset
          ref={ref as React.Ref<HTMLFieldSetElement>}
          data-slot="form-field"
          className={combinedClassName}
        >
          {content}
        </fieldset>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-slot="form-field"
        className={combinedClassName}
      >
        {content}
      </div>
    );
  },
);

FormField.displayName = 'FormField';
