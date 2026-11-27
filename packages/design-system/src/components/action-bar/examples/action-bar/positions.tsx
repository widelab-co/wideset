/**
 * `bottom` (the default) keeps the bar out of the way of the table header and the page title;
 * use `top` when something else already sits at the bottom of the screen, such as a cookie
 * banner or a chat button. The bar is fixed to the viewport: each box here contains it only so
 * the example stays on the card.
 */
import { RiSendPlaneLine } from '@remixicon/react';
import { ActionBar, Button } from '@wideset/react';

export default function ActionBarPositions() {
  return (
    <div className="gap-ws-9 flex w-[30rem] max-w-full flex-col">
      {(['bottom', 'top'] as const).map((position) => (
        <div
          key={position}
          className="rounded-ws-control-lg border-ws-static-base relative h-[9rem] [transform:translateZ(0)] overflow-hidden border"
        >
          <ActionBar isOpen position={position}>
            <ActionBar.Count>3 rows selected</ActionBar.Count>
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
