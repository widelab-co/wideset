/** Where the screen leads: replace with your routes. */
export const ROUTES = {
  /** Sign in with an e-mail and a password. */
  signIn: '#sign-in',
  signUp: '#sign-up',
  google: '#sign-in/google',
  microsoft: '#sign-in/microsoft',
};

export type SsoConnection = {
  workspace: string;
  provider: string;
  /** Where single sign-on starts: your server's SAML endpoint for the connection. */
  href: string;
};

/** E-mail domains with single sign-on set up. Your server answers this lookup. */
export const SSO_DOMAINS: Record<string, SsoConnection> = {
  'lumenstudio.co': { workspace: 'Lumen Studio', provider: 'Okta', href: '#sso/lumen-studio' },
};
