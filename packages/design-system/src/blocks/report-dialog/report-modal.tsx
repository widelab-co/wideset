import {
  type RemixiconComponentType,
  RiEyeOffLine,
  RiForbidLine,
  RiTimeLine,
  RiUserUnfollowLine,
} from '@remixicon/react';
import {
  Button,
  Checkbox,
  FormField,
  Modal,
  RadioButton,
  RadioButtonGroup,
  Textarea,
} from '@wideset/react';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

import { type Reason, REASONS, type Reportable, workspace } from './data';
import { QuotedItem } from './quoted-item';

export type Report = { reason: Reason; details: string; block: boolean };

type ReportModalProps = {
  /** What is reported; nothing renders without it. */
  item?: Reportable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Sent: the page hides the item for the reporter at once, while the dialog says thanks. */
  onSend: (item: Reportable, report: Report) => void;
};

/**
 * Reporting a post or a comment to the workspace's admins, in one dialog that says thanks in
 * place. A plain `Modal`: it is a short form, not a status.
 *
 * The item is quoted small at the top, so it is clear what is reported. Then the reason, one of
 * four, one line each; Send report waits for one. Details are optional, except for Something
 * else, where they are the reason, so sending without them stops with the reason under the field.
 * Blocking is offered beside it, with what it does, and stays off unless chosen. The dialog
 * takes the focus, not the first reason, so no reason looks picked before one is; Tab reaches them.
 */
export function ReportModal({ item, open, onOpenChange, onSend }: ReportModalProps) {
  if (!item) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        // Not a control, so it shows no ring (Popup's content does the same).
        className="outline-hidden"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          if (event.currentTarget instanceof HTMLElement) event.currentTarget.focus();
        }}
      >
        {/* Inside the content, so every opening starts from an empty form. */}
        <ReportFlow item={item} onSend={(report) => onSend(item, report)} />
      </Modal.Content>
    </Modal>
  );
}

function ReportFlow({ item, onSend }: { item: Reportable; onSend: (report: Report) => void }) {
  const [sent, setSent] = useState<Report>();

  return sent ? (
    <ReportSent item={item} report={sent} />
  ) : (
    <ReportForm
      item={item}
      onSend={(report) => {
        setSent(report);
        onSend(report);
      }}
    />
  );
}

function ReportForm({ item, onSend }: { item: Reportable; onSend: (report: Report) => void }) {
  const id = useId();
  const details = useRef<HTMLTextAreaElement>(null);
  const [reason, setReason] = useState<Reason>();
  const [text, setText] = useState('');
  const [block, setBlock] = useState(false);
  const [error, setError] = useState<string>();
  const detailsRequired = reason === 'other';

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!reason) return;
    if (detailsRequired && !text.trim()) {
      setError('Say in a few words what is wrong with it.');
      details.current?.focus();
      return;
    }
    onSend({ reason, details: text.trim(), block });
  };

  return (
    <form onSubmit={submit} noValidate>
      <Modal.Header>
        <Modal.Title>Report this {item.kind}</Modal.Title>
        <Modal.Description>
          Reports go to the admins of {workspace.name}, not to the person you report.
        </Modal.Description>
      </Modal.Header>
      <Modal.Body className="gap-ws-11 flex flex-col">
        <QuotedItem item={item} />

        <FormField
          label="Why are you reporting it?"
          id={`${id}-reason`}
          WrapperComponent="fieldset"
        >
          <RadioButtonGroup
            aria-labelledby={`${id}-reason`}
            value={reason ?? ''}
            onValueChange={(value) => {
              setReason(value as Reason);
              setError(undefined);
            }}
          >
            {REASONS.map((option) => (
              <RadioButton key={option.value} value={option.value} label={option.label} />
            ))}
          </RadioButtonGroup>
        </FormField>

        <FormField
          label="Details"
          htmlFor={`${id}-details`}
          suffix={detailsRequired ? undefined : '(optional)'}
          required={detailsRequired}
          errorText={error}
        >
          <Textarea
            ref={details}
            id={`${id}-details`}
            rows={3}
            maxLength={500}
            required={detailsRequired}
            variant={error ? 'danger' : 'primary'}
            placeholder="Anything that helps an admin understand it"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setError(undefined);
            }}
          />
        </FormField>

        <Checkbox
          label={`Also block ${item.author.name}`}
          description="They can’t mention you or message you. They aren’t told."
          checked={block}
          onCheckedChange={(checked) => setBlock(checked === true)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <Button variant="secondary" preset="border">
            Cancel
          </Button>
        </Modal.Close>
        <Button type="submit" disabled={!reason}>
          Send report
        </Button>
      </Modal.Footer>
    </form>
  );
}

/** One thing that happens next: a quiet icon and a sentence. */
function Next({ icon: Icon, children }: { icon: RemixiconComponentType; children: string }) {
  return (
    <li className="gap-ws-7 flex items-start">
      <span className="h-ws-11 flex shrink-0 items-center">
        <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle" />
      </span>
      <span className="typography-body-md text-ws-static-base">{children}</span>
    </li>
  );
}

/**
 * The thanks, in the same dialog: what happens next in three or four plain lines, and Done, which
 * takes the focus from the form that was there.
 */
function ReportSent({ item, report }: { item: Reportable; report: Report }) {
  const done = useRef<HTMLButtonElement>(null);
  const firstName = item.author.name.split(' ')[0];

  useEffect(() => done.current?.focus(), []);

  return (
    <>
      <Modal.Header>
        <Modal.Title>Thanks for reporting it</Modal.Title>
        <Modal.Description>Here is what happens next.</Modal.Description>
      </Modal.Header>
      <Modal.Body>
        <ul className="gap-ws-7 flex flex-col">
          <Next icon={RiTimeLine}>
            {`An admin at ${workspace.name} reviews it within a working day.`}
          </Next>
          <Next icon={RiUserUnfollowLine}>{`${firstName} isn’t told who reported it.`}</Next>
          <Next icon={RiEyeOffLine}>
            {`The ${item.kind} is hidden for you. You can still choose to see it.`}
          </Next>
          {report.block && (
            <Next icon={RiForbidLine}>
              {`You blocked ${item.author.name}. You can unblock them in Settings.`}
            </Next>
          )}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <Button ref={done}>Done</Button>
        </Modal.Close>
      </Modal.Footer>
    </>
  );
}
