/** The product the account is set up for. */
export const PRODUCT = 'Orbit';

/** Where the links lead: replace with your routes. */
export const ROUTES = {
  terms: '#terms',
};

/** The countries a card can be billed in; the first is preselected. */
export const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'pl', label: 'Poland' },
  { value: 'gb', label: 'United Kingdom' },
];

/**
 * The setup's steps, in order. The title names the step in the list and heads its form; the
 * description is the line under that heading.
 */
export const STEPS = [
  { title: 'Personal Information', description: 'Your name and how your team reaches you.' },
  {
    title: 'Payment Information',
    description: `By providing your card information, you allow ${PRODUCT} to charge your card for future payments in accordance with their terms.`,
  },
  { title: 'Organization', description: 'The workspace your projects live in.' },
  { title: 'Invite Team', description: 'The people you work with, and what each can do.' },
  { title: 'Review', description: 'A last look before the account is ready.' },
];

/** The step the setup opens on and the only one with a form here: the card. */
export const PAYMENT_STEP = 1;
