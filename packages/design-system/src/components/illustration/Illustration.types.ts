import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import type { illustrationVariants } from './Illustration.variants';

/** Figma's `Illustration` property. */
export type IllustrationName = 'calendar' | 'computer' | 'folder';

/** Figma's `Size`: Large (240px) or Small (140px), each drawn for its size. */
export type IllustrationSize = NonNullable<VariantProps<typeof illustrationVariants>['size']>;

/** Props for an illustration: a line drawing in the text colour with one primary accent. */
export type IllustrationProps = Omit<React.SVGAttributes<SVGSVGElement>, 'children'> & {
  /** Which drawing to show. */
  illustration: IllustrationName;
  /**
   * `lg` (240px) for an empty page or a first-run screen, `sm` (140px) inside a card, a panel or
   * an announcement. Each size is drawn separately, so lines keep their weight; do not scale one
   * into the other with CSS.
   */
  size?: IllustrationSize;
  /**
   * Accessible name, for an illustration that says something the text beside it does not. Left
   * out (and with no `aria-label` or `aria-labelledby`), the illustration is decorative and hidden
   * from screen readers, which is the usual case.
   */
  title?: string;
};
