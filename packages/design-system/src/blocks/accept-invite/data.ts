/** Where the screen leads: replace with your routes. */
export const ROUTES = {
  /** After the account is created and the invitation accepted. */
  app: '#app',
  /** Sign in with an existing account; the invitation is accepted after it. */
  signIn: '#sign-in',
  terms: '#terms',
  privacy: '#privacy',
};

/** The shortest password the form accepts; password managers read it from `minLength` too. */
export const MIN_PASSWORD_LENGTH = 8;

/** The invitation this link opened: your server reads it from the link's token. */
export const INVITATION = {
  workspace: 'Lumen Studio',
  role: 'Editor',
  email: 'daniel.ortiz@lumenstudio.co',
  invitedBy: { name: 'Maya Kowalski', initials: 'MK' },
};
