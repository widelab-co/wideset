import { today } from './data';

/** A card typed in by hand. Every value is the text in its field. */
export type CardValues = { number: string; expiry: string; cvc: string };
export type CardErrors = Partial<Record<keyof CardValues, string>>;

export const emptyCard: CardValues = { number: '', expiry: '', cvc: '' };

const digits = (text: string) => text.replace(/\D/g, '');

/** `4242424242424242` → `4242 4242 4242 4242`, as it is typed. */
export const formatCardNumber = (text: string) =>
  digits(text)
    .slice(0, 19)
    .replace(/(.{4})(?=.)/g, '$1 ');

/** `1228` → `12 / 28`, as it is typed. */
export const formatCardExpiry = (text: string) => {
  const value = digits(text).slice(0, 4);
  return value.length > 2 ? `${value.slice(0, 2)} / ${value.slice(2)}` : value;
};

export const formatCardCvc = (text: string) => digits(text).slice(0, 4);

export type CardBrand = 'visa' | 'mastercard' | 'card';

/** The brand a number starts as: enough to show the mark, not to accept the card. */
export const cardBrand = (number: string): CardBrand =>
  /^4/.test(number) ? 'visa' : /^(5[1-5]|2[2-7])/.test(number) ? 'mastercard' : 'card';

/** The Luhn check every card number passes: it catches a mistyped digit before the bank does. */
const passesLuhn = (number: string) =>
  [...number].reverse().reduce((sum, digit, index) => {
    const value = Number(digit) * (index % 2 ? 2 : 1);
    return sum + (value > 9 ? value - 9 : value);
  }, 0) %
    10 ===
  0;

/**
 * What is wrong with a card, by field; empty when it can be charged. Checked when paying, never
 * while typing. Swap this (and the fields) for your payment provider's own when you connect one.
 */
export function validateCard(card: CardValues): CardErrors {
  const errors: CardErrors = {};
  const number = digits(card.number);
  const expiry = digits(card.expiry);
  const [year, month] = today.split('-').map(Number);

  if (!number) errors.number = 'Enter the card number.';
  else if (number.length < 13 || !passesLuhn(number))
    errors.number = 'Check the card number, a digit looks wrong.';

  if (expiry.length < 4) errors.expiry = 'Enter the expiry date.';
  else {
    const expiryMonth = Number(expiry.slice(0, 2));
    const expiryYear = 2000 + Number(expiry.slice(2));
    if (expiryMonth < 1 || expiryMonth > 12) errors.expiry = 'Month is 01 to 12.';
    else if (expiryYear < year || (expiryYear === year && expiryMonth < month))
      errors.expiry = 'This card has expired.';
  }

  if (card.cvc.length < 3) errors.cvc = 'Enter 3 or 4 digits.';

  return errors;
}
