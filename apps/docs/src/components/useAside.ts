import { useSyncExternalStore } from 'react';

/** The page's rail column shows from `xl` (DocsLayout). */
const WIDE = '(min-width: 80rem)';

const subscribe = (onChange: () => void) => {
  const query = matchMedia(WIDE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/**
 * The element with this id in the page's right rail, while the rail is on screen; otherwise
 * null, and the caller renders its side part inline. The server and the first render return
 * null, so the caller hides its inline copy from `xl` with CSS to avoid a flash.
 */
export const useAside = (id?: string) =>
  useSyncExternalStore(
    subscribe,
    () => (id && matchMedia(WIDE).matches ? document.getElementById(id) : null),
    () => null,
  );
