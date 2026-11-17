import {
  RiCheckLine,
  RiFlagLine,
  RiLinkM,
  RiMessage2Line,
  RiMoreFill,
  RiNotificationLine,
  RiNotificationOffLine,
  RiUserAddLine,
} from '@remixicon/react';
import { Button, DropdownMenu, IconButton, ListItem } from '@wideset/react';

import { NOW, profile } from './data';
import { formatLocalTime } from './format';
import { PersonAvatar } from './person-avatar';

type ProfileHeaderProps = {
  followed: boolean;
  muted: boolean;
  onFollowedChange: (followed: boolean) => void;
  onMutedChange: (muted: boolean) => void;
  onMessage: () => void;
  onCopyLink: () => void;
  onReport: () => void;
};

/**
 * Who the person is, then what to do with them, the filled button last. Follow is the page's one
 * primary until it is pressed; then it reads "Following" with a check, goes secondary, and a
 * second press unfollows. The rest (copy the link, mute, report) waits in the more menu.
 */
export function ProfileHeader({
  followed,
  muted,
  onFollowedChange,
  onMutedChange,
  onMessage,
  onCopyLink,
  onReport,
}: ProfileHeaderProps) {
  const firstName = profile.name.split(' ')[0];

  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-11 flex min-w-0 items-center">
        <PersonAvatar
          size="2xl"
          name={profile.name}
          initials={profile.initials}
          aria-hidden="true"
        />
        <div className="gap-ws-2 flex min-w-0 flex-col">
          <h1 className="typography-title-md text-ws-static-strong">{profile.name}</h1>
          <p className="typography-body-md text-ws-static-base">
            {profile.role}, {profile.team}
          </p>
          <p className="typography-body-md text-ws-static-subtle tabular-nums">
            {profile.location} · {formatLocalTime(NOW, profile.timeZone)} local time
          </p>
        </div>
      </div>

      <div className="gap-ws-5 flex items-center">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton
              icon={RiMoreFill}
              variant="secondary"
              preset="border"
              size="sm"
              aria-label="More actions"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="w-[14rem]">
            <DropdownMenu.Item onSelect={onCopyLink}>
              <ListItem.Prefix>
                <RiLinkM className="size-ws-9" />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>Copy link</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => onMutedChange(!muted)}>
              <ListItem.Prefix>
                {muted ? (
                  <RiNotificationLine className="size-ws-9" />
                ) : (
                  <RiNotificationOffLine className="size-ws-9" />
                )}
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>
                  {muted ? `Unmute ${firstName}` : `Mute ${firstName}`}
                </ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item variant="danger" onSelect={onReport}>
              <ListItem.Prefix>
                <RiFlagLine className="size-ws-9" />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>Report</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <Button variant="secondary" preset="border" size="sm" onClick={onMessage}>
          <Button.Icon icon={RiMessage2Line} />
          Message
        </Button>
        {/* One button that toggles: the same element in both states, so focus stays on it. */}
        <Button
          size="sm"
          variant={followed ? 'secondary' : 'primary'}
          preset={followed ? 'border' : 'filled'}
          aria-pressed={followed}
          onClick={() => onFollowedChange(!followed)}
        >
          <Button.Icon icon={followed ? RiCheckLine : RiUserAddLine} />
          {followed ? 'Following' : 'Follow'}
        </Button>
      </div>
    </header>
  );
}
