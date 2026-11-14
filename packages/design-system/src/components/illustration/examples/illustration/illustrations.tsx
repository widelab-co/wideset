/**
 * Three drawings, each for one kind of moment: a calendar for nothing scheduled yet, a folder for
 * nothing stored yet, a computer for something new to try. Pick the one that names what is
 * missing; when none does, leave the drawing out.
 */
import { Illustration } from '@wideset/react';

export default function IllustrationIllustrations() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-center justify-center">
      <Illustration illustration="calendar" size="sm" />
      <Illustration illustration="folder" size="sm" />
      <Illustration illustration="computer" size="sm" />
    </div>
  );
}
