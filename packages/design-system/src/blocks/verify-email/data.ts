/** Where the screen leads: replace with your routes. */
export const ROUTES = {
  /** After the address is verified: the first step of setting up. */
  next: '#onboarding',
  /** Back to the sign-up form, to correct the address. */
  changeEmail: '#sign-up',
  signIn: '#sign-in',
};

/** The address the code went to, as typed at sign-up. */
export const SENT_TO = 'maya@lumenstudio.co';

export const CODE_LENGTH = 6;

/** Seconds before the code can be sent again. */
export const RESEND_COOLDOWN = 30;

/** The code this demo accepts; any other shows the wrong-code error. A server checks it. */
export const DEMO_CODE = '305817';
