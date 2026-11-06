import { Slot } from '@radix-ui/react-slot';
import type * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import type { ActionTileProps } from './ActionTile.types';
import { actionTileMotionVariants, actionTileVariants } from './ActionTile.variants';
import { ActionTileDescription } from './ActionTileDescription';
import { ActionTileEntity } from './ActionTileEntity';
import { ActionTileIcon } from './ActionTileIcon';
import { ActionTileTitle } from './ActionTileTitle';

/**
 * A tile that performs an action or navigates. The element follows the props:
 * `href` renders a real `<a>`, `onClick` / `type` / `asChild` a real `<button>`
 * (or your element), and none of those a plain `div`, so a decorative tile is
 * not a dead tab stop. Enter/Space, `disabled` and link affordances come from
 * the platform, not from a key handler.
 *
 * The whole tile is the control; the trailing arrow is decoration, not a nested
 * button. It is hidden when disabled, matching Figma.
 */
const ActionTile = ({
  asChild,
  className,
  children,
  variant,
  title,
  description,
  entity,
  icon,
  disabled,
  href,
  onClick,
  type,
  defaultMotion,
  ref,
  ...props
}: ActionTileProps) => {
  // `type` alone must select a button: form submit/reset tiles often have no
  // onClick, and must still participate as a native <button type="submit">.
  const isInteractive = !!href || !!onClick || !!asChild || type !== undefined;
  const motion = useDefaultMotion(defaultMotion);

  // Widened because a polymorphic root cannot satisfy <a>, <button> and <div>
  // prop types at once; `ActionTileProps` still constrains the public surface.
  const Comp: React.ElementType = asChild ? Slot : href ? 'a' : isInteractive ? 'button' : 'div';
  const isButton = Comp === 'button';

  // Only <button> has a native `disabled`. An <a>, a Slot child or a div has
  // nothing to disable, so the state is carried by `aria-disabled`, the element
  // leaves the tab order, and the click (and a link's navigation) is blocked.
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    (onClick as React.MouseEventHandler<HTMLElement> | undefined)?.(event);
  };

  const interactionProps = isButton
    ? { disabled, type: type ?? 'button', onClick }
    : {
        'aria-disabled': disabled || undefined,
        tabIndex: disabled ? -1 : undefined,
        onClick: isInteractive ? handleClick : undefined,
        href: href && !disabled ? href : undefined,
      };

  return (
    <Comp
      ref={ref}
      className={cn(
        actionTileVariants({ variant, disabled, isInteractive }),
        actionTileMotionVariants({ enabled: motion }),
        className,
      )}
      data-slot="action-tile"
      {...props}
      {...interactionProps}
    >
      {asChild ? (
        children
      ) : (
        <>
          {entity && <ActionTileEntity icon={entity} />}
          {(title || description) && (
            <div className="gap-ws-3 flex flex-1 flex-col">
              {title && <ActionTileTitle>{title}</ActionTileTitle>}
              {description && <ActionTileDescription>{description}</ActionTileDescription>}
            </div>
          )}
          {icon && !disabled && <ActionTileIcon className="ml-auto" icon={icon} />}
          {children}
        </>
      )}
    </Comp>
  );
};

ActionTile.displayName = 'ActionTile';
ActionTile.Title = ActionTileTitle;
ActionTile.Description = ActionTileDescription;
ActionTile.Entity = ActionTileEntity;
ActionTile.Icon = ActionTileIcon;

export { ActionTile };
