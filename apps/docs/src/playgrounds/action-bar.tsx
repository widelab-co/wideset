import { RiDeleteBin6Line, RiSendPlaneLine } from '@remixicon/react';
import { ActionBar, Button, IconButton } from '@wideset/react';

import ActionBarDefault from '../../../../packages/design-system/src/components/action-bar/examples/action-bar/default';
import { playground } from '../lib/playground-kit';

/**
 * Position and align come from `ActionBarProps`; the stage is the library's
 * `examples/action-bar/default.tsx`. ActionBar is `position: fixed`: the stage contains it
 * (`contain: layout` in docs.css), so it sits at the stage's edges instead of the window's.
 * `isOpen` is always on here.
 */
export default playground({
  from: 'ActionBarProps',
  hide: ['isOpen', 'amountSelected', 'onClose', 'closeAriaLabel'],
  // The gallery card scales its content in a transformed box of no size of its own, which
  // would contain the fixed bar and squeeze it: the card and the Overview draw the stage's bar
  // in place (`static`; `left` drops the centring translate), still clickable.
  preview: () => <ActionBarDefault align="left" className="static max-w-none flex-nowrap" />,
  livePreview: true,
  // The bar drawn in place, every part once: `static` takes it out of `position: fixed` and
  // `left` drops the centring translate. No motion: the parts are measured once, and the
  // opening slide would leave every highlight below its part. Publish widens the actions so
  // their name clears Select all's.
  anatomy: () => (
    <ActionBar isOpen defaultMotion={false} align="left" className="static max-w-none flex-nowrap">
      <ActionBar.Count>4 rows selected</ActionBar.Count>
      <ActionBar.Actions>
        <ActionBar.SelectAll checked="indeterminate" />
        <Button variant="secondary" size="sm">
          <Button.Icon icon={RiSendPlaneLine} />
          Publish
        </Button>
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
