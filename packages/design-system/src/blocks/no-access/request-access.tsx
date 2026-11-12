import { RiLock2Line, RiMailCheckLine } from '@remixicon/react';
import { Button, FormField, Textarea } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { account, report, ROUTES } from './data';
import { OwnerRow } from './owner-row';
import { StateIcon } from './state-icon';

const { owner } = report;

/**
 * Why the page is closed and how to get in: the owner, who decides, and a request with an
 * optional message. Once sent, the form gives way to what happens next; the request can be
 * withdrawn, and the message is kept if it is.
 */
export function RequestAccess() {
  const messageId = useId();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // A real screen posts the request and waits for it; here it is sent at once.
  const send = (event: FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  const back = (
    <Button asChild size="sm" variant="secondary" preset="border">
      <a href={ROUTES.reports}>Back to reports</a>
    </Button>
  );

  return (
    <div className="gap-ws-12 flex w-full max-w-[28rem] flex-col">
      <StateIcon icon={sent ? RiMailCheckLine : RiLock2Line} />

      <div aria-live="polite" className="gap-ws-3 flex flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">
          {sent ? 'Access requested' : 'You don’t have access to this report'}
        </h1>
        <p className="typography-body-md text-ws-static-base">
          {sent
            ? `${owner.firstName} gets your request by e-mail. You’ll hear back at ${account.email}.`
            : `${report.name} is in ${report.folder}, which only the finance team can open: it shows the margin and discount on every customer.`}
        </p>
      </div>

      <OwnerRow person={owner} note={`${owner.role}, owns this report`} />

      {sent ? (
        <div className="gap-ws-5 flex justify-end">
          <Button size="sm" variant="secondary" preset="ghost" onClick={() => setSent(false)}>
            Withdraw request
          </Button>
          {back}
        </div>
      ) : (
        <form onSubmit={send} className="gap-ws-12 flex flex-col">
          <FormField
            label={`Message to ${owner.firstName}`}
            suffix="(optional)"
            htmlFor={messageId}
            helperText={`A reason helps ${owner.firstName} decide.`}
          >
            <Textarea
              id={messageId}
              size="sm"
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="I’m preparing the Q4 board pack…"
            />
          </FormField>
          <div className="gap-ws-5 flex justify-end">
            {back}
            <Button type="submit" size="sm">
              Request access
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
