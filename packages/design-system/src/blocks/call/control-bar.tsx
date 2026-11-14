import {
  type RemixiconComponentType,
  RiArrowUpBoxLine,
  RiChat3Line,
  RiFileEditLine,
  RiGroupLine,
  RiMicLine,
  RiMicOffLine,
  RiRecordCircleLine,
  RiVideoOffLine,
  RiVideoOnLine,
} from '@remixicon/react';
import { Button, IconButton, type IconButtonProps, Popup, Tooltip } from '@wideset/react';
import { forwardRef, type ReactNode, useState } from 'react';

/** The side panel's tabs, in the order the bar and the panel list them. */
export type PanelTab = 'notes' | 'chat' | 'people';

type ToggleProps = Omit<IconButtonProps, 'aria-label' | 'aria-pressed'> & {
  /** The control's name, the same pressed or not: `aria-pressed` says which. */
  label: string;
  pressed: boolean;
};

/**
 * A toggle on the bar: quiet when off, a neutral fill when on (Wideset's secondary fill), never a
 * colour, so the bar's only red stays Leave. It forwards its ref so a popup can anchor to it.
 */
const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { label, pressed, ...props },
  ref,
) {
  return (
    <IconButton
      ref={ref}
      variant="secondary"
      preset={pressed ? 'filled' : 'ghost'}
      size="sm"
      aria-label={label}
      aria-pressed={pressed}
      {...props}
    />
  );
});

/** Names a control on hover and focus, above it; the control keeps its own `aria-label`. */
function Hint({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip size="sm">
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Content side="top">
        <Tooltip.Label>{label}</Tooltip.Label>
      </Tooltip.Content>
    </Tooltip>
  );
}

const PANELS: { tab: PanelTab; label: string; icon: RemixiconComponentType }[] = [
  { tab: 'notes', label: 'Notes', icon: RiFileEditLine },
  { tab: 'chat', label: 'Chat', icon: RiChat3Line },
  { tab: 'people', label: 'People', icon: RiGroupLine },
];

type ControlBarProps = {
  muted: boolean;
  cameraOff: boolean;
  sharing: boolean;
  recording: boolean;
  /** The side panel's open tab, or nothing while it is closed. */
  panel: PanelTab | null;
  onMutedChange: (muted: boolean) => void;
  onCameraOffChange: (off: boolean) => void;
  onSharingChange: (sharing: boolean) => void;
  onRecordingChange: (recording: boolean) => void;
  onPanelChange: (panel: PanelTab | null) => void;
  onLeave: () => void;
};

/**
 * The call's controls under the stage: what Maya sends (microphone, camera, screen, recording)
 * on the left; the panels and the way out on the right. Each is an icon button named by its
 * label and a tooltip, its state in `aria-pressed`. Recording asks first, since everyone on the
 * call will be told; stopping it does not. Leave is the one coloured control.
 */
export function ControlBar({
  muted,
  cameraOff,
  sharing,
  recording,
  panel,
  onMutedChange,
  onCameraOffChange,
  onSharingChange,
  onRecordingChange,
  onPanelChange,
  onLeave,
}: ControlBarProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div role="toolbar" aria-label="Call controls" className="flex items-center justify-between">
      <div className="gap-ws-3 flex items-center">
        <Hint label={muted ? 'Unmute' : 'Mute'}>
          <Toggle
            icon={muted ? RiMicOffLine : RiMicLine}
            label="Mute"
            pressed={muted}
            onClick={() => onMutedChange(!muted)}
          />
        </Hint>
        <Hint label={cameraOff ? 'Turn on camera' : 'Turn off camera'}>
          <Toggle
            icon={cameraOff ? RiVideoOffLine : RiVideoOnLine}
            label="Camera off"
            pressed={cameraOff}
            onClick={() => onCameraOffChange(!cameraOff)}
          />
        </Hint>
        <Hint label={sharing ? 'Stop sharing' : 'Share screen'}>
          <Toggle
            icon={RiArrowUpBoxLine}
            label="Share screen"
            pressed={sharing}
            onClick={() => onSharingChange(!sharing)}
          />
        </Hint>
        {/* The trigger opens the confirm only to start; a press while recording stops at once. */}
        <Popup open={confirming} onOpenChange={(open) => setConfirming(open && !recording)}>
          <Hint label={recording ? 'Stop recording' : 'Record'}>
            <Popup.Trigger asChild>
              <Toggle
                icon={RiRecordCircleLine}
                label="Record"
                pressed={recording}
                onClick={recording ? () => onRecordingChange(false) : undefined}
              />
            </Popup.Trigger>
          </Hint>
          <Popup.Container side="top" align="start" className="w-[20rem]">
            <Popup.Header>
              <Popup.Title>Record this call?</Popup.Title>
            </Popup.Header>
            <Popup.Content>
              <Popup.Description>
                Everyone on the call is told that it is being recorded. The recording is saved to
                the deal.
              </Popup.Description>
            </Popup.Content>
            <Popup.Footer>
              <Popup.Close asChild>
                <Button variant="secondary" preset="border" size="sm">
                  Cancel
                </Button>
              </Popup.Close>
              <Button
                size="sm"
                onClick={() => {
                  onRecordingChange(true);
                  setConfirming(false);
                }}
              >
                Start recording
              </Button>
            </Popup.Footer>
          </Popup.Container>
        </Popup>
      </div>

      <div className="gap-ws-3 flex items-center">
        {PANELS.map(({ tab, label, icon }) => (
          <Hint key={tab} label={panel === tab ? `Hide ${label.toLowerCase()}` : label}>
            <Toggle
              icon={icon}
              label={label}
              pressed={panel === tab}
              onClick={() => onPanelChange(panel === tab ? null : tab)}
            />
          </Hint>
        ))}
        <Button variant="danger" size="sm" onClick={onLeave} className="ml-ws-7">
          Leave
        </Button>
      </div>
    </div>
  );
}
