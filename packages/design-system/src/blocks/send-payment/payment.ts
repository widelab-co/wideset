import { ARRIVAL_DAYS, balance, FEE, today } from './data';
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

export const feeFor = (amount: number) => Math.min(Math.round(amount * FEE.rate), FEE.max);

/** The most that can be sent: the balance has to cover the fee too. */
export const maxAmount = balance - feeFor(balance);

/** An ISO date a number of bank days later: Saturdays and Sundays do not count. */
const addBankDays = (iso: string, days: number) => {
  const date = new Date(iso);
  while (days > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    if (date.getUTCDay() !== 0 && date.getUTCDay() !== 6) days -= 1;
  }
  return date.toISOString().slice(0, 10);
};

/** What a valid payment comes to: the fee, what leaves the balance, when it goes and arrives. */
export function quotePayment(values: PaymentValues) {
  const amount = parseAmount(values.amount);
  const fee = feeFor(amount);
  const sendDate = values.when === 'date' && values.date ? values.date : today;

  return {
    amount,
    fee,
    total: amount + fee,
    sendDate,
    scheduled: sendDate > today,
    arrival: addBankDays(sendDate, ARRIVAL_DAYS),
  };
}

export type PaymentQuote = ReturnType<typeof quotePayment>;

/** What is wrong with the payment, by field; empty when it can go to review. */
export function validatePayment(values: PaymentValues): PaymentErrors {
  const errors: PaymentErrors = {};
  const amount = parseAmount(values.amount);

  if (!values.recipientId) errors.recipientId = 'Choose who gets the payment.';

  if (!values.amount.trim()) errors.amount = 'Enter an amount.';
  else if (!(amount > 0)) errors.amount = 'Enter an amount above zero, like 250.00.';
  else if (amount > maxAmount)
    errors.amount = `Enter ${formatUsd(maxAmount)} or less. The balance has to cover the fee too.`;

  if (values.when === 'date') {
    if (!values.date) errors.date = 'Pick the day to send it.';
    else if (values.date < today) errors.date = 'That day has passed. Pick today or later.';
  }

  return errors;
}
