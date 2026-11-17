/**
 * Light, dark, or the system's choice. One setting, read by the head script before first
 * paint (so a dark page never flashes light) and by the toggle in the top bar.
 * The design system switches on `html.dark`, so that class is all the page needs.
 */
export type Appearance = 'system' | 'light' | 'dark';

export const THEME_KEY = 'wideset-docs-theme';
const CHANGE_EVENT = 'wideset-docs-theme-change';

export const isDark = (value: Appearance) =>
  value === 'dark' ||
  (value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

export const loadAppearance = (): Appearance => {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === 'light' || raw === 'system' || raw === 'dark') return raw;
  } catch {
    // storage unavailable; the default stands
  }
  return 'system';
};

const applyAppearance = (value: Appearance) => {
  document.documentElement.classList.toggle('dark', isDark(value));
};

/** Apply, persist, and tell every other control on the page. */
export const commitAppearance = (value: Appearance) => {
  applyAppearance(value);
  try {
    localStorage.setItem(THEME_KEY, value);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent<Appearance>(CHANGE_EVENT, { detail: value }));
};

export const onAppearanceChange = (listener: (value: Appearance) => void) => {
  const handle = (event: Event) => listener((event as CustomEvent<Appearance>).detail);
  window.addEventListener(CHANGE_EVENT, handle);
  return () => window.removeEventListener(CHANGE_EVENT, handle);
};
