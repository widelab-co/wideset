/** Vertical is the default and the safer choice: labels of any length line up and descriptions have room. Go horizontal only for two or three short labels with no descriptions. Either way the group needs a name: `aria-labelledby` pointing at its heading, or `aria-label` when there is none. */
import { Checkbox, CheckboxGroup } from '@wideset/react';

export default function CheckboxGroupOrientation() {
  return (
    <div className="gap-ws-14 flex flex-wrap items-start justify-center">
      <CheckboxGroup orientation="vertical" aria-label="Notification channels">
        <Checkbox label="Email" description="A daily digest at 8:00" defaultChecked />
        <Checkbox label="Push" description="Mentions and replies only" defaultChecked />
        <Checkbox label="SMS" description="Security alerts only" />
      </CheckboxGroup>
      <CheckboxGroup orientation="horizontal" aria-label="Alert channels">
        <Checkbox label="Email" defaultChecked />
        <Checkbox label="Push" defaultChecked />
        <Checkbox label="SMS" />
      </CheckboxGroup>
    </div>
  );
}
