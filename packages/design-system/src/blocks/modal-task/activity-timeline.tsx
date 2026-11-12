// TODO(custom): activity timeline (dot, entry, date, subtask card); no Timeline in Wideset.
import { RiChat2Line, RiMoreFill, RiUserFill } from '@remixicon/react';
import { Avatar, IconButton, StatusBadge } from '@wideset/react';

import type { Activity } from './data';

/** The task's history on a line of dots, newest first; an entry about a subtask shows its card. */
export function ActivityTimeline({ items }: { items: Activity[] }) {
  return (
    <ol className="gap-ws-12 py-ws-5 flex flex-col">
      {items.map((item, index) => (
        <li key={item.id} className="gap-ws-8 relative flex">
          {/* Figma's dot (#9a9a9a) and line (#e5e5e5) are unbound: the nearest tokens stand in. */}
          <span aria-hidden="true" className="w-ws-15 pt-ws-6 flex shrink-0 justify-center">
            <span className="size-ws-5 rounded-ws-control-full relative bg-(--ws-semantic-stroke-neutral)" />
          </span>
          {index < items.length - 1 ? (
            <span
              aria-hidden="true"
              className="border-ws-static-subtle left-ws-10 top-ws-11 -bottom-ws-16 absolute border-l"
            />
          ) : null}
          <div className="gap-ws-7 flex min-w-0 flex-1 flex-col">
            <div className="gap-ws-3 flex flex-col">
              <p className="gap-ws-3 typography-label-strong-sm text-ws-static-base flex items-center">
                {item.text}
                {item.person ? (
                  <>
                    {/* No status dot, unlike Figma's photos: at 20px it would sit on the initials. */}
                    <Avatar size="xs" initials={item.person.initials} color={item.person.color} />
                    {item.person.name}
                  </>
                ) : null}
              </p>
              <p className="typography-body-md text-ws-static-subtle">{item.date}</p>
            </div>
            {item.subtask ? (
              <div className="bg-ws-static-highlight-base rounded-ws-container-sm gap-ws-3 px-ws-7 pt-ws-5 pb-ws-7 flex flex-col">
                <div className="gap-ws-5 p-ws-3 flex items-start">
                  <p className="typography-label-sm text-ws-static-strong min-w-0 flex-1">
                    {item.subtask.title}
                  </p>
                  <IconButton
                    variant="secondary"
                    preset="ghost"
                    size="xs"
                    icon={RiMoreFill}
                    aria-label={`Actions for ${item.subtask.title}`}
                  />
                </div>
                {/* Figma's badges are 24px tall with Small's type: Small sits in a 24px row. */}
                <div className="h-ws-12 px-ws-3 flex items-center justify-between">
                  <div className="gap-ws-3 flex items-center">
                    <StatusBadge size="sm">
                      <StatusBadge.Icon icon={RiUserFill} />
                      <StatusBadge.Label>{item.subtask.reviewers} reviewers</StatusBadge.Label>
                    </StatusBadge>
                    <StatusBadge size="sm">
                      <StatusBadge.Label>Done by {item.subtask.doneBy}</StatusBadge.Label>
                    </StatusBadge>
                  </div>
                  {/* The comment count has no fill in Figma, which StatusBadge cannot do. */}
                  <span className="gap-ws-3 px-ws-4 typography-caption-strong-md text-ws-semantic-on-subtle-neutral flex items-center">
                    <RiChat2Line aria-hidden="true" className="size-ws-8" />
                    {item.subtask.comments}
                    <span className="sr-only"> comments</span>
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
