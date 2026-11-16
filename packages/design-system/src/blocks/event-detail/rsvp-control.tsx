import {
  type RemixiconComponentType,
  RiArrowDownSLine,
  RiCheckLine,
  RiCloseLine,
  RiMailSendLine,
  RiQuestionLine,
} from '@remixicon/react';
import {
  Button,
  DropdownMenu,
  FormField,
  IconButton,
  ListItem,
  Popup,
  SegmentedControl,
  Select,
  SplitButton,
} from '@wideset/react';
import { useId, useState } from 'react';

import { type Answer, ANSWERS, DIETS } from './data';
import { formatShortDate } from './format';

const ICON: Record<Answer, RemixiconComponentType> = {
  going: RiCheckLine,
  maybe: RiQuestionLine,
  'not-going': RiCloseLine,
};

const labelOf = (answer: Answer) => ANSWERS.find(({ value }) => value === answer)?.label ?? '';

type RsvpControlProps = {
  /** Null until the guest answers. */
  answer: Answer | null;
  onAnswer: (answer: Answer) => void;
  /** Where the recording goes. */
  email: string;
  /** The hosts' deadline for answers, a calendar day. */
  answerBy: string;
};

/**
 * The answer to the invitation, the page's one filled control until it is given: a split button
 * whose main half says Going and whose menu holds Maybe and Can't go. Once answered it turns into
 * a quiet button that shows the answer and opens it again. The popup opens by itself on the
 * answer, so the follow-up sits where the guest is looking: Going asks for dietary needs (optional)
 * then thanks; Can't go offers the recording; Maybe says when the hosts need to know.
 */
export function RsvpControl({ answer, onAnswer, email, answerBy }: RsvpControlProps) {
  const dietId = useId();
  const [open, setOpen] = useState(false);
  const [diet, setDiet] = useState<string>();
  const [dietSaved, setDietSaved] = useState(false);
  const [recording, setRecording] = useState(false);

  const answerWith = (value: Answer) => {
    onAnswer(value);
    setOpen(true);
  };

  if (!answer) {
    return (
      <SplitButton
        size="sm"
        icon={RiArrowDownSLine}
        iconAriaLabel="Other answers"
        onClick={() => answerWith('going')}
        menuContent={ANSWERS.filter(({ value }) => value !== 'going').map(({ value, label }) => {
          const Icon = ICON[value];
          return (
            <DropdownMenu.Item key={value} onSelect={() => answerWith(value)}>
              <ListItem.Prefix>
                <Icon className="size-ws-9" />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>{label}</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          );
        })}
      >
        <SplitButton.Icon icon={RiCheckLine} />
        Going
      </SplitButton>
    );
  }

  const dietLabel = DIETS.find(({ value }) => value === diet)?.label;
  const askDiet = answer === 'going' && !dietSaved;

  return (
    <Popup open={open} onOpenChange={setOpen}>
      <Popup.Trigger asChild>
        <Button
          variant="secondary"
          preset="border"
          size="sm"
          aria-label={`${labelOf(answer)}, your answer`}
        >
          <Button.Icon icon={ICON[answer]} />
          {labelOf(answer)}
          <Button.Icon icon={RiArrowDownSLine} />
        </Button>
      </Popup.Trigger>
      <Popup.Container side="bottom" align="end" className="w-[22rem]">
        <Popup.Header>
          <div className="gap-ws-5 flex items-center justify-between">
            <Popup.Title>Your answer</Popup.Title>
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
          <div className="gap-ws-9 flex flex-col">
            <SegmentedControl
              variant="fullWidth"
              size="sm"
              aria-label="Your answer"
              value={answer}
              onValueChange={(value) => onAnswer(value as Answer)}
            >
              {ANSWERS.map(({ value, label }) => (
                <SegmentedControl.Item key={value} value={value}>
                  {label}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl>

            {askDiet ? (
              <FormField
                label="Dietary needs"
                htmlFor={dietId}
                helperText="Optional. The kitchen plans the food from it."
              >
                <Select
                  id={dietId}
                  size="sm"
                  className="w-full"
                  placeholder="Choose one"
                  options={DIETS}
                  value={diet}
                  onValueChange={setDiet}
                />
              </FormField>
            ) : null}

            {answer === 'going' && dietSaved ? (
              <p className="typography-body-md text-ws-static-base" role="status">
                {dietLabel && diet !== 'none'
                  ? `Thanks. We have noted ${dietLabel.toLowerCase()} for you.`
                  : 'Thanks. See you on December 3.'}
              </p>
            ) : null}

            {answer === 'maybe' ? (
              <p className="typography-body-md text-ws-static-base">
                We will remind you on {formatShortDate(answerBy)}. The hosts need a final answer by
                then to plan the food.
              </p>
            ) : null}

            {answer === 'not-going' ? (
              recording ? (
                <p className="typography-body-md text-ws-static-base" role="status">
                  We will send the panel’s recording to {email} after the event.
                </p>
              ) : (
                <div className="gap-ws-7 flex flex-col items-start">
                  <p className="typography-body-md text-ws-static-base">
                    Sorry you will miss it. The panel is recorded.
                  </p>
                  <Button
                    variant="secondary"
                    preset="border"
                    size="sm"
                    onClick={() => setRecording(true)}
                  >
                    <Button.Icon icon={RiMailSendLine} />
                    Send me the recording
                  </Button>
                </div>
              )
            ) : null}
          </div>
        </Popup.Content>
        {askDiet ? (
          <Popup.Footer>
            <Button size="sm" onClick={() => setDietSaved(true)}>
              Save
            </Button>
          </Popup.Footer>
        ) : null}
      </Popup.Container>
    </Popup>
  );
}
