import { Button, DatePicker, FormField, Modal, Select, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { account, CUSTOMERS, type Deal, PEOPLE, type StageId, STAGES } from './data';

const EMPTY = { customer: '', name: '', amount: '', close: '', ownerId: 'maya' };

/**
 * A new deal: the customer, a name, the amount and when it should close, who owns it (Maya unless
 * changed) and its stage (the column it was started from). It is a form, so Enter adds it; the
 * errors wait for the first try.
 */
export function NewDealDialog({
  stage,
  open,
  onOpenChange,
  onCreate,
}: {
  stage: StageId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (deal: Omit<Deal, 'id'>) => void;
}) {
  const id = useId();
  const [values, setValues] = useState({ ...EMPTY, stage });
  const [tried, setTried] = useState(false);
  const set = (next: Partial<typeof values>) => setValues({ ...values, ...next });

  const amount = Number(values.amount.replace(/[^0-9.]/g, ''));
  const errors = {
    customer: values.customer ? undefined : 'Choose the customer.',
    name: values.name.trim() ? undefined : 'Name the deal, like “Annual plan, 40 seats”.',
    amount: amount > 0 ? undefined : 'Enter the amount in US dollars, like 12,000.',
    close: values.close ? undefined : 'Pick the day you expect it to close.',
  };
  const shown = (field: keyof typeof errors) => (tried ? errors[field] : undefined);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTried(true);
    const first = (Object.keys(errors) as (keyof typeof errors)[]).find((field) => errors[field]);
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    onCreate({ ...values, name: values.name.trim(), amount, stage: values.stage as StageId });
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setValues({ ...EMPTY, stage });
          setTried(false);
        }
        onOpenChange(next);
      }}
    >
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>New deal</Modal.Title>
          <Modal.Description>
            It goes on the board in its stage, owned by {account.name} unless you change it.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <form id={id} noValidate onSubmit={submit} className="gap-ws-11 flex flex-col">
            <FormField label="Customer" htmlFor={`${id}-customer`} errorText={shown('customer')}>
              <Select
                id={`${id}-customer`}
                className="w-full"
                placeholder="Choose a customer"
                variant={shown('customer') ? 'danger' : 'primary'}
                options={CUSTOMERS.map((name) => ({ value: name, label: name }))}
                value={values.customer}
                onValueChange={(customer) => set({ customer })}
              />
            </FormField>
            <FormField label="Deal name" htmlFor={`${id}-name`} errorText={shown('name')}>
              <TextInput
                id={`${id}-name`}
                autoComplete="off"
                placeholder="Annual plan, 40 seats"
                variant={shown('name') ? 'danger' : 'primary'}
                value={values.name}
                onChange={(event) => set({ name: event.target.value })}
              />
            </FormField>
            <div className="gap-ws-9 grid grid-cols-2">
              <FormField label="Amount" htmlFor={`${id}-amount`} errorText={shown('amount')}>
                <TextInput
                  id={`${id}-amount`}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="12,000"
                  variant={shown('amount') ? 'danger' : 'primary'}
                  value={values.amount}
                  onChange={(event) => set({ amount: event.target.value })}
                />
              </FormField>
              <FormField label="Close date" htmlFor={`${id}-close`} errorText={shown('close')}>
                <DatePicker
                  id={`${id}-close`}
                  className="w-full"
                  placeholder="Pick a day"
                  variant={shown('close') ? 'danger' : 'primary'}
                  selected={values.close || undefined}
                  onSelect={(close) => set({ close: close ?? '' })}
                />
              </FormField>
              <FormField label="Owner" htmlFor={`${id}-owner`}>
                <Select
                  id={`${id}-owner`}
                  className="w-full"
                  options={PEOPLE.map(({ id: value, name }) => ({ value, label: name }))}
                  value={values.ownerId}
                  onValueChange={(ownerId) => set({ ownerId })}
                />
              </FormField>
              <FormField label="Stage" htmlFor={`${id}-stage`}>
                <Select
                  id={`${id}-stage`}
                  className="w-full"
                  options={STAGES.map(({ id: value, label }) => ({ value, label }))}
                  value={values.stage}
                  onValueChange={(next) => set({ stage: next as StageId })}
                />
              </FormField>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Button type="submit" form={id}>
            Add deal
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
