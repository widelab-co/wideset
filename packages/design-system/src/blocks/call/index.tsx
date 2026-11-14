import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, IconButton } from '@wideset/react';
import { useEffect, useId, useState } from 'react';

import { CallHeader } from './call-header';
import { type CallPhase, CallStage } from './call-stage';
import { ControlBar, type PanelTab } from './control-bar';
import { call, chat, notes as initialNotes, NOW, participants, turns } from './data';
import { SidePanel } from './side-panel';
import { CallSidebar } from './sidebar';

/** How long the call takes to connect when the page opens, in milliseconds. */
const CONNECTING = 1000;
/** How long each turn to speak lasts, in seconds of the call's clock. */
const TURN = 3;

/** Whose turn it is at this second of the call; a muted person is passed over to the next. */
function speakerAt(elapsed: number, mutedIds: string[]) {
  const start = Math.floor(elapsed / TURN);
  for (let step = 0; step < turns.length; step += 1) {
    const id = turns[(start + step) % turns.length];
    if (!mutedIds.includes(id)) return id;
  }
  return undefined;
}

/**
 * Call (Inset direction): Maya's renewal call with Halcyon Freight on the raised page beside the
 * workspace sidebar. The header names the call and its deal; the dark stage under it, the
 * heaviest thing on the page, holds the four people (and a shared screen when there is one); the
 * control bar sits under the stage. Beside it a 22rem panel holds the notes, the call's chat and
 * the people. The page opens on a second of "Connecting…"; then the clock runs and the speaker's
 * outline moves from tile to tile.
 */
export default function Call() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [phase, setPhase] = useState<CallPhase>('connecting');
  const [elapsed, setElapsed] = useState(call.elapsed);
  const [people, setPeople] = useState(participants);
  const [cameraOff, setCameraOff] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [panel, setPanel] = useState<PanelTab | null>('notes');
  const [notes, setNotes] = useState([...initialNotes, '']);
  const [messages, setMessages] = useState(chat);

  useEffect(() => {
    if (phase !== 'connecting') return;
    const id = window.setTimeout(() => setPhase('live'), CONNECTING);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'live') return;
    const id = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const me = people.find((person) => person.you)!;
  const mute = (ids: string[], muted = true) =>
    setPeople((current) =>
      current.map((person) => (ids.includes(person.id) ? { ...person, muted } : person)),
    );

  const leave = () => {
    setPhase('left');
    setRecording(false);
    setSharing(false);
  };

  return (
    <AppShell direction="inset">
      <CallSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
                <a href="#deals">Deals</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item asChild>
                <a href={`#${call.deal.id}`}>{call.customer}</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{call.title}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The call fills the card under the bar; the panel runs beside it, full height. */}
        <div className="flex min-h-0 flex-1">
          <div className="gap-ws-9 px-ws-12 pt-ws-12 pb-ws-9 flex min-w-0 flex-1 flex-col">
            <CallHeader
              elapsed={phase === 'live' ? elapsed : undefined}
              recording={recording}
              count={people.length}
            />
            <CallStage
              phase={phase}
              people={people}
              speakerId={speakerAt(
                elapsed,
                people.filter((person) => person.muted).map((person) => person.id),
              )}
              sharing={sharing}
              onRejoin={() => setPhase('connecting')}
            />
            {phase !== 'left' && (
              <ControlBar
                muted={me.muted}
                cameraOff={cameraOff}
                sharing={sharing}
                recording={recording}
                panel={panel}
                onMutedChange={(muted) => mute([me.id], muted)}
                onCameraOffChange={setCameraOff}
                onSharingChange={setSharing}
                onRecordingChange={setRecording}
                onPanelChange={setPanel}
                onLeave={leave}
              />
            )}
          </div>

          {panel && (
            <SidePanel
              tab={panel}
              onTabChange={setPanel}
              notes={notes}
              onNotesChange={setNotes}
              messages={messages}
              onSend={(text) =>
                setMessages((current) => [
                  ...current,
                  { id: `sent-${current.length}`, authorId: 'maya', at: NOW, text },
                ])
              }
              people={people}
              onMute={(id) => mute([id])}
              onMuteAll={() => mute(people.filter((person) => !person.you).map(({ id }) => id))}
            />
          )}
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
