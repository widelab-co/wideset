import {
  Button,
  Card,
  DatePicker,
  FormField,
  RadioButton,
  RadioButtonGroup,
  Select,
  TextInput,
} from '@wideset/react';
import type { FormEvent } from 'react';

import { balance, FEE, recipientLabel, recipients, ROUTES, today } from './data';
import { formatAmount, formatPercent, formatUsd } from './format';
import { feeFor, parseAmount, type PaymentErrors, type PaymentValues, type When } from './payment';

const SAMPLE_TODAY = new Date(`${today}T00:00`);

const RECIPIENT_OPTIONS = recipients.map((recipient) => ({
  value: recipient.id,
  label: recipientLabel(recipient),
}));

type PaymentFormProps = {
  /** Prefix of the fields' ids (`<id>-amount`), so the screen can focus the first one in error. */
  id: string;
  values: PaymentValues;
  errors: PaymentErrors;
  onChange: (patch: Partial<PaymentValues>) => void;
  /** Called on submit; the screen checks the values and decides whether to go on. */
  onSubmit: () => void;
};

/**
 * The payment, in one column and in the order it is thought of: who gets it, how much, when, and
 * the line they will see on their statement. The balance and the fee stand under the amount,
 * where they are needed, and the fee follows what is typed. The screen holds the values and the
 * errors; nothing is checked while typing, everything on submit.
 */
export function PaymentForm({ id, values, errors, onChange, onSubmit }: PaymentFormProps) {
  const amount = parseAmount(values.amount);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form noValidate onSubmit={submit}>
      <Card>
        {/* Card.Content keeps 10px free on its right for a scrollbar: the padding gives it back. */}
        <Card.Content contentClassName="pr-ws-6">
          <div className="gap-ws-11 flex flex-col">
            <FormField
              label="Recipient"
              htmlFor={`${id}-recipientId`}
              errorText={errors.recipientId}
            >
              <Select
                id={`${id}-recipientId`}
                name="recipient"
                size="sm"
                className="w-full"
                hasSearch
                required
                options={RECIPIENT_OPTIONS}
                placeholder="Choose a recipient"
                value={values.recipientId}
                onValueChange={(recipientId) => onChange({ recipientId })}
                variant={errors.recipientId ? 'danger' : 'primary'}
              />
            </FormField>

            <FormField
              label="Amount"
              htmlFor={`${id}-amount`}
              helperText={
                amount > 0
                  ? `${formatUsd(balance)} available. The fee for this payment is ${formatUsd(feeFor(amount))}.`
                  : `${formatUsd(balance)} available. The fee is ${formatPercent(FEE.rate)}, ${formatUsd(FEE.max)} at most.`
              }
              errorText={errors.amount}
            >
              <TextInput
                id={`${id}-amount`}
                name="amount"
                size="sm"
                required
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                variant={errors.amount ? 'danger' : 'primary'}
                value={values.amount}
                onChange={(event) =>
                  onChange({ amount: event.target.value.replace(/[^\d.,]/g, '') })
                }
                // Leaving the field settles what was typed into an amount: 4250 → 4,250.00.
                onBlur={() => amount > 0 && onChange({ amount: formatAmount(amount) })}
              >
                <TextInput.Prefix>$</TextInput.Prefix>
                <TextInput.Input className="tabular-nums" />
              </TextInput>
            </FormField>

            <div className="gap-ws-9 grid grid-cols-2 items-start">
              <FormField label="Send" id={`${id}-when`} WrapperComponent="fieldset">
                {/* As tall as the date field beside it, so the two rows share a centre line. */}
                <RadioButtonGroup
                  orientation="horizontal"
                  aria-labelledby={`${id}-when`}
                  className="min-h-ws-14 items-center"
                  value={values.when}
                  onValueChange={(when) => onChange({ when: when as When })}
                >
                  <RadioButton value="now" label="Now" />
                  <RadioButton value="date" label="On a date" />
                </RadioButtonGroup>
              </FormField>
              {values.when === 'date' && (
                <FormField label="Date" htmlFor={`${id}-date`} errorText={errors.date}>
                  <DatePicker
                    id={`${id}-date`}
                    size="sm"
                    className="w-full"
                    dateFormat="MMM d, yyyy"
                    placeholder="Pick a date"
                    // The sample's own today, so the calendar agrees with the rest of the screen;
                    // drop both to follow the clock.
                    today={SAMPLE_TODAY}
                    defaultMonth={SAMPLE_TODAY}
                    selected={values.date}
                    onSelect={(date) => onChange({ date })}
                    variant={errors.date ? 'danger' : 'primary'}
                  />
                </FormField>
              )}
            </div>

            <FormField
              label="Reference"
              suffix="(optional)"
              htmlFor={`${id}-reference`}
              helperText="The recipient sees it on their statement."
            >
              <TextInput
                id={`${id}-reference`}
                name="reference"
                size="sm"
                maxLength={60}
                autoComplete="off"
                value={values.reference}
                onChange={(event) => onChange({ reference: event.target.value })}
              />
            </FormField>
          </div>
        </Card.Content>
        <Card.Footer className="gap-ws-5 justify-end">
          <Button asChild size="sm" variant="secondary" preset="ghost">
            <a href={ROUTES.transfers}>Cancel</a>
          </Button>
          <Button type="submit" size="sm">
            Review payment
          </Button>
        </Card.Footer>
      </Card>
    </form>
  );
}
