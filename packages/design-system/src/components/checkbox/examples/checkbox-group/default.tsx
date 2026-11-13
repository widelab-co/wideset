/** The playground's stage: three notification channels, two of them on, the group's props set from the rail. */
import { Checkbox, CheckboxGroup, type CheckboxGroupProps } from '@wideset/react';

export default function CheckboxGroupDefault(props: CheckboxGroupProps) {
  return (
    <CheckboxGroup aria-label="Notification channels" {...props}>
      <Checkbox label="Email" description="A daily digest at 8:00" defaultChecked />
      <Checkbox label="Push" description="Mentions and replies only" defaultChecked />
      <Checkbox label="SMS" description="Security alerts only" />
    </CheckboxGroup>
  );
}
