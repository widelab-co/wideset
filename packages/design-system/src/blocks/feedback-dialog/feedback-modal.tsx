import {
  Button,
  Checkbox,
  FormField,
  Modal,
  SegmentedControl,
  Select,
  Textarea,
} from '@wideset/react';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

import { account, product, SCALE, TOPICS } from './data';
import { PageThumbnail } from './page-thumbnail';

export type Feedback = {
  score: string;
  topic: string;
  words: string;
  screenshot: boolean;
  followUp: boolean;
};

type FeedbackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The page the screenshot would be of, as its name. */
  page: string;
  /** Sent: where the feedback goes. The dialog says thanks either way. */
  onSend?: (feedback: Feedback) => void;
};

/**
 * Feedback on the product, from anywhere, in one dialog that says thanks in place. A plain
 * `Modal`: a short form, nothing to warn about.
 *
 * How it is going comes first, as five worded steps from Very hard to Very easy (words, not
 * faces, so each step means one thing), and it is the only answer Send feedback waits for. What
 * it is about, a few words, a screenshot of the page and whether we may write back are all
 * optional. The screenshot is off until asked for, and its thumbnail says what it would include.
 * The dialog takes the focus, not the scale's first step, so nothing looks chosen before it is.
 */
export function FeedbackModal({ open, onOpenChange, page, onSend }: FeedbackModalProps) {
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
        <FeedbackFlow page={page} onSend={onSend} />
      </Modal.Content>
    </Modal>
  );
}

function FeedbackFlow({ page, onSend }: Pick<FeedbackModalProps, 'page' | 'onSend'>) {
  const [sent, setSent] = useState(false);

  return sent ? (
    <FeedbackSent />
  ) : (
    <FeedbackForm
      page={page}
      onSend={(feedback) => {
        setSent(true);
        onSend?.(feedback);
      }}
    />
  );
}

function FeedbackForm({ page, onSend }: { page: string; onSend: (feedback: Feedback) => void }) {
  const id = useId();
  const [score, setScore] = useState('');
  const [topic, setTopic] = useState('');
  const [words, setWords] = useState('');
  const [screenshot, setScreenshot] = useState(false);
  const [followUp, setFollowUp] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (score) onSend({ score, topic, words: words.trim(), screenshot, followUp });
  };

  return (
    <form onSubmit={submit} noValidate>
      <Modal.Header>
        <Modal.Title>Send feedback</Modal.Title>
        <Modal.Description>
          It goes to the people who build {product.name}. We read every message.
        </Modal.Description>
      </Modal.Header>
      <Modal.Body className="gap-ws-11 flex flex-col">
        <FormField
          label={`How easy is ${product.name} to use?`}
          id={`${id}-score`}
          WrapperComponent="fieldset"
        >
          <SegmentedControl
            variant="fullWidth"
            aria-labelledby={`${id}-score`}
            value={score}
            onValueChange={setScore}
          >
            {SCALE.map((step) => (
              <SegmentedControl.Item key={step.value} value={step.value}>
                {step.label}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl>
        </FormField>

        <FormField label="What is it about?" htmlFor={`${id}-topic`}>
          <Select
            id={`${id}-topic`}
            preset="border"
            className="w-full"
            placeholder="Choose a topic"
            options={TOPICS}
            value={topic}
            onValueChange={setTopic}
          />
        </FormField>

        <FormField label="A few words" htmlFor={`${id}-words`}>
          <Textarea
            id={`${id}-words`}
            rows={4}
            maxLength={2000}
            placeholder="What worked, what got in the way, what you expected to happen"
            value={words}
            onChange={(event) => setWords(event.target.value)}
          />
        </FormField>

        <div className="gap-ws-7 flex flex-col">
          {/* A checkbox, not a switch: it is sent with the form, not applied at once. */}
          <Checkbox
            label="Include a screenshot of this page"
            checked={screenshot}
            onCheckedChange={(checked) => setScreenshot(checked === true)}
          />
          {screenshot && (
            <div className="gap-ws-9 flex items-start">
              <PageThumbnail className="w-[9rem]" />
              <p className="typography-body-sm text-ws-static-subtle min-w-0">
                {`${page}, as it is now. Customer names and amounts on it are included.`}
              </p>
            </div>
          )}
        </div>

        <Checkbox
          label={`${product.name} may follow up with me`}
          description={`At ${account.email}, only about this feedback.`}
          checked={followUp}
          onCheckedChange={(checked) => setFollowUp(checked === true)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <Button variant="secondary" preset="border">
            Cancel
          </Button>
        </Modal.Close>
        <Button type="submit" disabled={!score}>
          Send feedback
        </Button>
      </Modal.Footer>
    </form>
  );
}

/** The thanks, in the same dialog: one line on what happens to it, and Close, which takes the focus. */
function FeedbackSent() {
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => close.current?.focus(), []);

  return (
    <>
      {/* No body between them, so the footer's line is the only one. */}
      <Modal.Header className="border-b-0">
        <Modal.Title>Thanks for the feedback</Modal.Title>
        <Modal.Description>
          The product team reads it this week and weighs it with the rest when planning what to
          build next.
        </Modal.Description>
      </Modal.Header>
      <Modal.Footer>
        <Modal.Close asChild>
          <Button ref={close}>Close</Button>
        </Modal.Close>
      </Modal.Footer>
    </>
  );
}
