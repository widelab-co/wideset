import type { AvatarCommonProps } from './Avatar.types';

/** Below 32px two letters crowd the circle: Figma draws one letter there, so xs and sm show the first. */
const ONE_LETTER_SIZES = new Set<AvatarCommonProps['size']>(['xs', 'sm']);

/**
 * The part of `initials` an avatar of `size` draws: the first letter at xs and sm, all of it
 * otherwise. Callers pass the full initials, which still pick the colour.
 */
export const getVisibleInitials = (initials: string, size: AvatarCommonProps['size']): string => {
  if (!ONE_LETTER_SIZES.has(size ?? 'md')) return initials;
  return firstGrapheme(initials.trim());
};

/**
 * The first user-perceived character: "कि" keeps its vowel sign, "👩🏽‍💻" stays whole.
 * `Intl.Segmenter` is missing from older browsers (Firefox before 125); there it falls back to
 * the first code point, which still keeps "Ł" or a single-code-point emoji whole.
 */
const firstGrapheme = (text: string): string => {
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    const [first] = new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text);
    return first?.segment ?? '';
  }
  return Array.from(text)[0] ?? '';
};
