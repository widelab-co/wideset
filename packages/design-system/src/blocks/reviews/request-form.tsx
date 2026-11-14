import { FormField, Select, Textarea } from '@wideset/react';
import { type FormEvent, useState } from 'react';

import type { ReviewRequest } from './data';
import { formatDate } from './format';
import { RequestPreview } from './request-preview';

type RequestFormProps = {
  /** The form's id: the submit button sits in the modal's footer and points at it with `form`. */
  id: string;
  /** The closed deals nobody has been asked about yet. */
  requests: ReviewRequest[];
  /** Called with the chosen deal and the note once a customer is picked. */
  onSend: (request: ReviewRequest, message: string) => void;
};

/**
 * Asking for a review: pick the customer, add a note or not, see what they will get. The customer
 * is the one thing it cannot go without: sending without one says so at the field. Under the
 * field, who the request goes to, so nobody has to open the deal to check.
 */
export function RequestForm({ id, requests, onSend }: RequestFormProps) {
  const [requestId, setRequestId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string>();
  const request = requests.find((item) => item.id === requestId);

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (request) onSend(request, message.trim());
    else {
      setError('Choose a customer.');
      document.getElementById(`${id}-customer`)?.focus();
    }
  };

  return (
    <form id={id} noValidate onSubmit={send} className="gap-ws-11 flex flex-col">
      <FormField
        label="Customer"
        htmlFor={`${id}-customer`}
        errorText={error}
        helperText={
          request
            ? `Goes to ${request.person}, the contact on ${request.deal}, closed ${formatDate(request.closed)}.`
            : 'Customers with a closed deal and no review yet.'
        }
      >
        <Select
          id={`${id}-customer`}
          name="customer"
          className="w-full"
          options={requests.map((item) => ({ value: item.id, label: item.customer }))}
          placeholder="Choose a customer"
          required
          value={requestId}
          onValueChange={(value) => {
            setRequestId(value);
            setError(undefined);
          }}
          variant={error ? 'danger' : 'primary'}
        />
      </FormField>
      <FormField label="Message" suffix="(optional)" htmlFor={`${id}-message`}>
        <Textarea
          id={`${id}-message`}
          name="message"
          rows={3}
          resize="none"
          placeholder="Add a line of your own"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </FormField>
      <FormField label="What the customer sees">
        <RequestPreview message={message} />
      </FormField>
    </form>
  );
}
