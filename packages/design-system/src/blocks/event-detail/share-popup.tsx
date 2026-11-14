import { RiCloseLine, RiShareForwardLine } from '@remixicon/react';
import { Button, IconButton, Popup, TextInput } from '@wideset/react';
import { useId } from 'react';

/**
 * Share: the event's link in a small popup beside the button, with Copy at its end, so the page
 * stays in view. The line under it says who can use the link: a guest still needs an invitation.
 */
export function SharePopup({ link, onCopy }: { link: string; onCopy: () => void }) {
  const fieldId = useId();

  const copy = () => {
    void navigator.clipboard?.writeText(link).catch(() => {});
    onCopy();
  };

  return (
    <Popup>
      <Popup.Trigger asChild>
        <Button variant="secondary" preset="border" size="sm">
          <Button.Icon icon={RiShareForwardLine} />
          Share
        </Button>
      </Popup.Trigger>
      <Popup.Container side="bottom" align="end" className="w-[24rem]">
        <Popup.Header>
          <div className="gap-ws-5 flex items-center justify-between">
            <Popup.Title>Share this event</Popup.Title>
            <Popup.Close asChild>
              <IconButton
                aria-label="Close"
                icon={RiCloseLine}
                preset="border"
                variant="secondary"
                size="sm"
              />
            </Popup.Close>
          </div>
        </Popup.Header>
        <Popup.Content>
          <div className="gap-ws-5 flex flex-col">
            <TextInput size="sm" value={link} onChange={() => {}}>
              <TextInput.Input
                id={fieldId}
                readOnly
                aria-label="Event link"
                onFocus={(event) => event.target.select()}
              />
              <TextInput.Suffix inner>
                <TextInput.Button onClick={copy}>Copy</TextInput.Button>
              </TextInput.Suffix>
            </TextInput>
            <Popup.Description>
              Anyone at Lumen Studio can open it. Customers need an invitation to answer.
            </Popup.Description>
          </div>
        </Popup.Content>
      </Popup.Container>
    </Popup>
  );
}
