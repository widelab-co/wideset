/*
  Orbit, a customer and revenue platform. Someone followed an old link to a report in the Lumen
  Studio workspace that has since been deleted.
*/

/** The address that was not found. A real screen shows `window.location.href`. */
export const missingUrl = 'https://app.orbit.so/lumen-studio/reports/q3-board-pack';

export const supportEmail = 'support@orbit.so';

/** Where the ways back lead: replace with your routes. */
export const ROUTES = {
  dashboard: '#dashboard',
  // The missing address goes along in the subject, so support knows what was opened.
  support: `mailto:${supportEmail}?subject=${encodeURIComponent(`Page not found: ${missingUrl}`)}`,
};
