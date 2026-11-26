import { RiCheckLine, RiThumbDownLine, RiThumbUpLine } from '@remixicon/react';
import { Button, FormField, Textarea } from '@wideset/react';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

type Step = 'ask' | 'missing' | 'thanks';

/**
 * "Was this helpful?" at the end of the text. Yes thanks the reader at once; No first asks, in
 * one short field, what was missing. Either way the thanks replaces the question in place, at
 * the height of its buttons, so a Yes does not move the page. Nothing here is the page's main action, so the buttons are bordered.
 */
export function ArticleFeedback() {
  const fieldId = useId();
  const [step, setStep] = useState<Step>('ask');
  const [missing, setMissing] = useState('');
  const [error, setError] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);

  // No opens the field; the caret goes straight into it.
  useEffect(() => {
    if (step === 'missing') field.current?.focus();
  }, [step]);

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!missing.trim()) {
      setError('Write a few words, or select Cancel.');
      return;
    }
    setStep('thanks');
  };

  if (step === 'thanks') {
    return (
      <p
        role="status"
        className="gap-ws-5 min-h-ws-14 typography-body-md text-ws-static-base flex items-center"
      >
        <RiCheckLine aria-hidden="true" className="size-ws-9 text-ws-static-strong shrink-0" />
        Thanks for telling us. The team that writes these articles reads every answer.
      </p>
    );
  }

  return (
    <div className="gap-ws-9 flex flex-col">
      <div className="gap-ws-9 flex flex-wrap items-center">
        <h2 className="typography-label-strong-md text-ws-static-strong">Was this helpful?</h2>
        <div className="gap-ws-5 flex">
          <Button variant="secondary" preset="border" size="sm" onClick={() => setStep('thanks')}>
            <Button.Icon icon={RiThumbUpLine} />
            Yes
          </Button>
          <Button
            variant="secondary"
            preset="border"
            size="sm"
            aria-expanded={step === 'missing'}
            onClick={() => setStep('missing')}
          >
            <Button.Icon icon={RiThumbDownLine} />
            No
          </Button>
        </div>
      </div>

      {step === 'missing' && (
        <form noValidate onSubmit={send} className="gap-ws-7 flex max-w-[32rem] flex-col">
          <FormField label="What was missing?" htmlFor={fieldId} errorText={error || undefined}>
            <Textarea
              ref={field}
              id={fieldId}
              size="sm"
              rows={3}
              variant={error ? 'danger' : 'primary'}
              placeholder="For example, how to import contacts with their customers"
              value={missing}
              onChange={(event) => {
                setMissing(event.target.value);
                setError('');
              }}
            />
          </FormField>
          <div className="gap-ws-5 flex">
            <Button type="submit" variant="secondary" preset="border" size="sm">
              Send
            </Button>
            <Button
              variant="secondary"
              preset="ghost"
              size="sm"
              onClick={() => {
                setStep('ask');
                setMissing('');
                setError('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
