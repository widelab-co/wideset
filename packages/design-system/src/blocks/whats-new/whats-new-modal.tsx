import { Accordion, Button, Checkbox, Divider, Modal } from '@wideset/react';
import { useId } from 'react';

import { earlier, latest } from './data';
import { FeaturePreview } from './feature-preview';
import { formatDate, formatMonthDay } from './format';

type WhatsNewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Whether updates like this stop opening on their own. */
  muted: boolean;
  onMutedChange: (muted: boolean) => void;
};

/**
 * What's new, read like release notes: the latest update in full (a sketch of it, the day it
 * shipped, what it does and why), then Try it, the modal's one filled button, and a quiet Read
 * more. Under a line, the earlier updates as a list of day, title and one line, each opening in
 * place for the rest. The footer holds only the choice to stop these opening on load; the X and
 * Esc close it. No colour, no illustration: the sketch is grey and the words carry it.
 */
export function WhatsNewModal({ open, onOpenChange, muted, onMutedChange }: WhatsNewModalProps) {
  const latestId = useId();
  const earlierId = useId();

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {/* Focus starts on Try it, the one thing the modal offers; Radix's own first pick skips links
          and would land on the earlier updates. */}
      <Modal.Content
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById(`${latestId}-try`)?.focus();
        }}
      >
        <Modal.Header>
          <Modal.Title>What’s new in Orbit</Modal.Title>
          <Modal.Description>The latest changes to your workspace, newest first.</Modal.Description>
        </Modal.Header>
        <Modal.Body className="gap-ws-12 flex flex-col">
          <article aria-labelledby={latestId} className="gap-ws-9 flex flex-col">
            <FeaturePreview />
            <div className="gap-ws-3 flex flex-col">
              <time dateTime={latest.date} className="typography-caption-md text-ws-static-subtle">
                {formatDate(latest.date)}
              </time>
              <h3 id={latestId} className="typography-subtitle-xs text-ws-static-strong">
                {latest.title}
              </h3>
            </div>
            <div className="gap-ws-5 typography-body-md text-ws-static-base flex flex-col">
              <p>{latest.what}</p>
              <p>{latest.why}</p>
            </div>
            <div className="gap-ws-5 flex items-center">
              <Button asChild>
                <a id={`${latestId}-try`} href={latest.href} onClick={() => onOpenChange(false)}>
                  Try it
                </a>
              </Button>
              <Button asChild variant="secondary" preset="ghost">
                <a href={latest.readMore}>Read more</a>
              </Button>
            </div>
          </article>

          <Divider weight="thin" />

          <section aria-labelledby={earlierId} className="gap-ws-5 flex flex-col">
            <h3 id={earlierId} className="typography-label-strong-md text-ws-static-strong">
              Earlier updates
            </h3>
            <Accordion type="single" collapsible>
              {earlier.map((update) => (
                <Accordion.Item key={update.id} value={update.id}>
                  <Accordion.Trigger>
                    <div className="gap-ws-1 flex min-w-0 flex-1 flex-col">
                      <Accordion.Title>{update.title}</Accordion.Title>
                      <Accordion.Caption>{update.summary}</Accordion.Caption>
                    </div>
                    <time
                      dateTime={update.date}
                      className="typography-caption-md text-ws-static-subtle shrink-0 tabular-nums"
                    >
                      {formatMonthDay(update.date)}
                    </time>
                  </Accordion.Trigger>
                  <Accordion.Content>{update.detail}</Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          </section>
        </Modal.Body>
        <Modal.Footer className="justify-start">
          <Checkbox
            size="sm"
            label="Don’t show updates like this"
            checked={muted}
            onCheckedChange={(checked) => onMutedChange(checked === true)}
          />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
