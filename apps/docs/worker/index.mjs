/**
 * Counts downloads of registry items. Runs only for /r/* (`assets.run_worker_first` in
 * wrangler.jsonc).
 *
 * Only production has the REGISTRY_DOWNLOADS binding, so staging and previews count nothing.
 * Stores no IP address.
 */
/* global URL */
// registry.json is the index of items, not an item.
const ITEM = /^\/r\/(?!registry\.json$)([^/]+)\.json$/;

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const item = new URL(request.url).pathname.match(ITEM)?.[1];
    if (item && request.method === 'GET' && response.ok) {
      try {
        env.REGISTRY_DOWNLOADS?.writeDataPoint({
          indexes: [item.slice(0, 96)],
          // The network and the user agent are what tell a person from CI (GitHub runners sit on
          // Microsoft's network).
          blobs: [
            item,
            request.headers.get('user-agent')?.slice(0, 256) ?? '',
            request.cf?.country ?? '',
            request.cf?.asOrganization ?? '',
          ],
          doubles: [1],
        });
      } catch {
        // Consumers' installs must not depend on the count.
      }
    }
    return response;
  },
};
