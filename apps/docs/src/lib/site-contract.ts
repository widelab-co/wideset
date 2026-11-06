import { commitAppearance, isDark, onAppearanceChange } from './theme';

/**
 * The documentation's side of the site contract (wideset-edge/SITE_CONTRACT.md). On wideset.co
 * the header is the shared shell, which speaks in document events; the docs keep their own
 * appearance model (`html.dark`, localStorage) and translate:
 *
 * - `wideset:themechange` from the shell → the docs' appearance;
 * - a change made inside the docs (theme panel, the stand-alone top bar) → `data-theme` on
 *   <html>, which the shell watches to keep its cookie, so the landing opens in the same theme;
 * - any `[data-docs-search]` control → `wideset:search-open`, the event the shell's search sends,
 *   so one palette (SearchPalette) serves both headers.
 */
document.addEventListener('wideset:themechange', (event) => {
  const theme = (event as CustomEvent<{ theme?: string }>).detail?.theme;
  if (theme === 'light' || theme === 'dark') commitAppearance(theme);
});

onAppearanceChange((value) => {
  const theme = isDark(value) ? 'dark' : 'light';
  if (document.documentElement.getAttribute('data-theme') !== theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
});

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
