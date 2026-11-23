/**
 * The label runs the most common action; the chevron opens a menu of related alternatives. The
 * colours follow Button: primary for the main action, secondary for a supporting one, danger
 * when the main action destroys something, success for a confirming one, inverse on dark or
 * coloured surfaces.
 */
import { RiArrowDownSLine } from '@remixicon/react';
import { DropdownMenu, ListItem, SplitButton } from '@wideset/react';

const menu = (
  <>
    <DropdownMenu.Item>
      <ListItem.Content>
        <ListItem.Label>Save as draft</ListItem.Label>
      </ListItem.Content>
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      <ListItem.Content>
        <ListItem.Label>Schedule for later</ListItem.Label>
      </ListItem.Content>
    </DropdownMenu.Item>
  </>
);

export default function SplitButtonVariants() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-center">
      <SplitButton variant="primary" icon={RiArrowDownSLine} menuContent={menu}>
        Publish
      </SplitButton>
      <SplitButton variant="secondary" icon={RiArrowDownSLine} menuContent={menu}>
        Export
      </SplitButton>
      <SplitButton variant="danger" icon={RiArrowDownSLine} menuContent={menu}>
        Archive
      </SplitButton>
      <SplitButton variant="success" icon={RiArrowDownSLine} menuContent={menu}>
        Approve
      </SplitButton>
      <div className="bg-ws-static-inverse-background rounded-ws-container-md p-ws-8">
        <SplitButton variant="inverse" icon={RiArrowDownSLine} menuContent={menu}>
          Share
        </SplitButton>
      </div>
    </div>
  );
}
