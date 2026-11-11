import type { RemixiconComponentType } from '@remixicon/react';
import { IconButton, Tooltip } from '@wideset/react';

type PreviewBarActionProps = {
  icon: RemixiconComponentType;
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

/** A quiet icon action in the preview's bars (the browser's, the console's), named by its tooltip. */
export function PreviewBarAction({ icon, label, ...props }: PreviewBarActionProps) {
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
