// TODO(custom): page header (title, a line of facts, the actions on the right); no PageHeader in Wideset.
import {
  type RemixiconComponentType,
  RiDeleteBinLine,
  RiEditLine,
  RiLinkM,
  RiMoreFill,
  RiPhoneLine,
} from '@remixicon/react';
import { Button, DropdownMenu, IconButton, ListItem } from '@wideset/react';

import { deal } from './data';

const MENU: { label: string; icon: RemixiconComponentType }[] = [
  { label: 'Log a call', icon: RiPhoneLine },
  { label: 'Copy link', icon: RiLinkM },
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
 * The deal's header: its name, then whose it is and who to talk to, and on the right what to do
 * with it. Nothing here is filled or in the brand colour: those belong to the assistant's action.
 */
export function RecordHeader() {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">{deal.name}</h1>
        <p className="typography-body-md text-ws-static-subtle gap-ws-5 flex flex-wrap items-center">
          <span>{deal.customer}</span>
          <Dot />
          <span>Contact {deal.contact.name}</span>
        </p>
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
                <ListItem.Label>Delete deal</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
        <Button variant="secondary" preset="border" size="sm">
          <Button.Icon icon={RiEditLine} />
          Edit
        </Button>
      </div>
    </header>
  );
}
