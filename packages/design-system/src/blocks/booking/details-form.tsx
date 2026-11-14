import { Button, FormField, MultiSelect, Textarea } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { agendaTemplate, contact, guests } from './data';

export type Details = { agenda: string; guests: string[]; note: string };

type DetailsFormProps = {
  initial?: Details;
  onBack: () => void;
  onBook: (details: Details) => void;
};

/**
 * The details step: the agenda (filled in from the meeting type, so it is edited rather than
 * written), who else to invite and a note for the customer. Book meeting is the one filled button;
 * Back is the ghost way out. The agenda cannot be empty: it is what the customer prepares from.
 */
export function DetailsForm({ initial, onBack, onBook }: DetailsFormProps) {
  const agendaId = useId();
  const guestsId = useId();
  const noteId = useId();
  const firstName = contact.name.split(' ')[0];
  const [agenda, setAgenda] = useState(initial?.agenda ?? agendaTemplate);
  const [invited, setInvited] = useState<string[]>(initial?.guests ?? []);
  const [note, setNote] = useState(initial?.note ?? '');
  const [error, setError] = useState<string>();

  const submit = (formEvent: FormEvent) => {
    formEvent.preventDefault();
    if (!agenda.trim()) return setError(`Add at least one topic, so ${firstName} can prepare.`);
    onBook({ agenda: agenda.trim(), guests: invited, note: note.trim() });
  };

  return (
    <form noValidate onSubmit={submit} className="gap-ws-11 flex flex-col">
      <FormField
        label="Agenda"
        htmlFor={agendaId}
        required
        helperText="One topic a line. It goes in the invitation."
        errorText={error}
      >
        <Textarea
          id={agendaId}
          size="sm"
          rows={4}
          required
          value={agenda}
          onChange={(changeEvent) => {
            setAgenda(changeEvent.target.value);
            if (error) setError(undefined);
          }}
        />
      </FormField>

      <FormField label="Who else to invite" htmlFor={guestsId}>
        <MultiSelect
          id={guestsId}
          size="sm"
          className="w-full"
          options={guests}
          value={invited}
          onValueChange={setInvited}
          placeholder="Add people"
          multiValuesLabel="people"
          hasSearch
        />
      </FormField>

      <FormField label={`Note to ${firstName}`} htmlFor={noteId} suffix="Optional">
        <Textarea
          id={noteId}
          size="sm"
          rows={3}
          placeholder="Anything she should bring or read first"
          value={note}
          onChange={(changeEvent) => setNote(changeEvent.target.value)}
        />
      </FormField>

      <div className="gap-ws-5 flex justify-end">
        <Button variant="secondary" preset="ghost" size="sm" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="sm">
          Book meeting
        </Button>
      </div>
    </form>
  );
}
