import type { AvatarColor } from '@wideset/react';

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
  /** Pinned, so a person keeps the avatar colour the app's sidebar gives them. */
  color: AvatarColor;
};

/**
 * Accounts still signed in on this device: your server reads them from the device's sessions.
 * Maya Okafor just signed out, so hers is not among them; the admin account is the second one
 * the account menu lists on her browser.
 */
export const ACCOUNTS: Account[] = [
  {
    id: 'admin',
    name: 'Lumen Studio admin',
    email: 'admin@lumenstudio.co',
    initials: 'LA',
    color: 'purple',
  },
  {
    id: 'jonas',
    name: 'Jonas Weber',
    email: 'jonas@lumenstudio.co',
    initials: 'JW',
    color: 'blue',
  },
];
