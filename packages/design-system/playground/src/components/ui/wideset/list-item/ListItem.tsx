'use client';

import { RiCheckLine } from '@remixicon/react';
import { forwardRef } from 'react';
import { cn } from '@/lib/wideset/utils';

import { useDefaultMotion } from '@/lib/wideset/motion/MotionProvider';
import { ListItemContext } from './ListItem.context';
import type { ListItemProps, ListItemWithSubComponents } from './ListItem.types';
import {
  listItemCheckVariants,
  listItemMotionVariants,
  listItemVariants,
} from './ListItem.variants';
import { ListItemContent } from './ListItemContent';
import { ListItemDescription } from './ListItemDescription';
import { ListItemLabel } from './ListItemLabel';
import { ListItemPrefix } from './ListItemPrefix';
import { ListItemSuffix } from './ListItemSuffix';

const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      disabled,
      shouldDisplayCheckmark = true,
      defaultMotion,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const isDisabled = disabled || props['data-disabled'];

    return (
      <ListItemContext.Provider value={{ variant, disabled: isDisabled }}>
        <div
          className={cn(
            listItemVariants({ variant }),
            listItemMotionVariants({ enabled: motion }),
            className,
          )}
          ref={ref}
          aria-disabled={isDisabled}
          data-slot="list-item"
          {...props}
        >
          {children}
          {shouldDisplayCheckmark && props['data-state'] === 'checked' && (
            <RiCheckLine
              aria-hidden="true"
              focusable="false"
              className={listItemCheckVariants({ variant })}
            />
          )}
        </div>
      </ListItemContext.Provider>
    );
  },
) as ListItemWithSubComponents;

ListItem.displayName = 'ListItem';

ListItem.Content = ListItemContent;
ListItem.Description = ListItemDescription;
ListItem.Label = ListItemLabel;
ListItem.Prefix = ListItemPrefix;
ListItem.Suffix = ListItemSuffix;

export { ListItem };
