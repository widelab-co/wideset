// TODO(custom): an icon button with an unread dot; IconButton has no badge or dot.
import { RiNotification3Line } from '@remixicon/react';
import { IconButton } from '@wideset/react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

type BellButtonProps = Omit<ComponentPropsWithoutRef<typeof IconButton>, 'icon' | 'aria-label'> & {
  /** Anything unread: a dot on the bell, never a number. */
  unread: boolean;
};

/**
 * The bell in the page bar. While anything is unread it carries a small dot in the brand colour
 * (the unread dot of the rows it opens), and its name says so; how many is the popover's to show.
 * It forwards its ref and props, so `Popup.Trigger asChild` can drive it.
 */
export const BellButton = forwardRef<HTMLButtonElement, BellButtonProps>(
  ({ unread, ...props }, ref) => (
    <span className="relative flex">
      <IconButton
        ref={ref}
        icon={RiNotification3Line}
        variant="secondary"
        preset="ghost"
        size="sm"
        iconClassName="size-ws-9"
        aria-label={unread ? 'Notifications, some unread' : 'Notifications'}
        {...props}
      />
      {unread && (
        <span
          aria-hidden="true"
          className="bg-ws-dynamic-primary-default rounded-ws-control-full size-ws-4 top-ws-4 right-ws-4 pointer-events-none absolute"
        />
      )}
    </span>
  ),
);
BellButton.displayName = 'BellButton';
