import { type ComponentRef, forwardRef } from 'react';

import { Checkbox } from '../checkbox/Checkbox';
import type { ActionBarSelectAllProps } from './ActionBar.types';

// Figma sets 24px between Select all and the actions; the actions sit 4px apart, so the part
// adds the other 20px after itself. Props and ref go to the checkbox, as on Checkbox itself.
const ActionBarSelectAll = forwardRef<ComponentRef<typeof Checkbox>, ActionBarSelectAllProps>(
  ({ label = 'Select all', ...props }, ref) => (
    <div data-slot="action-bar-select-all" className="not-last:me-ws-11 flex">
      <Checkbox ref={ref} label={label} {...props} />
    </div>
  ),
);

ActionBarSelectAll.displayName = 'ActionBar.SelectAll';

export { ActionBarSelectAll };
