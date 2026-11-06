'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/wideset/utils';

import { useTagContext } from './Tag.context';
import type { TagIconProps } from './Tag.types';
import { iconVariants } from './Tag.variants';

const TagIcon = forwardRef<HTMLDivElement, TagIconProps>(
  ({ className, icon: Icon, ...props }, ref) => {
    const { size, color } = useTagContext();

    return (
      // Tag's leading-icon inset selector keys off `tag-icon`; a caller can still
      // override it, like every other part marker.
      <div ref={ref} data-slot="tag-icon" {...props}>
        <Icon
          aria-hidden="true"
          focusable="false"
          className={cn(iconVariants({ size, color }), className)}
        />
      </div>
    );
  },
);

TagIcon.displayName = 'Tag.Icon';

export { TagIcon };
