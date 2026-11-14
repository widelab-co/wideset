import { RiArrowRightLine, RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, Button, cn, IconButton } from '@wideset/react';
import { useEffect, useId, useState } from 'react';

import { CourseOutline } from './course-outline';
import { allLessons, course, lesson, nextLesson, quiz } from './data';
import { LessonHeader } from './lesson-header';
import { LessonQuiz } from './lesson-quiz';
import { LessonTabs } from './lesson-tabs';
import { LessonSidebar } from './sidebar';
import { usePlayback } from './use-playback';
import { VideoPlayer } from './video-player';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * Lesson (Inset direction): one lesson of a course on the raised page beside the workspace
 * sidebar. The video is the page's one object and the heaviest thing on it; the title, the tabs
 * and the course outline beside it serve it. When the video ends, or from "Take the quiz", a short
 * quiz takes the video's place; passing it completes the lesson, which ticks it off in the
 * outline and moves the course on. One filled button at a time: Check in the quiz, then
 * "Complete lesson", then "Next lesson".
 */
export default function Lesson() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const playback = usePlayback(lesson.duration, lesson.resumeAt);
  const [stage, setStage] = useState<'video' | 'quiz'>('video');
  const [completed, setCompleted] = useState(false);

  // The quiz follows the video, the way a course does.
  const { ended } = playback;
  useEffect(() => {
    if (ended && !completed) setStage('quiz');
  }, [ended, completed]);

  const done = allLessons.filter((item) => item.state === 'done').length + (completed ? 1 : 0);
  const watch = () => setStage('video');

  const seek = (time: number) => {
    watch();
    playback.seek(time);
  };

  return (
    <AppShell direction="inset">
      <LessonSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <AppShell.Main>
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSideBarLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item asChild>
                <a href="#academy">Academy</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item asChild>
                <a href="#sales-onboarding">{course.title}</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{lesson.title}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div
            className={cn(
              COLUMN,
              'gap-ws-16 pt-ws-14 pb-ws-16 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_20rem]',
            )}
          >
            <div className="gap-ws-12 flex min-w-0 flex-col">
              {stage === 'video' ? (
                <VideoPlayer
                  title={lesson.title}
                  playback={playback}
                  chapters={lesson.chapters}
                  captions={lesson.transcript}
                />
              ) : (
                <LessonQuiz
                  questions={quiz}
                  completed={completed}
                  next={nextLesson}
                  progress={`${done} of ${allLessons.length} lessons done`}
                  onComplete={() => setCompleted(true)}
                  onWatch={watch}
                />
              )}

              <LessonHeader
                title={lesson.title}
                summary={lesson.summary}
                action={
                  stage === 'quiz' ? undefined : completed ? (
                    <Button size="sm" asChild>
                      <a href={`#${nextLesson.id}`}>
                        Next lesson
                        <Button.Icon icon={RiArrowRightLine} />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      preset="border"
                      onClick={() => {
                        playback.pause();
                        setStage('quiz');
                      }}
                    >
                      Take the quiz
                    </Button>
                  )
                }
              />

              <LessonTabs
                outcomes={lesson.outcomes}
                transcript={lesson.transcript}
                resources={lesson.resources}
                onSeek={seek}
              />
            </div>

            <CourseOutline
              title={course.title}
              modules={course.modules}
              openId={lesson.id}
              openDone={completed}
            />
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
