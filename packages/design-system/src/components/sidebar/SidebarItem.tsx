import { Slot, Slottable } from '@radix-ui/react-slot';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useSidebarContext } from './Sidebar.context';
import type { SidebarItemProps } from './Sidebar.types';
import {
  sidebarItemIconVariants,
  sidebarItemMotionVariants,
  sidebarItemSuffixVariants,
  sidebarItemVariants,
} from './SidebarItem.variants';

const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  (
    {
      asChild = false,
      icon: Icon,
      label,
      suffix,
      suffixOnHover = false,
      nested = false,
      active = false,
      disabled = false,
      className,
      children,
      onClick,
      defaultMotion,
      'aria-label': ariaLabelProp,
      ...props
    },
    ref,
  ) => {
    const { isCollapsed, motion: inheritedMotion } = useSidebarContext();
    const motion = defaultMotion ?? inheritedMotion;
    const Comp = asChild ? Slot : 'a';

    const ariaLabel =
      ariaLabelProp ?? (isCollapsed && typeof label === 'string' ? label : undefined);

    return (
      <Comp
        ref={ref}
        data-slot="sidebar-item"
        className={cn(
          sidebarItemVariants({ active, collapsed: isCollapsed, nested }),
          sidebarItemMotionVariants({ enabled: motion }),
          className,
        )}
        aria-label={ariaLabel}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={
          disabled ? (e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault() : onClick
        }
        {...props}
      >
        {asChild ? <Slottable>{children}</Slottable> : null}
        {Icon ? <Icon className={sidebarItemIconVariants({ active })} /> : null}
        {isCollapsed ? null : (
          <span className="typography-label-strong-sm min-w-0 flex-1 truncate">{label}</span>
        )}
        {isCollapsed || suffix == null ? null : (
          <span
            data-slot="sidebar-item-suffix"
            className={sidebarItemSuffixVariants({ onHover: suffixOnHover })}
          >
            {suffix}
          </span>
        )}
      </Comp>
    );
  },
);

SidebarItem.displayName = 'Sidebar.Item';

export { SidebarItem };
