import {
  type RemixiconComponentType,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiAttachment2,
  RiCloseLine,
  RiFirefoxFill,
  RiGlobalLine,
  RiImageLine,
  RiMoreFill,
  RiRecordCircleLine,
  RiSearch2Line,
  RiSettingsLine,
  RiTelegramFill,
  RiTimeLine,
  RiYoutubeFill,
} from '@remixicon/react';
import {
  Chip,
  DropdownMenu,
  type DropdownMenuItemProps,
  IconButton,
  ListItem,
  SegmentedControl,
  Tooltip,
} from '@wideset/react';
import { type ComponentRef, forwardRef, useId, useState } from 'react';

import { ATTACHMENTS, type Source } from './data';

/**
 * Figma's prompt composer: the message card (text, tools, send) on a grey tray that also holds
 * the attachments. Enter sends, Shift + Enter starts a new line.
 */
export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [draft, setDraft] = useState('');
  const [files, setFiles] = useState(ATTACHMENTS);
  const attachmentsId = useId();

  const send = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft('');
  };

  return (
    <form
      onSubmit={send}
      className="bg-ws-static-alpha-subtle p-ws-3 gap-ws-5 flex flex-col rounded-(--ws-radius-600)"
    >
      <div className="bg-ws-static-overlay shadow-ws-low rounded-ws-container-xl p-ws-5 gap-ws-3 flex flex-col">
        <div className="p-ws-3">
          <textarea
            aria-label="Message"
            placeholder="Ask whatever you want..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              // Shift + Enter keeps the browser's new line; Enter that confirms an IME word is not a send.
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                send(event);
              }
            }}
            className="typography-body-lg text-ws-static-strong placeholder:text-ws-static-subtle min-h-ws-23 max-h-ws-28 block field-sizing-content w-full resize-none bg-transparent outline-hidden"
          />
        </div>
        <div className="gap-ws-3 flex items-center">
          <div className="gap-ws-5 flex flex-1 items-center">
            <SegmentedControl size="sm" defaultValue="web" aria-label="Search mode">
              <SegmentedControl.Item value="web" icon={RiGlobalLine} aria-label="Web" />
              <SegmentedControl.Item value="search" icon={RiSearch2Line} aria-label="Search" />
            </SegmentedControl>
            <MoreMenu />
          </div>
          <div className="gap-ws-9 flex min-w-0 items-center">
            <p className="typography-body-md text-ws-static-subtle truncate">
              Shift + Enter for new line, or Enter to send
            </p>
            <IconButton type="submit" size="sm" icon={RiArrowRightLine} aria-label="Send" />
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div role="group" aria-labelledby={attachmentsId} className="py-ws-5">
          <p
            id={attachmentsId}
            className="typography-label-strong-sm text-ws-static-subtle px-ws-7 py-ws-3"
          >
            Attachments
          </p>
          <div className="gap-ws-3 px-ws-7 flex flex-wrap">
            {files.map((file) => (
              <Chip
                key={file.id}
                variant="secondary"
                style="border"
                aria-label={`Remove ${file.name}`}
                onClick={() => setFiles((all) => all.filter((item) => item.id !== file.id))}
              >
                <Chip.Icon icon={LOGO[file.source].icon} className={LOGO[file.source].className} />
                {file.name}
                <Chip.Icon icon={RiCloseLine} />
              </Chip>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}

/** Figma draws the apps' colour logos; these are their Remix glyphs in the nearest palette colour. */
const LOGO: Record<Source, { icon: RemixiconComponentType; className: string }> = {
  youtube: { icon: RiYoutubeFill, className: 'text-(--ws-non-semantic-fill-red-strong)' },
  telegram: { icon: RiTelegramFill, className: 'text-(--ws-non-semantic-fill-cyan-strong)' },
  firefox: { icon: RiFirefoxFill, className: 'text-(--ws-non-semantic-fill-orange-strong)' },
};

/** The "…" tools menu; "Deep research" says how many runs are left in a tooltip. */
function MoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          variant="secondary"
          preset="ghost"
          size="sm"
          icon={RiMoreFill}
          aria-label="More tools"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="w-[14rem]">
        <MenuItem icon={RiAttachment2} label="Add files" />
        <DropdownMenu.Separator />
        <MenuItem icon={RiImageLine} label="Take a screenshot" />
        <Tooltip size="sm" arrow={false}>
          <Tooltip.Trigger asChild>
            <MenuItem icon={RiTimeLine} label="Deep research" />
          </Tooltip.Trigger>
          <Tooltip.Content side="right" sideOffset={8}>
            <Tooltip.Label>25 left</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>
        <MenuItem icon={RiRecordCircleLine} label="Help center" />
        <DropdownMenu.Separator />
        <MenuItem icon={RiSettingsLine} label="Settings" />
        <MenuItem icon={RiMoreFill} label="More">
          <ListItem.Suffix className="size-ws-12 justify-center">
            <RiArrowRightSLine aria-hidden className="size-ws-9" />
          </ListItem.Suffix>
        </MenuItem>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

type MenuItemProps = DropdownMenuItemProps & { icon: RemixiconComponentType; label: string };

/** A menu row with Figma's 20px icon slot (a 16px subtle glyph); forwards its ref for a tooltip. */
const MenuItem = forwardRef<ComponentRef<typeof DropdownMenu.Item>, MenuItemProps>(
  function MenuItem({ icon: Icon, label, children, ...props }, ref) {
    return (
      <DropdownMenu.Item ref={ref} {...props}>
        <ListItem.Prefix className="size-ws-11 justify-center">
          <Icon aria-hidden className="size-ws-9 text-ws-static-subtle" />
        </ListItem.Prefix>
        <ListItem.Content>
          <ListItem.Label>{label}</ListItem.Label>
        </ListItem.Content>
        {children}
      </DropdownMenu.Item>
    );
  },
);
