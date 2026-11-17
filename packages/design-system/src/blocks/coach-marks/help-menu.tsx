import { RiBookOpenLine, RiCompass3Line, RiKeyboardLine, RiQuestionLine } from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem } from '@wideset/react';
import { type Ref, useRef } from 'react';

/**
 * The page's help, at the end of the top bar: the tour to take again, the page's guide and the
 * shortcuts. The tour starts once the menu has closed and handed focus back, so the mark can take
 * the focus without the menu pulling it away again.
 */
export function HelpMenu({
  triggerRef,
  onTakeTour,
}: {
  triggerRef: Ref<HTMLButtonElement>;
  onTakeTour: () => void;
}) {
  const tourChosen = useRef(false);

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          ref={triggerRef}
          icon={RiQuestionLine}
          variant="secondary"
          preset="ghost"
          size="sm"
          iconClassName="text-ws-static-subtle size-ws-9"
          aria-label="Help"
          className="-mr-ws-5"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="end"
        className="w-[14rem]"
        onCloseAutoFocus={(event) => {
          if (!tourChosen.current) return;
          tourChosen.current = false;
          event.preventDefault();
          onTakeTour();
        }}
      >
        <DropdownMenu.Item onSelect={() => (tourChosen.current = true)}>
          <ListItem.Prefix>
            <RiCompass3Line className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Take the tour</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ListItem.Prefix>
            <RiBookOpenLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Customers guide</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ListItem.Prefix>
            <RiKeyboardLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Keyboard shortcuts</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
