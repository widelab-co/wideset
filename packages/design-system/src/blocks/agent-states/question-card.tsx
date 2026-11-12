// TODO(custom): a question the agent needs answered before it goes on (the question, a few answers to pick from, Continue); Wideset has no card for a decision inside a transcript.
import { Button, RadioButton, RadioButtonGroup } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import type { QuestionOption } from './model';

type QuestionCardProps = {
  title: string;
  options: QuestionOption[];
  /** Answers with the option's own words, as if they had been typed. */
  onAnswer: (text: string) => void;
};

/**
 * What the agent asks when the next step is your decision, not its own: a bordered card in the
 * transcript, like an approval, with the question, two or three answers it can act on at once
 * (each with the fact that decides it), and Continue. Nothing is picked for you, so Continue
 * waits for a choice; it is the screen's filled button while the card waits. Any other answer
 * goes in the composer, as the last line says. Either way the answer becomes your message.
 */
export function QuestionCard({ title, options, onAnswer }: QuestionCardProps) {
  const titleId = useId();
  const [value, setValue] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const picked = options.find((option) => option.value === value);
    if (picked) onAnswer(picked.label);
  };

  return (
    <form
      onSubmit={submit}
      aria-labelledby={titleId}
      className="border-ws-static-base rounded-ws-container-md p-ws-9 gap-ws-9 flex flex-col border"
    >
      <p id={titleId} className="typography-label-strong-sm text-ws-static-strong">
        {title}
      </p>
      <RadioButtonGroup aria-labelledby={titleId} value={value} onValueChange={setValue}>
        {options.map((option) => (
          <RadioButton
            key={option.value}
            size="sm"
            value={option.value}
            label={option.label}
            description={option.description}
          />
        ))}
      </RadioButtonGroup>
      <div className="gap-ws-7 flex items-center">
        <Button type="submit" size="sm" disabled={!value}>
          Continue
        </Button>
        <p className="typography-body-md text-ws-static-subtle">
          Or answer in your own words below.
        </p>
      </div>
    </form>
  );
}
