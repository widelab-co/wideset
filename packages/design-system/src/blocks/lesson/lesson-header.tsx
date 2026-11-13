// TODO(custom): page header (title, a line of description, the action on the right); no PageHeader in Wideset.
import type { ReactNode } from 'react';

type LessonHeaderProps = {
  title: string;
  summary: string;
  /** The one action the lesson offers now, or nothing while the quiz holds it. */
  action?: ReactNode;
};

/**
 * The lesson's title under its video, with one line saying what it teaches and, on the right,
 * what to do next. It sits under the video because the video is what the page opens on.
 */
export function LessonHeader({ title, summary, action }: LessonHeaderProps) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-title-md text-ws-static-strong">{title}</h1>
        <p className="typography-body-md text-ws-static-subtle">{summary}</p>
      </div>
      {action}
    </header>
  );
}
