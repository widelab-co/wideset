import {
  RiArrowDownSLine,
  RiCloseLine,
  RiDownloadLine,
  RiFilePdf2Line,
  RiFileWord2Line,
  RiMarkdownLine,
} from '@remixicon/react';
import { Button, DropdownMenu, ListItem } from '@wideset/react';

import { CopyButton } from './copy-button';
import { IconAction } from './icon-action';
import { MenuChoice } from './menu-choice';
import type { Prose as ProseBlock } from './model';
import { Prose } from './prose';
import { countWords, proseText, takeProse } from './run';

const FORMATS = [
  { label: 'Markdown', icon: RiMarkdownLine },
  { label: 'Word document', icon: RiFileWord2Line },
  { label: 'PDF', icon: RiFilePdf2Line },
];

type DocumentPaneProps = {
  id: string;
  title: string;
  /** The versions written so far, oldest first. */
  versions: ProseBlock[][];
  /** The one shown, counted from 0. */
  version: number;
  onVersionChange: (version: number) => void;
  /** While the newest version is being written: how far it is, from 0 to 1. */
  progress?: number;
  onClose: () => void;
};

/**
 * The document the agent is writing: the right part of the chat's own card, set off by one
 * vertical line, not a card of its own. Its bar is as high as the chat's, so the two lines meet
 * across the divider, and it scrolls inside itself. The bar
 * holds the name, the version (a menu of them, newest first), then Copy, Export and Close; under
 * it the text reads as a document, at 16px. While a version is being written its words arrive
 * here, not in the chat.
 */
export function DocumentPane({
  id,
  title,
  versions,
  version,
  onVersionChange,
  progress,
  onClose,
}: DocumentPaneProps) {
  const whole = versions[version];
  const prose =
    progress === undefined ? whole : takeProse(whole, Math.ceil(countWords(whole) * progress));

  return (
    <aside
      id={id}
      aria-label="Document"
      aria-busy={progress !== undefined}
      className="border-ws-static-base flex w-[36rem] shrink-0 flex-col border-l"
    >
      <header className="h-ws-18 border-ws-static-base gap-ws-5 pl-ws-11 pr-ws-7 flex shrink-0 items-center border-b">
        <h2 className="typography-label-strong-md text-ws-static-strong min-w-0 flex-1 truncate">
          {title}
        </h2>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary" preset="ghost" size="sm" className="shrink-0">
              {`Version ${version + 1} of ${versions.length}`}
              <Button.Icon icon={RiArrowDownSLine} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.RadioGroup
              aria-label="Version"
              value={String(version)}
              onValueChange={(value) => onVersionChange(Number(value))}
            >
              {versions
                .map((_, index) => (
                  <MenuChoice key={index} value={String(index)}>
                    <ListItem.Content>
                      <ListItem.Label>{`Version ${index + 1}`}</ListItem.Label>
                      {index === versions.length - 1 && (
                        <ListItem.Description>Latest</ListItem.Description>
                      )}
                    </ListItem.Content>
                  </MenuChoice>
                ))
                .reverse()}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu>
        <div className="gap-ws-2 flex shrink-0 items-center">
          <CopyButton label="Copy document" size="sm" text={() => proseText(whole)} />
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <IconAction label="Export" icon={RiDownloadLine} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              {FORMATS.map(({ label, icon: Icon }) => (
                <DropdownMenu.Item key={label}>
                  <ListItem.Prefix>
                    <Icon className="size-ws-9" />
                  </ListItem.Prefix>
                  <ListItem.Content>
                    <ListItem.Label>{label}</ListItem.Label>
                  </ListItem.Content>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu>
          <IconAction label="Close document" icon={RiCloseLine} onClick={onClose} />
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <article className="px-ws-14 pt-ws-14 pb-ws-16">
          <Prose blocks={prose} size="lg" />
        </article>
      </div>
    </aside>
  );
}
