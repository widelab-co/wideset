import type { KeyboardEvent } from 'react';

import { listStop } from '../lib/listStops.mjs';

/**
 * Arrow keys for a filter field over a list of links (a sidebar, the search palette): ArrowDown
 * and ArrowUp move between the field and the links, Home and End jump to the first and the last
 * link, Enter in the field opens the first link. Tab still moves through the page as usual, and
 * keys that belong to an IME composition are left alone. The rules are `listStop`; this applies
 * them. Put it on the element that holds both; `links` picks the list's links inside it.
 */
export const listKeys = (links: string) => (event: KeyboardEvent<HTMLElement>) => {
  const root = event.currentTarget;
  const field = root.querySelector<HTMLInputElement>('input');
  const items = [...root.querySelectorAll<HTMLElement>(links)];
  const stops = [...(field ? [field] : []), ...items];
  const action = listStop({
    key: event.key,
    at: stops.indexOf(event.target as HTMLElement),
    links: items.length,
    hasField: Boolean(field),
    // keyCode 229 is the IME's own keydown in browsers that do not set isComposing.
    composing: event.nativeEvent.isComposing || event.keyCode === 229,
    modified: event.altKey || event.ctrlKey || event.metaKey,
  });
  if (!action) return;
  event.preventDefault();
  if ('open' in action) {
    items[0].click();
    return;
  }
  stops[action.focus].focus();
  stops[action.focus].scrollIntoView({ block: 'nearest' });
};
