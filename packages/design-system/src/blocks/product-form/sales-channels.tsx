import { Checkbox, CheckboxGroup } from '@wideset/react';

import { channels } from './data';
import { FormSection } from './form-section';

type SalesChannelsProps = {
  selected: string[];
  onChange: (selected: string[]) => void;
};

/** Where the product can be bought once it is on sale: one checkbox a channel. */
export function SalesChannels({ selected, onChange }: SalesChannelsProps) {
  return (
    <FormSection title="Visibility" description="Where customers can buy it.">
      <CheckboxGroup aria-label="Sales channels">
        {channels.map((channel) => (
          <Checkbox
            key={channel.id}
            size="sm"
            label={channel.label}
            checked={selected.includes(channel.id)}
            onCheckedChange={(on) =>
              onChange(
                on === true
                  ? [...selected, channel.id]
                  : selected.filter((id) => id !== channel.id),
              )
            }
          />
        ))}
      </CheckboxGroup>
    </FormSection>
  );
}
