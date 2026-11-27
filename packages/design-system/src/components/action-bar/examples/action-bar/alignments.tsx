/**
 * `center` (the default) suits a full-width table. Align the bar `left` or `right` when the
 * selection lives in one column of the layout, such as a list beside a detail panel, so the bar
 * stays under the items it acts on. The bar is fixed to the viewport: each box here contains it
 * only so the example stays on the card.
 */
import { RiSendPlaneLine } from '@remixicon/react';
import { ActionBar, Button } from '@wideset/react';

export default function ActionBarAlignments() {
  return (
    <div className="gap-ws-9 flex w-[36rem] max-w-full flex-col">
      {(['left', 'center', 'right'] as const).map((align) => (
        <div
          key={align}
          className="rounded-ws-control-lg border-ws-static-base relative h-[5.5rem] [transform:translateZ(0)] overflow-hidden border"
        >
          <ActionBar isOpen align={align}>
            <ActionBar.Count>2 rows selected</ActionBar.Count>
            <ActionBar.Actions>
              <ActionBar.SelectAll checked="indeterminate" />
              <Button variant="secondary" size="sm">
                <Button.Icon icon={RiSendPlaneLine} />
                Publish
              </Button>
            </ActionBar.Actions>
          </ActionBar>
        </div>
      ))}
    </div>
  );
}
