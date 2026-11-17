/** Where the screen leads: replace with your routes. */
export const ROUTES = {
  /** After the new password is saved. */
  app: '#app',
  signIn: '#sign-in',
};

/** The account the reset link belongs to: your server reads it from the link's token. */
export const ACCOUNT_EMAIL = 'maya@lumenstudio.co';

/** The shortest password the form accepts; password managers read it from `minLength` too. */
export const MIN_PASSWORD_LENGTH = 12;

/** How long a reset link works; the e-mail says the same. A no-break space keeps it on one line. */
export const LINK_LIFETIME = '30 minutes';

/** Seconds before a new link can be sent again. */
export const RESEND_COOLDOWN = 30;
