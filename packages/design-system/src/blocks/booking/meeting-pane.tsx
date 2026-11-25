import { FormField, Select } from '@wideset/react';
import { useId } from 'react';

import { attendees, meetingTypes, places } from './data';
import { PeopleList } from './people-list';

const TYPE_OPTIONS = meetingTypes.map(({ id, name, minutes }) => ({
  value: id,
  label: `${name}, ${minutes} min`,
}));

type MeetingPaneProps = {
  typeId: string;
  onTypeChange: (typeId: string) => void;
  place: string;
  onPlaceChange: (place: string) => void;
};

/**
 * The first of the three parts: what the meeting is, who will be there and where. The type and the
 * place are menus, not radio cards: the brand colour stays with the day and the time chosen.
 */
export function MeetingPane({ typeId, onTypeChange, place, onPlaceChange }: MeetingPaneProps) {
  const typeField = useId();
  const placeField = useId();
  const whoId = useId();
  const detail = places.find(({ value }) => value === place)?.detail;

  return (
    <div className="gap-ws-11 flex flex-col">
      <FormField label="Meeting" htmlFor={typeField}>
        <Select
          id={typeField}
          size="sm"
          className="w-full"
          options={TYPE_OPTIONS}
          value={typeId}
          onValueChange={onTypeChange}
        />
      </FormField>

      <div className="gap-ws-5 flex flex-col">
        <h3 id={whoId} className="typography-label-strong-sm text-ws-static-strong">
          Who will be there
        </h3>
        <PeopleList people={attendees} labelledBy={whoId} />
      </div>

      <FormField label="Where" htmlFor={placeField} helperText={detail}>
        <Select
          id={placeField}
          size="sm"
          className="w-full"
          options={places}
          value={place}
          onValueChange={onPlaceChange}
        />
      </FormField>
    </div>
  );
}
