const ITEM = '[role="treeitem"]';

/**
 * The items on screen, in reading order. A shut group renders nothing, so every item in the
 * tree's DOM is one the keyboard can reach.
 */
export const visibleItems = (tree: HTMLElement) =>
  Array.from(tree.querySelectorAll<HTMLElement>(ITEM));

/** The item that holds this one, or none at the root. */
export const parentItem = (item: HTMLElement) =>
  item.parentElement?.closest<HTMLElement>(ITEM) ?? null;

/** The item's name: the text its `aria-labelledby` points to. */
export const labelOf = (item: HTMLElement) => {
  const id = item.getAttribute('aria-labelledby');
  return (id && item.ownerDocument.getElementById(id)?.textContent?.trim()) || '';
};

/**
 * Type-ahead: the next item after `from`, wrapping round, whose name starts with `char`.
 * ponytail: one character at a time; buffer keystrokes ("src") if long sibling lists need it.
 */
export const typeAheadTarget = (items: HTMLElement[], from: number, char: string) => {
  const needle = char.toLocaleLowerCase();
  for (let step = 1; step <= items.length; step++) {
    const item = items[(from + step) % items.length];
    if (labelOf(item).toLocaleLowerCase().startsWith(needle)) return item;
  }
  return undefined;
};
