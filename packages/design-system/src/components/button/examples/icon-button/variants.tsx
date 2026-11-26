/**
 * The same colour rules as Button: primary for the main action, secondary for quiet utilities in
 * a toolbar, danger for destructive actions, success for a confirming one, inverse on dark or
 * coloured surfaces. The icon is hidden from screen readers, so every icon button needs an
 * `aria-label` that says what it does.
 */
import {
  RiAddLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiSettings3Line,
  RiShareLine,
} from '@remixicon/react';
import { IconButton } from '@wideset/react';

export default function IconButtonVariants() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-center">
      <IconButton variant="primary" icon={RiAddLine} aria-label="Add member" />
      <IconButton variant="secondary" icon={RiSettings3Line} aria-label="Settings" />
      <IconButton variant="danger" icon={RiDeleteBinLine} aria-label="Delete file" />
      <IconButton variant="success" icon={RiCheckLine} aria-label="Approve request" />
      <div className="bg-ws-static-inverse-background rounded-ws-container-md p-ws-8">
        <IconButton variant="inverse" icon={RiShareLine} aria-label="Share" />
      </div>
    </div>
  );
}
