/** Where the screen leads: replace with your routes. */
export const ROUTES = {
  signUp: '#sign-up',
  /** The form that asked for the link, to send it somewhere else. */
  magicLink: '#magic-link',
  gmail: 'https://mail.google.com/mail/u/0/#inbox',
  outlook: 'https://outlook.live.com/mail/0/inbox',
};

/** The address the sign-in link went to. */
export const SENT_TO = 'maya@lumenstudio.co';

/** How long the link works; the e-mail says the same. A no-break space keeps it on one line. */
export const LINK_LIFETIME = '15 minutes';

/** Seconds before the link can be sent again. */
export const RESEND_COOLDOWN = 30;
