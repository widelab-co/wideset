import type { KeyboardEvent } from 'react';

/**
 * Arrow keys for a filter field over a list of links (a sidebar, the search palette): ArrowDown
 * and ArrowUp move between the field and the links, Home and End jump to the first and the last
 * link, Enter in the field opens the first link. Tab still moves through the page as usual.
 * Put it on the element that holds both; `links` picks the list's links inside it.
 */
export const listKeys = (links: string) => (event: KeyboardEvent<HTMLElement>) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const root = event.currentTarget;
  const field = root.querySelector<HTMLInputElement>('input');
  const items = [...root.querySelectorAll<HTMLElement>(links)];
  const target = event.target as HTMLElement;
  const inField = target === field;

  if (event.key === 'Enter' && inField) {
    if (!items[0]) return;
    event.preventDefault();
    items[0].click();
    return;
  }

  // In the field Home and End move the caret.
  if ((event.key === 'Home' || event.key === 'End') && inField) return;
  const stops = [...(field ? [field] : []), ...items];
  const at = stops.indexOf(target);
  if (at === -1) return;
  const next = {
    ArrowDown: Math.min(at + 1, stops.length - 1),
    ArrowUp: Math.max(at - 1, 0),
    Home: field ? 1 : 0,
    End: stops.length - 1,
  }[event.key];
  if (next === undefined || !stops[next]) return;
  event.preventDefault();
  stops[next].focus();
  stops[next].scrollIntoView({ block: 'nearest' });
};
