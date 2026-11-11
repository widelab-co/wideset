import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { CallHighlights } from './call-highlights';
import { CallPlayer } from './call-player';
import { CommentField } from './comment-field';
import { CommentList } from './comment-list';
import {
  call,
  type Comment,
  comments as initialComments,
  highlights,
  maya,
  NOW,
  speakers,
  transcript,
} from './data';
import { RecordingHeader } from './recording-header';
import { Section } from './section';
import { RecordingSidebar } from './sidebar';
import { Transcript } from './transcript';
import { usePlayback } from './use-playback';
import { VoiceNoteRecorder } from './voice-note-recorder';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * Recording (Inset direction): a recorded sales call on the raised page beside the workspace
 * sidebar. The header says what the call was; the player under it shows who spoke when. Below a
 * line, the transcript follows the player, and a narrow column holds the moments Orbit marked
 * and the team's comments at a moment, with a field and a voice note to add one at the moment
 * the call is at. The page fills the card and its two columns scroll on their own, so the player
 * stays in view while the transcript moves.
 */
export default function Recording() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const playback = usePlayback(call.duration, 0);
  const [comments, setComments] = useState(initialComments);
  const at = Math.floor(playback.time);

  const addComment = (comment: Pick<Comment, 'at'> & ({ text: string } | { voiceNote: number })) =>
    setComments(
      [
        ...comments,
        { ...comment, id: `note-${comments.length}`, author: maya, postedAt: NOW.toISOString() },
      ].sort((a, b) => a.at - b.at),
    );

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <RecordingSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
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
                <a href="#deals">Deals</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item asChild>
                <a href={`#${call.deal.id}`}>{call.customer}</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>Discovery call</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page fills the card; on a short window it scrolls inside it instead. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-14 pt-ws-14 flex h-full min-h-[42rem] flex-col')}>
            <RecordingHeader />
            <CallPlayer playback={playback} speakers={speakers} lines={transcript} />

            <div className="gap-ws-16 border-ws-static-base pt-ws-12 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_20rem] border-t">
              <Transcript
                lines={transcript}
                time={playback.time}
                playing={playback.playing}
                onSeek={playback.seek}
              />

              <aside
                aria-label="About the call"
                className="gap-ws-16 -mx-ws-7 px-ws-7 pb-ws-12 flex min-h-0 flex-col overflow-y-auto"
              >
                <Section title="Highlights">
                  <CallHighlights moments={highlights} onSeek={playback.seek} />
                </Section>
                <Section title="Comments">
                  <CommentList comments={comments} onSeek={playback.seek} />
                  {/* The field and the recorder share the comments' text edge, past the avatar. */}
                  <div className="gap-ws-5 flex flex-col">
                    <CommentField at={at} onComment={(text) => addComment({ at, text })} />
                    <div className="pl-ws-14 flex flex-col">
                      <VoiceNoteRecorder
                        at={at}
                        onSave={({ at: noteAt, duration }) =>
                          addComment({ at: noteAt, voiceNote: duration })
                        }
                      />
                    </div>
                  </div>
                </Section>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
