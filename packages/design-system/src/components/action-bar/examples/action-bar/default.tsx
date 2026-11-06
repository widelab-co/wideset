/**
 * The playground's stage: the bar for four selected rows, its props set from the rail. The
 * transformed box contains the fixed bar, so it sits at the box's edge, not the viewport's.
 */
import {
  RiDeleteBin6Line,
  RiRefreshLine,
  RiSendPlaneLine,
  RiShareForwardLine,
} from '@remixicon/react';
import { ActionBar, type ActionBarProps, Button, IconButton, Tooltip } from '@wideset/react';

export default function ActionBarDefault(props: ActionBarProps) {
  return (
    <div className="relative h-[5.5rem] w-[34rem] max-w-full [transform:translateZ(0)]">
      <ActionBar isOpen {...props}>
        <ActionBar.Count>4 rows selected</ActionBar.Count>
        <ActionBar.Actions>
          <ActionBar.SelectAll checked="indeterminate" />
          <Button variant="secondary" size="sm">
            <Button.Icon icon={RiSendPlaneLine} />
            Publish
          </Button>
          <Tooltip size="sm" arrow={false}>
            <Tooltip.Trigger asChild>
              <IconButton
                variant="secondary"
                size="sm"
                icon={RiShareForwardLine}
                aria-label="Forward"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Label>Forward</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
          <Tooltip size="sm" arrow={false}>
            <Tooltip.Trigger asChild>
              <IconButton variant="secondary" size="sm" icon={RiRefreshLine} aria-label="Refresh" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Label>Refresh</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
          <Tooltip size="sm" arrow={false}>
            <Tooltip.Trigger asChild>
              <IconButton
                variant="danger"
                preset="ghost"
                size="sm"
                icon={RiDeleteBin6Line}
                aria-label="Delete"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Label>Delete</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
        </ActionBar.Actions>
      </ActionBar>
    </div>
  );
}
