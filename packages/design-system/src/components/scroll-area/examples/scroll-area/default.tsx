/** The playground's stage: a recent-activity feed in a fixed height, its props set from the rail. */
import { ScrollArea, type ScrollAreaProps } from '@wideset/react';

const ACTIVITY = [
  ['Anna Kowalska', 'approved invoice INV-2041', '09:12'],
  ['Tomasz Nowak', 'commented on Q3 budget', '08:57'],
  ['Priya Raman', 'moved Onboarding flow to Done', '08:40'],
  ['Lucas Martin', 'uploaded signed-contract.pdf', '08:21'],
  ['Sofia Rossi', 'invited Mia Chen to Growth', 'Yesterday'],
  ['Omar Haddad', 'changed the due date of Launch plan', 'Yesterday'],
  ['Mia Chen', 'joined the Growth workspace', 'Yesterday'],
  ['Jan Wiśniewski', 'archived Roadmap 2024', 'Mon'],
  ['Anna Kowalska', 'renamed Marketing to Growth', 'Mon'],
  ['Priya Raman', 'closed 12 support tickets', 'Mon'],
];

export default function ScrollAreaDefault(props: Partial<ScrollAreaProps>) {
  return (
    <ScrollArea
      className="rounded-ws-container-md border-ws-static-base h-[16rem] w-[20rem] max-w-full border"
      {...props}
    >
      <ul className="gap-ws-9 p-ws-9 flex flex-col">
        {ACTIVITY.map(([name, action, time]) => (
          <li key={`${name}-${action}`} className="gap-ws-2 flex flex-col">
            <p className="typography-body-md text-ws-static-base">
              <span className="text-ws-static-strong">{name}</span> {action}
            </p>
            <span className="typography-caption-md text-ws-static-subtle">{time}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
