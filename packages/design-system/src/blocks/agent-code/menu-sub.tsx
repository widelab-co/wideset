import { type RemixiconComponentType, RiArrowRightSLine } from '@remixicon/react';
import { DropdownMenu, ListItem } from '@wideset/react';
import type { ReactNode } from 'react';

type MenuSubProps = {
  icon: RemixiconComponentType;
  label: string;
  /** What is chosen inside now, shown quietly before the chevron ("Match system"). */
  value?: string;
  children: ReactNode;
};

/**
 * A row that opens a second menu beside the first: hover, → or Enter opens it, ← or Esc goes back.
 * The row is a `ListItem` like every other item, with the choice it holds and a chevron after the
 * label; while its panel is open it keeps the hover fill, so the eye can follow where it came from.
 */
export function MenuSub({ icon: Icon, label, value, children }: MenuSubProps) {
  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger
        asChild
        className="min-h-ws-14 data-[state=open]:bg-ws-dynamic-secondary-alpha-hover outline-hidden"
      >
        <ListItem>
          <ListItem.Prefix>
            <Icon className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>{label}</ListItem.Label>
          </ListItem.Content>
          <ListItem.Suffix>
            {value && <span className="text-ws-static-subtle">{value}</span>}
            <RiArrowRightSLine aria-hidden="true" className="size-ws-9" />
          </ListItem.Suffix>
        </ListItem>
      </DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent sideOffset={8} alignOffset={-4} collisionPadding={12}>
        {children}
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  );
}
