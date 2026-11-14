import { Tabs } from '@wideset/react';

import type { Resource, TranscriptLine } from './data';
import { LessonTranscript } from './lesson-transcript';
import { ResourceFile } from './resource-file';

type LessonTabsProps = {
  outcomes: string[];
  transcript: TranscriptLine[];
  resources: Resource[];
  onSeek: (time: number) => void;
};

/**
 * What goes with the video, in three tabs without counts: what the lesson teaches, what is said
 * in it (a line plays from its moment) and the files to take away.
 */
export function LessonTabs({ outcomes, transcript, resources, onSeek }: LessonTabsProps) {
  return (
    <Tabs defaultValue="overview">
      <Tabs.List aria-label="About the lesson" className="w-full">
        <Tabs.Item value="overview">
          <Tabs.Label>Overview</Tabs.Label>
        </Tabs.Item>
        <Tabs.Item value="transcript">
          <Tabs.Label>Transcript</Tabs.Label>
        </Tabs.Item>
        <Tabs.Item value="resources">
          <Tabs.Label>Resources</Tabs.Label>
        </Tabs.Item>
      </Tabs.List>

      <Tabs.Content value="overview" className="gap-ws-7 pt-ws-12 flex max-w-[40rem] flex-col">
        <h2 className="typography-label-strong-md text-ws-static-strong">What you will learn</h2>
        <p className="typography-body-md text-ws-static-base">
          A good discovery call is mostly prepared before it starts. This lesson walks through the
          half hour before one: the research worth doing, the people worth knowing and the agenda
          worth sending. By the end you will be able to:
        </p>
        <ul className="typography-body-md text-ws-static-base pl-ws-11 gap-ws-3 flex list-disc flex-col">
          {outcomes.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      </Tabs.Content>

      <Tabs.Content value="transcript" className="pt-ws-9 max-w-[48rem]">
        <LessonTranscript lines={transcript} onSeek={onSeek} />
      </Tabs.Content>

      <Tabs.Content value="resources" className="gap-ws-7 pt-ws-12 grid sm:grid-cols-2">
        {resources.map((file) => (
          <ResourceFile key={file.id} file={file} />
        ))}
      </Tabs.Content>
    </Tabs>
  );
}
