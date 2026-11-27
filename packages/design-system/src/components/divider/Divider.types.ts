import type { VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import type { dividerLineVariants, dividerTextVariants } from './Divider.variants';

export type DividerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dividerLineVariants> &
  Omit<VariantProps<typeof dividerTextVariants>, 'textAlign'> & {
    /** Controls whether the divider line is solid or dashed. */
    lineStyle?: 'solid' | 'dashed';
    /** Optional label rendered inside the divider line. */
    text?: string;
    /** Horizontal alignment of the label text. */
    textAlign?: 'left' | 'center' | 'right';
    /** Children are unsupported. Use `text` for the optional label. */
    children?: never;
  };

export type DividerLineProps = Pick<DividerProps, 'lineStyle' | 'emphasis' | 'weight'>;
