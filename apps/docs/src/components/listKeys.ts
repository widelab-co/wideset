import type { KeyboardEvent } from 'react';

/**
 * Lets a keyboard user move through a filtered list of links (the sidebar, the search palette)
 * with the arrow keys, Home and End, and open the first match with Enter.
 */
export const listKeys = (links: string) => (event: KeyboardEvent<HTMLElement>) => {
  // An IME composing text, or a shortcut, owns the key.
  if (event.nativeEvent.isComposing || event.keyCode === 229) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  const field = event.currentTarget.querySelector<HTMLInputElement>('input');
  const items = [...event.currentTarget.querySelectorAll<HTMLElement>(links)];
  const stops = [...(field ? [field] : []), ...items];
  const at = stops.indexOf(event.target as HTMLElement);
  if (at === -1) return;
  const inField = field !== null && at === 0;

  if (event.key === 'Enter') {
    if (!inField || !items[0]) return;
    event.preventDefault();
    items[0].click();
    return;
  }
  // In the field, Home and End move the caret.
  if (inField && (event.key === 'Home' || event.key === 'End')) return;

  const first = field ? 1 : 0;
  const last = stops.length - 1;
  const next = {
    ArrowDown: Math.min(at + 1, last),
    ArrowUp: Math.max(at - 1, 0),
    Home: first,
    End: last,
  }[event.key];
  if (next === undefined) return;
  event.preventDefault();
  stops[next].focus();
  stops[next].scrollIntoView({ block: 'nearest' });
};
