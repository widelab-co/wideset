// TODO(custom): Switch with a description line; Switch has no description part.
import { Switch } from '@wideset/react';
import { useId } from 'react';

/**
 * A setting that applies the moment it flips: its name and one line on the left, the switch on
 * the right edge. The name is the switch's label, the line its description.
 */
export function SwitchRow({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const descriptionId = useId();
  return (
    <Switch
      size="sm"
      labelPosition="left"
      className="w-full justify-between"
      aria-describedby={descriptionId}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
    >
      <Switch.Label>{label}</Switch.Label>
      <p id={descriptionId} className="typography-label-sm text-ws-static-subtle">
        {description}
      </p>
    </Switch>
  );
}
