import { samplePayment, today } from './data';
import { formatUsd } from './format';

export type When = 'now' | 'date';

/** The payment as the form holds it. The amount is the text in its field. */
export type PaymentValues = {
  recipientId: string;
  amount: string;
  when: When;
  /** The day to send it, when `when` is `date`. */
  date?: string;
  reference: string;
};

export type PaymentField = 'recipientId' | 'amount' | 'date';
export type PaymentErrors = Partial<Record<PaymentField, string>>;

export const emptyPayment: PaymentValues = {
  recipientId: '',
  amount: '',
  when: 'now',
  reference: '',
};

/** The payment the screen opens with: this quarter's commission for Halcyon Freight. */
export const draftPayment: PaymentValues = {
  recipientId: 'halcyon-freight',
  amount: '4,250.00',
  when: 'now',
  reference: 'Partner commission, Q3 2026',
};

/** `4,250.5` → 425050 cents. Not a number, or nothing typed: NaN. */
export const parseAmount = (text: string) =>
  text.trim() ? Math.round(Number(text.replace(/,/g, '')) * 100) : NaN;

/** Combine the form values and sample fee for the review and receipt. */
export function summarizePayment(values: PaymentValues) {
  const amount = parseAmount(values.amount);
  const sendDate = values.when === 'date' && values.date ? values.date : today;

  return {
    amount,
    fee: samplePayment.fee,
    total: amount + samplePayment.fee,
    sendDate,
    scheduled: sendDate > today,
    arrival: sendDate === today ? samplePayment.arrival : undefined,
  };
}

export type PaymentSummary = ReturnType<typeof summarizePayment>;

/** Field errors to illustrate form validation before review. */
export function validatePaymentForm(values: PaymentValues): PaymentErrors {
  const errors: PaymentErrors = {};
  const amount = parseAmount(values.amount);

  if (!values.recipientId) errors.recipientId = 'Choose who gets the payment.';

  if (!values.amount.trim()) errors.amount = 'Enter an amount.';
  else if (!Number.isFinite(amount) || amount <= 0)
    errors.amount = 'Enter an amount above zero, like 250.00.';
  else if (amount + samplePayment.fee > samplePayment.balance)
    errors.amount = `Enter ${formatUsd(samplePayment.balance - samplePayment.fee)} or less. The balance has to cover the fee too.`;

  if (values.when === 'date') {
    if (!values.date) errors.date = 'Pick the day to send it.';
    else if (values.date < today) errors.date = 'That day has passed. Pick today or later.';
  }

  return errors;
}
