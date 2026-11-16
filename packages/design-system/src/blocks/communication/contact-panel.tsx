import {
  type RemixiconComponentType,
  RiArchive2Line,
  RiArrowDownSLine,
  RiArrowGoBackLine,
  RiArrowRightUpLine,
  RiBold,
  RiCloseLargeFill,
  RiFlagLine,
  RiFlashlightFill,
  RiImageLine,
  RiItalic,
  RiLinkM,
  RiListOrdered,
  RiListUnordered,
  RiTimeLine,
  RiUnderline,
} from '@remixicon/react';
import {
  Avatar,
  Button,
  Divider,
  DropdownMenu,
  IconButton,
  ListItem,
  SplitButton,
  Tabs,
  Tag,
  Textarea,
} from '@wideset/react';

import { conversation } from './data';

const ghost = { variant: 'secondary', preset: 'ghost', size: 'sm' } as const;

/** Figma's Text Area `Formatting Bar=true`, in groups split by a line. */
const FORMATTING: { icon: RemixiconComponentType; label: string }[][] = [
  [
    { icon: RiBold, label: 'Bold' },
    { icon: RiItalic, label: 'Italic' },
    { icon: RiUnderline, label: 'Underline' },
  ],
  [
    { icon: RiListUnordered, label: 'Bulleted list' },
    { icon: RiListOrdered, label: 'Numbered list' },
  ],
  [
    { icon: RiImageLine, label: 'Insert image' },
    { icon: RiLinkM, label: 'Insert link' },
  ],
];

const TABS = ['Media', 'Activity', 'Notes', 'More'];

/** The contact beside the chat: who it is, shared media, a note and the chat's actions. */
export function ContactPanel({
  onClose,
  onArchive,
  note,
  onNoteChange,
}: {
  onClose: () => void;
  onArchive: () => void;
  /** The note lives with the page, so closing the details does not lose it. */
  note: string;
  onNoteChange: (note: string) => void;
}) {
  const { contact } = conversation;

  return (
    <aside aria-labelledby="contact-name" className="flex w-[20.6875rem] shrink-0 flex-col">
      <header className="px-ws-11 h-ws-19 border-ws-static-base flex shrink-0 items-center justify-between border-b">
        <SplitButton
          variant="secondary"
          size="sm"
          icon={RiArrowDownSLine}
          iconAriaLabel="Save to a list"
          menuContent={
            <>
              <DropdownMenu.Item>
                <ListItem.Content>
                  <ListItem.Label>Favourites</ListItem.Label>
                </ListItem.Content>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <ListItem.Content>
                  <ListItem.Label>Clients</ListItem.Label>
                </ListItem.Content>
              </DropdownMenu.Item>
            </>
          }
        >
          Save to
        </SplitButton>
        <IconButton
          {...ghost}
          icon={RiCloseLargeFill}
          aria-label="Close details"
          onClick={onClose}
        />
      </header>

      <div className="gap-ws-14 pt-ws-14 flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="gap-ws-9 flex flex-col items-center">
          <Avatar size="2xl" initials={contact.initials} color={contact.color} />
          <div className="gap-ws-2 flex flex-col items-center">
            <h2 id="contact-name" className="typography-subtitle-md text-ws-static-strong">
              {contact.name}
            </h2>
            <Tag size="sm" color="lime">
              <Tag.Icon icon={RiFlashlightFill} />
              Verified
            </Tag>
          </div>
          <div className="gap-ws-5 flex">
            <IconButton {...ghost} icon={RiArrowGoBackLine} aria-label="Reply" />
            <IconButton {...ghost} icon={RiTimeLine} aria-label="History" />
            <IconButton
              {...ghost}
              icon={RiArchive2Line}
              aria-label="Archive chat"
              onClick={onArchive}
            />
          </div>
        </div>

        <div className="gap-ws-13 px-ws-5 flex flex-col">
          <Tabs type="fullWidth" defaultValue="Media" className="gap-ws-5">
            <Tabs.List aria-label="Contact details">
              {TABS.map((tab) => (
                <Tabs.Item key={tab} value={tab}>
                  <Tabs.Label>{tab}</Tabs.Label>
                </Tabs.Item>
              ))}
            </Tabs.List>
            <Tabs.Content value="Media">
              {/* Shared photos; grey placeholders until the files load. */}
              <ul aria-label="Shared media" className="gap-ws-3 flex">
                {[1, 2, 3].map((item) => (
                  <li
                    key={item}
                    className="size-ws-22 bg-ws-static-alpha-base rounded-ws-container-sm"
                  >
                    <span className="sr-only">Photo {item}</span>
                  </li>
                ))}
              </ul>
            </Tabs.Content>
            {TABS.slice(1).map((tab) => (
              <Tabs.Content
                key={tab}
                value={tab}
                className="typography-body-md text-ws-static-subtle"
              >
                Nothing in {tab.toLowerCase()} yet.
              </Tabs.Content>
            ))}
          </Tabs>

          <div className="gap-ws-5 flex flex-col">
            <label
              htmlFor="contact-note"
              className="typography-label-strong-sm text-ws-static-strong"
            >
              Add a note
            </label>
            <div role="toolbar" aria-label="Formatting" className="flex items-center">
              {FORMATTING.map((group, index) => (
                <div key={group[0].label} className="flex items-center">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="mx-ws-5 h-ws-9 border-ws-static-base border-l"
                    />
                  )}
                  {group.map(({ icon, label }) => (
                    <IconButton key={label} {...ghost} icon={icon} aria-label={label} />
                  ))}
                </div>
              ))}
            </div>
            <Textarea
              id="contact-note"
              placeholder="Add a note"
              rows={3}
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="gap-ws-5 pb-ws-5 flex shrink-0 flex-col">
        <Divider weight="bold" emphasis="subtle" />
        <div className="px-ws-5 flex flex-col">
          <Button {...ghost} className="w-full justify-start" onClick={onArchive}>
            <Button.Icon icon={RiArchive2Line} />
            Archive
          </Button>
          <Button {...ghost} className="w-full justify-start">
            <Button.Icon icon={RiFlagLine} />
            Report
          </Button>
          <Button variant="danger" preset="ghost" size="sm" className="w-full justify-start">
            <Button.Icon icon={RiArrowRightUpLine} />
            Leave conversation
          </Button>
        </div>
      </div>
    </aside>
  );
}
