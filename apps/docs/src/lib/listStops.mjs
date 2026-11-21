/**
 * What a key does in a filter field over a list of links (`components/listKeys.ts` applies it to
 * the DOM). The stops are the field, when there is one, then the links; `at` is the focused stop.
 * Plain JavaScript so `node --test` checks it without a DOM (scripts/listStops.test.mjs).
 *
 * @param {object} state
 * @param {string} state.key `KeyboardEvent.key`
 * @param {number} state.at index of the focused stop, -1 when focus is elsewhere
 * @param {number} state.links how many links the list shows
 * @param {boolean} state.hasField whether the field is the first stop
 * @param {boolean} [state.composing] an IME composition is in progress
 * @param {boolean} [state.modified] Alt, Ctrl or Meta is held
 * @returns {{ open: true } | { focus: number } | null} open the first link, focus a stop, or
 *   leave the key to the browser
 */
export const listStop = ({ key, at, links, hasField, composing = false, modified = false }) => {
  // Keys that belong to an IME (Enter commits the text) or to a shortcut are not ours.
  if (composing || modified || at === -1) return null;
  const inField = hasField && at === 0;
  if (key === 'Enter') return inField && links > 0 ? { open: true } : null;
  // In the field Home and End move the caret.
  if ((key === 'Home' || key === 'End') && inField) return null;
  const last = (hasField ? 1 : 0) + links - 1;
  const first = hasField ? 1 : 0;
  if (last < first && key !== 'ArrowUp') return null;
  const next = {
    ArrowDown: Math.min(at + 1, last),
    ArrowUp: Math.max(at - 1, 0),
    Home: first,
    End: last,
  }[key];
  // At either end the focus stays put, and the key still does not scroll the page.
  return next === undefined ? null : { focus: next };
};
