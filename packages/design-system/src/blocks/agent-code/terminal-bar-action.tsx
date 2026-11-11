import type { RemixiconComponentType } from '@remixicon/react';
import { IconButton, Tooltip } from '@wideset/react';

type TerminalBarActionProps = {
  icon: RemixiconComponentType;
  label: string;
  disabled?: boolean;
  /** Classes for the icon: how a swapped one arrives. */
  iconClassName?: string;
  onClick: () => void;
};

/** A quiet icon action in the terminal's bar, named by its tooltip. */
export function TerminalBarAction({ icon, label, ...props }: TerminalBarActionProps) {
  return (
    <Tooltip size="sm">
      <Tooltip.Trigger asChild>
        <IconButton
          icon={icon}
          aria-label={label}
          size="xs"
          variant="secondary"
          preset="ghost"
          {...props}
        />
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <Tooltip.Label>{label}</Tooltip.Label>
      </Tooltip.Content>
    </Tooltip>
  );
}
