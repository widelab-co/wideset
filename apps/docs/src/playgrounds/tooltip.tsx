import { RiShareLine } from '@remixicon/react';
import { IconButton, Tooltip } from '@wideset/react';

import { attrs, options, playground, withSpace } from '../lib/playground-kit';

const DESCRIPTION = 'Anyone with the link can view this file.';

/** The tooltip drawn open above its trigger, in place: the real one only shows on hover. */
const OpenTooltip = ({ slots = false }: { slots?: boolean }) => (
  <Tooltip arrow>
    {/* The trigger first, as in the real DOM; the bubble is laid out above it. */}
    <div className="flex flex-col-reverse items-center gap-ws-5">
      <IconButton
        data-slot={slots ? 'tooltip-trigger' : undefined}
        icon={RiShareLine}
        variant="secondary"
        preset="border"
        aria-label="Share"
      />
      <div
        data-slot={slots ? 'tooltip-content' : undefined}
        className="drop-shadow-ws-controls-tooltip relative flex flex-col rounded-ws-control-md bg-ws-static-inverse-background px-ws-5 py-ws-4"
      >
        <Tooltip.Label>Share link</Tooltip.Label>
        <Tooltip.Description>{DESCRIPTION}</Tooltip.Description>
        <div
          data-slot={slots ? 'tooltip-arrow' : undefined}
          className="absolute top-full left-1/2 h-ws-3 w-ws-5 -translate-x-1/2 bg-ws-static-inverse-background [clip-path:polygon(0_0,100%_0,50%_100%)]"
        />
      </div>
    </div>
  </Tooltip>
);

/**
 * Variant, size and arrow come from `TooltipProps`; `side` belongs to Radix, so it is written
 * here. The stage shows the trigger, closed: hover or focus it to see the tooltip with the
 * settings picked in the rail. An open tooltip would float over the gallery on every page load.
 */
export default playground({
  from: 'TooltipProps',
  content: [
    {
      key: 'side',
      label: 'Side',
      type: 'select',
      options: options('top', 'right', 'bottom', 'left'),
      default: 'top',
      group: 'Appearance',
    },
    { key: 'description', label: 'Description', type: 'switch', default: false },
  ],
  render: (v, { props }) => (
    <Tooltip {...props()}>
      <Tooltip.Trigger asChild>
        <IconButton icon={RiShareLine} variant="secondary" preset="border" aria-label="Share" />
      </Tooltip.Trigger>
      <Tooltip.Content side={v.side as 'top'}>
        <Tooltip.Label>Share link</Tooltip.Label>
        {v.description && <Tooltip.Description>{DESCRIPTION}</Tooltip.Description>}
      </Tooltip.Content>
    </Tooltip>
  ),
  code: (v, { attrs: rootAttrs }) => {
    const description = v.description
      ? `\n    <Tooltip.Description>${DESCRIPTION}</Tooltip.Description>`
      : '';
    return `<Tooltip${rootAttrs()}>
  <Tooltip.Trigger asChild>
    <IconButton icon={RiShareLine} variant="secondary" preset="border" aria-label="Share" />
  </Tooltip.Trigger>
  <Tooltip.Content${withSpace(attrs([['side', v.side, 'top']]))}>
    <Tooltip.Label>Share link</Tooltip.Label>${description}
  </Tooltip.Content>
</Tooltip>`;
  },
  preview: () => <OpenTooltip />,
  /*
   * The same open drawing, marked. Root and Portal render no element; the real Content and
   * Arrow only exist while the tooltip is open, in a portal, so they are drawn in place.
   */
  anatomy: () => <OpenTooltip slots />,
});
