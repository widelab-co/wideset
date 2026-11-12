// TODO(custom): page header (title, a line of facts, the actions on the right); no PageHeader in Wideset.
import {
  type RemixiconComponentType,
  RiDeleteBinLine,
  RiDownload2Line,
  RiEditLine,
  RiLinkM,
  RiMoreFill,
  RiShareLine,
} from '@remixicon/react';
import { Avatar, Button, DropdownMenu, IconButton, ListItem } from '@wideset/react';

import { call, speakers } from './data';
import { formatDateTime, formatLength } from './format';
import { TextLink } from './text-link';

const MENU: { label: string; icon: RemixiconComponentType }[] = [
  { label: 'Copy link', icon: RiLinkM },
  { label: 'Rename', icon: RiEditLine },
];

/** The dot between two facts on the header's line. */
function Dot() {
  return (
    <span aria-hidden="true" className="text-ws-static-subtle">
      {'·'}
    </span>
  );
}

/**
 * The recording's header: what the call was, then one line of facts (who was on it, when, how
 * long, the deal it belongs to) and on the right what to do with it. Nothing here is filled:
 * the page's one filled button is the player's Play.
 */
export function RecordingHeader() {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-3 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">{call.title}</h1>
        <div className="typography-body-md text-ws-static-subtle gap-ws-5 flex flex-wrap items-center">
          <span className="gap-ws-5 flex items-center">
            <Avatar.Group size="xs" className="w-fit shrink-0">
              {speakers.map((person) => (
                <Avatar key={person.id} initials={person.initials} color={person.color} />
              ))}
            </Avatar.Group>
            {speakers.map((person) => person.name).join(' and ')}
          </span>
          <Dot />
          <time dateTime={call.startedAt}>{formatDateTime(call.startedAt)}</time>
          <Dot />
          <span className="tabular-nums">{formatLength(call.duration)}</span>
          <Dot />
          <span>
            Deal <TextLink href={`#${call.deal.id}`}>{call.deal.name}</TextLink>
          </span>
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
            {MENU.map(({ label, icon: Icon }) => (
              <DropdownMenu.Item key={label}>
                <ListItem.Prefix>
                  <Icon className="size-ws-9" />
                </ListItem.Prefix>
                <ListItem.Content>
                  <ListItem.Label>{label}</ListItem.Label>
                </ListItem.Content>
              </DropdownMenu.Item>
            ))}
            <DropdownMenu.Separator />
            <DropdownMenu.Item variant="danger">
              <ListItem.Prefix>
                <RiDeleteBinLine className="size-ws-9" />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>Delete recording</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <Button variant="secondary" preset="border" size="sm">
          <Button.Icon icon={RiDownload2Line} />
          Download
        </Button>
        <Button variant="secondary" preset="border" size="sm">
          <Button.Icon icon={RiShareLine} />
          Share
        </Button>
      </div>
    </header>
  );
}
