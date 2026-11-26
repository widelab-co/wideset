import { IconButton, type IconButtonProps, Tooltip } from '@wideset/react';
import { forwardRef } from 'react';

type IconActionProps = Omit<IconButtonProps, 'aria-label'> & {
  /** The action's name: the button's accessible name and the text of its tooltip. */
  label: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
};

/**
 * An icon-only action with its name in a tooltip, so no icon in a bar or under an answer has to
 * be guessed: a ghost `IconButton` at the bar's 32px unless told otherwise. It forwards its ref
 * and props, so it can also be the trigger of a menu.
 */
export const IconAction = forwardRef<HTMLButtonElement, IconActionProps>(
  ({ label, side = 'top', ...props }, ref) => (
    <Tooltip size="sm">
      <Tooltip.Trigger asChild>
        <IconButton
          ref={ref}
          variant="secondary"
          preset="ghost"
          size="sm"
          aria-label={label}
          {...props}
        />
      </Tooltip.Trigger>
      <Tooltip.Content side={side}>
        <Tooltip.Label>{label}</Tooltip.Label>
      </Tooltip.Content>
    </Tooltip>
  ),
);

IconAction.displayName = 'IconAction';
