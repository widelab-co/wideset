'use client';

import { type RefObject, useEffect, useState } from 'react';

/** What Tab reaches: focusable elements, minus those taken out of the order with a negative tabindex. */
const TABBABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
]
  .map((selector) => `${selector}:not([tabindex^="-"])`)
  .join(',');

/**
 * Whether the viewport needs a tab stop of its own: its content overflows and holds nothing a
 * keyboard user can tab to, so they could not scroll it otherwise. Chrome and Firefox do this for
 * a native scroll container, Safari does not. Content with a link, button or field needs no extra
 * stop: tabbing to them scrolls them into view, and the arrow keys then scroll the area.
 */
export const useScrollTabStop = (viewportRef: RefObject<HTMLDivElement | null>) => {
  const [tabStop, setTabStop] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    // 1px of slack: fractional heights round scrollHeight up without anything to scroll.
    const update = () =>
      setTabStop(
        (viewport.scrollHeight - viewport.clientHeight > 1 ||
          viewport.scrollWidth - viewport.clientWidth > 1) &&
          !viewport.querySelector(TABBABLE),
      );
    update();
    const resize = new ResizeObserver(update);
    resize.observe(viewport);
    // Radix's content wrapper: it resizes when the content does.
    if (viewport.firstElementChild) resize.observe(viewport.firstElementChild);
    const mutation = new MutationObserver(update);
    mutation.observe(viewport, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['tabindex', 'disabled', 'href', 'contenteditable'],
    });
    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, [viewportRef]);

  return tabStop;
};
