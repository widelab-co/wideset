import { RiDeleteBin6Line } from '@remixicon/react';
import { ActionBar, IconButton } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/**
 * Position and align come from `ActionBarProps`; the stage is the library's
 * `examples/action-bar/default.tsx`. ActionBar is `position: fixed`: the stage's transformed
 * box contains it, so it sits at the bottom (or top) of that box instead of the viewport.
 * `isOpen` is always on here.
 */
export default playground({
  from: 'ActionBarProps',
  hide: ['isOpen'],
  // The bar drawn in place, every part once: `static` takes it out of `position: fixed` and
  // `left` drops the centring translate, so the drawing is the bar itself.
  anatomy: () => (
    <ActionBar isOpen align="left" className="static">
      <ActionBar.Count>4 rows selected</ActionBar.Count>
      <ActionBar.Actions>
        <ActionBar.SelectAll checked="indeterminate" />
        <IconButton
          variant="danger"
          preset="ghost"
          size="sm"
          icon={RiDeleteBin6Line}
          aria-label="Delete"
        />
      </ActionBar.Actions>
    </ActionBar>
  ),
});
