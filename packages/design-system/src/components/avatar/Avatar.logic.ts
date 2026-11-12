import type { AvatarCommonProps } from './Avatar.types';

/** Below 32px two letters crowd the circle: Figma draws one letter there, so xs and sm show the first. */
const ONE_LETTER_SIZES = new Set<AvatarCommonProps['size']>(['xs', 'sm']);

/**
 * The part of `initials` an avatar of `size` draws: the first letter at xs and sm, all of it
 * otherwise. Callers pass the full initials, which still pick the colour.
 */
export const getVisibleInitials = (initials: string, size: AvatarCommonProps['size']): string => {
  if (!ONE_LETTER_SIZES.has(size ?? 'md')) return initials;
  // Array.from splits by code point, so "Ł" or a single-code-point emoji stays whole; a letter
  // built from several code points (a decomposed accent, a ZWJ emoji) keeps only its first.
  return Array.from(initials.trim())[0] ?? '';
};
