import { type Appearance, commitAppearance, onAppearanceChange } from './theme';

/**
 * The documentation's side of the site contract (wideset-edge/SITE_CONTRACT.md). On wideset.co
 * the header is the shared shell, which speaks in document events; the docs keep their own
 * appearance model (`html.dark`, localStorage) and translate:
 *
 * - `wideset:themechange` from the shell → the docs' appearance, including `system`;
 * - a change made inside the docs (theme panel, the stand-alone top bar) → `wideset:settheme`,
 *   so the shell keeps its cookie and the landing opens with the same preference;
 * - any `[data-docs-search]` control → `wideset:search-open`, the event the shell's search sends,
 *   so one palette (SearchPalette) serves both headers.
 */
const isAppearance = (value: unknown): value is Appearance =>
  value === 'light' || value === 'dark' || value === 'system';

/** Set while applying the shell's change, so it is not sent back to the shell. */
let fromShell = false;

document.addEventListener('wideset:themechange', (event) => {
  const { preference, theme } =
    (event as CustomEvent<{ preference?: string; theme?: string }>).detail ?? {};
  const value = preference ?? theme;
  if (!isAppearance(value)) return;
  fromShell = true;
  try {
    commitAppearance(value);
  } finally {
    fromShell = false;
  }
});

// Only on wideset.co, where the edge marks <html data-wsh-section> and the shell listens.
if (document.documentElement.hasAttribute('data-wsh-section')) {
  onAppearanceChange((value) => {
    if (fromShell) return;
    document.dispatchEvent(new CustomEvent('wideset:settheme', { detail: { theme: value } }));
  });
}

// A search pressed before the palette island has hydrated is remembered, not lost: the palette
// opens as soon as it mounts (SearchPalette reads and clears this flag).
document.addEventListener('wideset:search-open', () => {
  (window as Window & { __widesetSearchPending?: boolean }).__widesetSearchPending = true;
});

document.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('[data-docs-search]')) {
    document.dispatchEvent(new CustomEvent('wideset:search-open'));
  }
});
