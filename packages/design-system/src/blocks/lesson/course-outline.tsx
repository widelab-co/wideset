// TODO(custom): course outline (modules, lesson rows with their state and length, the open lesson selected); Wideset has no outline or tree list.
import {
  type RemixiconComponentType,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiLockLine,
  RiPlayCircleFill,
} from '@remixicon/react';
import { cn, ProgressBar } from '@wideset/react';
import { useId } from 'react';

import type { CourseModule, LessonState, OutlineLesson } from './data';
import { formatMinutes } from './format';

/** Each state's mark and the words a screen reader hears for it. */
const STATE: Record<LessonState, { icon: RemixiconComponentType; label: string }> = {
  done: { icon: RiCheckboxCircleFill, label: 'Done' },
  current: { icon: RiPlayCircleFill, label: 'In progress' },
  'not-started': { icon: RiCheckboxBlankCircleLine, label: 'Not started' },
  locked: { icon: RiLockLine, label: 'Locked' },
};

const ROW =
  'gap-ws-5 px-ws-5 py-ws-4 rounded-ws-control-lg typography-label-sm flex w-full items-center';

/**
 * One lesson: its state, its title and its length. The open lesson takes the selected
 * treatment (the brand tint, its mark in the brand colour); a locked one is plain text, since
 * there is nowhere to go yet.
 */
function LessonRow({
  lesson,
  state,
  open,
}: {
  lesson: OutlineLesson;
  state: LessonState;
  open: boolean;
}) {
  const { icon: Icon, label } = STATE[state];
  const content = (
    <>
      <Icon
        aria-hidden="true"
        className={cn(
          'size-ws-9 shrink-0',
          state === 'done'
            ? 'text-ws-static-base'
            : open
              ? 'text-ws-dynamic-primary-default'
              : 'text-ws-static-subtle',
        )}
      />
      <span className="sr-only">{label}: </span>
      <span
        className={cn(
          'min-w-0 flex-1 truncate',
          state === 'locked' ? 'text-ws-static-subtle' : 'text-ws-static-strong',
          open && 'typography-label-strong-sm',
        )}
      >
        {lesson.title}
      </span>
      <span className="text-ws-static-subtle shrink-0 tabular-nums">
        {formatMinutes(lesson.minutes)}
      </span>
    </>
  );

  if (state === 'locked') return <div className={ROW}>{content}</div>;

  return (
    <a
      href={`#${lesson.id}`}
      aria-current={open ? 'page' : undefined}
      className={cn(
        ROW,
        'hover:bg-ws-dynamic-tertiary-alpha-strong-default aria-[current=page]:bg-ws-dynamic-primary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default',
      )}
    >
      {content}
    </a>
  );
}

type CourseOutlineProps = {
  title: string;
  modules: CourseModule[];
  /** The lesson on the page. */
  openId: string;
  /** Whether the open lesson has been completed on this page. */
  openDone: boolean;
};

/**
 * The course beside the lesson: how far the learner is, as one bar and "4 of 12 lessons", then
 * every module with its lessons, so they see where this lesson sits and what comes next.
 */
export function CourseOutline({ title, modules, openId, openDone }: CourseOutlineProps) {
  const titleId = useId();
  const stateOf = (lesson: OutlineLesson): LessonState =>
    lesson.id === openId && openDone ? 'done' : lesson.state;
  const lessons = modules.flatMap((module) => module.lessons);
  const done = lessons.filter((lesson) => stateOf(lesson) === 'done').length;

  return (
    <nav aria-labelledby={titleId} className="gap-ws-12 flex flex-col">
      <div className="gap-ws-7 flex flex-col">
        <div className="gap-ws-9 flex items-baseline justify-between">
          <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
            {title}
          </h2>
          <p className="typography-label-sm text-ws-static-subtle tabular-nums">
            {done} of {lessons.length} lessons
          </p>
        </div>
        <ProgressBar
          value={done}
          max={lessons.length}
          aria-label="Course progress"
          getValueLabel={(value, max) => `${value} of ${max} lessons done`}
        />
      </div>

      {modules.map((module, index) => (
        <section key={module.id} aria-label={module.title} className="gap-ws-2 flex flex-col">
          <h3 className="typography-caption-strong-md text-ws-static-subtle px-ws-5 py-ws-3">
            Module {index + 1} · {module.title}
          </h3>
          <ol className="flex flex-col">
            {module.lessons.map((lesson) => (
              <li key={lesson.id}>
                <LessonRow lesson={lesson} state={stateOf(lesson)} open={lesson.id === openId} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </nav>
  );
}
