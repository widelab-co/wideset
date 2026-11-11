import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiComputerLine,
  RiExternalLinkLine,
  RiRefreshLine,
  RiSmartphoneLine,
  RiTabletLine,
  RiTerminalBoxLine,
} from '@remixicon/react';
import { Button, IconButton, SegmentedControl, TextInput, Tooltip } from '@wideset/react';

import { BarAction } from './bar-action';
import type { Viewport } from './preview-data';

type PreviewToolbarProps = {
  /** What the address field holds: the page's address, or what is being typed over it. */
  address: string;
  onAddressChange: (address: string) => void;
  /** Enter in the address field. */
  onGo: () => void;
  /** The page open now, for the link that opens it in a window of its own. */
  current: string;
  onBack?: () => void;
  onForward?: () => void;
  onReload: () => void;
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  console: { id: string; open: boolean; count: number; onToggle: () => void };
};

/**
 * The small browser's bar: back, forward and reload, the address (Enter goes there), the viewport
 * the page is shown at, the console's count, which opens its drawer, and the way out to a real
 * window. Everything is quiet: the bar serves the page under it.
 */
export function PreviewToolbar({
  address,
  onAddressChange,
  onGo,
  current,
  onBack,
  onForward,
  onReload,
  viewport,
  onViewportChange,
  console: drawer,
}: PreviewToolbarProps) {
  return (
    <div className="h-ws-16 border-ws-static-subtle px-ws-9 gap-ws-5 flex shrink-0 items-center border-b">
      <div className="gap-ws-2 flex shrink-0 items-center">
        {/* With nowhere to go they are disabled, and keep their place. */}
        <BarAction
          icon={RiArrowLeftLine}
          label="Back"
          disabled={!onBack}
          onClick={() => onBack?.()}
        />
        <BarAction
          icon={RiArrowRightLine}
          label="Forward"
          disabled={!onForward}
          onClick={() => onForward?.()}
        />
        <BarAction icon={RiRefreshLine} label="Reload" onClick={onReload} />
      </div>

      <form
        className="min-w-0 flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          onGo();
        }}
      >
        <TextInput
          size="sm"
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
          aria-label="Address"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>

      <SegmentedControl
        size="sm"
        value={viewport}
        onValueChange={(value) => onViewportChange(value as Viewport)}
        aria-label="Viewport"
        className="shrink-0"
      >
        <SegmentedControl.Item value="desktop" icon={RiComputerLine} aria-label="Desktop" />
        <SegmentedControl.Item value="tablet" icon={RiTabletLine} aria-label="Tablet" />
        <SegmentedControl.Item value="phone" icon={RiSmartphoneLine} aria-label="Phone" />
      </SegmentedControl>

      <div className="gap-ws-2 flex shrink-0 items-center">
        <Tooltip size="sm">
          <Tooltip.Trigger asChild>
            <Button
              size="xs"
              variant="secondary"
              preset="ghost"
              aria-expanded={drawer.open}
              aria-controls={drawer.open ? drawer.id : undefined}
              aria-label={`Console, ${drawer.count} ${drawer.count === 1 ? 'message' : 'messages'}`}
              onClick={drawer.onToggle}
            >
              <Button.Icon icon={RiTerminalBoxLine} />
              <span className="tabular-nums">{drawer.count}</span>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">
            <Tooltip.Label>{drawer.open ? 'Close console' : 'Open console'}</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>
        <Tooltip size="sm">
          <Tooltip.Trigger asChild>
            <IconButton
              icon={RiExternalLinkLine}
              size="xs"
              variant="secondary"
              preset="ghost"
              asChild
            >
              <a href={`http://${current}`} target="_blank" rel="noreferrer">
                <span className="sr-only">Open in a new window</span>
              </a>
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">
            <Tooltip.Label>Open in a new window</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>
      </div>
    </div>
  );
}
