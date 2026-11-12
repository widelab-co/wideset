/**
 * Regular sizes each segment to its label and suits toolbars and headers. Full width shares the
 * container's width evenly, for two to four segments in a panel or a card. The control is a
 * single tab stop either way; the arrow keys move between segments and select the focused segment.
 */
import { SegmentedControl } from '@wideset/react';

export default function SegmentedControlVariants() {
  return (
    <div className="gap-ws-12 flex w-[24rem] max-w-full flex-col items-start">
      {(['regular', 'fullWidth'] as const).map((variant) => (
        <SegmentedControl key={variant} aria-label="Period" variant={variant} defaultValue="week">
          <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
          <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
        </SegmentedControl>
      ))}
    </div>
  );
}
