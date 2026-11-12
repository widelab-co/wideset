import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react';
import { Button, InlineAlert, RadioButton, RadioButtonGroup } from '@wideset/react';
import { type ReactNode, useId, useState } from 'react';

import { type OutlineLesson, PASS_MARK, type Question } from './data';
import { formatMinutes } from './format';

type LessonQuizProps = {
  questions: Question[];
  completed: boolean;
  next: OutlineLesson;
  /** Lessons done in the course, this one included once it is completed. */
  progress: string;
  onComplete: () => void;
  /** Back to the video, from any step. */
  onWatch: () => void;
};

/**
 * The quiz in place of the video, framed like a card on the white page and as tall as the video
 * it replaces, so the page under it does not jump. Its column sits in the middle of the frame.
 */
function Frame({ children }: { children: ReactNode }) {
  return (
    <section
      aria-label="Lesson quiz"
      className="border-ws-static-base rounded-ws-container-md grid border before:col-start-1 before:row-start-1 before:aspect-video before:content-['']"
    >
      <div className="gap-ws-12 p-ws-14 col-start-1 row-start-1 mx-auto flex w-full max-w-[38rem] flex-col justify-center">
        {children}
      </div>
    </section>
  );
}

/**
 * The lesson's quiz: one question at a time. Check locks the answer and says, in place, whether
 * it was right (positive) or wrong (negative), with the explanation either way; Next moves on.
 * The result offers "Complete lesson" at the pass mark and a retake below it. Each step has one
 * filled button, so the screen never has two.
 */
export function LessonQuiz({
  questions,
  completed,
  next,
  progress,
  onComplete,
  onWatch,
}: LessonQuizProps) {
  const questionId = useId();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [missing, setMissing] = useState(false);

  const retake = () => {
    setStep(0);
    setAnswers({});
    setChecked(false);
  };

  if (completed) {
    return (
      <Frame>
        <div className="gap-ws-3 flex flex-col">
          <h2 className="typography-subtitle-xs text-ws-static-strong">Lesson complete</h2>
          <p className="typography-body-md text-ws-static-subtle">
            {progress}. Next up: {next.title}, {formatMinutes(next.minutes)}.
          </p>
        </div>
        <div className="gap-ws-5 flex">
          <Button size="sm" asChild>
            <a href={`#${next.id}`}>
              Next lesson
              <Button.Icon icon={RiArrowRightLine} />
            </a>
          </Button>
          <Button size="sm" variant="secondary" preset="ghost" onClick={onWatch}>
            Watch again
          </Button>
        </div>
      </Frame>
    );
  }

  const question = questions[step];

  if (!question) {
    const score = questions.filter((item) => answers[item.id] === item.answer).length;
    const passed = score >= PASS_MARK;
    return (
      <Frame>
        <div className="gap-ws-3 flex flex-col">
          <p className="typography-label-sm text-ws-static-subtle">Quiz result</p>
          <h2 className="typography-subtitle-md text-ws-static-strong tabular-nums">
            {score} of {questions.length} right
          </h2>
          <p className="typography-body-md text-ws-static-subtle">
            {passed
              ? 'You passed. Complete the lesson to tick it off and open the next one.'
              : `You need ${PASS_MARK} of ${questions.length} to pass. Watch the chapters again, then retake the quiz.`}
          </p>
        </div>
        <div className="gap-ws-5 flex">
          {passed ? (
            <>
              <Button size="sm" onClick={onComplete}>
                Complete lesson
              </Button>
              <Button size="sm" variant="secondary" preset="ghost" onClick={retake}>
                Retake quiz
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" onClick={retake}>
                Retake quiz
              </Button>
              <Button size="sm" variant="secondary" preset="ghost" onClick={onWatch}>
                Back to video
              </Button>
            </>
          )}
        </div>
      </Frame>
    );
  }

  const answer = answers[question.id];
  const right = answer === question.answer;
  const last = step === questions.length - 1;

  const onPrimary = () => {
    if (!checked) {
      if (!answer) return setMissing(true);
      setChecked(true);
      return;
    }
    setChecked(false);
    setStep(step + 1);
  };

  return (
    <Frame>
      <div className="gap-ws-5 flex items-center justify-between">
        <p className="typography-label-sm text-ws-static-subtle tabular-nums">
          Question {step + 1} of {questions.length}
        </p>
        <Button size="xs" variant="secondary" preset="ghost" onClick={onWatch}>
          <Button.Icon icon={RiArrowLeftLine} />
          Back to video
        </Button>
      </div>

      <div className="gap-ws-9 flex flex-col">
        <h2 id={questionId} className="typography-subtitle-xs text-ws-static-strong">
          {question.text}
        </h2>
        {/* After Check the answer is locked: the feedback is about the one chosen. */}
        <RadioButtonGroup
          key={question.id}
          aria-labelledby={questionId}
          value={answer ?? ''}
          onValueChange={(value) => {
            setAnswers({ ...answers, [question.id]: value });
            setMissing(false);
          }}
          disabled={checked}
        >
          {question.options.map((option) => (
            <RadioButton key={option.value} value={option.value} label={option.label} />
          ))}
        </RadioButtonGroup>
        {checked && (
          <InlineAlert
            persistent
            orientation="vertical"
            status={right ? 'success' : 'error'}
            title={right ? 'Right' : 'Not quite'}
            message={question.explanation}
          />
        )}
        {missing && (
          <p role="alert" className="typography-label-sm text-ws-dynamic-danger-default">
            Choose an answer to check it.
          </p>
        )}
      </div>

      <div>
        <Button size="sm" onClick={onPrimary}>
          {!checked ? 'Check' : last ? 'See result' : 'Next question'}
        </Button>
      </div>
    </Frame>
  );
}
