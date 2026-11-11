/** Where the screen leads: replace with your routes. */
export const ROUTES = {
  /** After continuing as one of the accounts below. */
  app: '#app',
  signIn: '#sign-in',
  signUp: '#sign-up',
};

export type Account = {
  id: string;
  name: string;
  email: string;
  initials: string;
};

/** Accounts still signed in on this device: your server reads them from the device's sessions. */
export const ACCOUNTS: Account[] = [
  {
    id: 'maya',
    name: 'Maya Okafor',
    email: 'maya@lumenstudio.co',
    initials: 'MO',
  },
  {
    id: 'jonas',
    name: 'Jonas Weber',
    email: 'jonas@lumenstudio.co',
    initials: 'JW',
  },
];
