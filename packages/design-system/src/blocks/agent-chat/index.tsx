import { RiFileTextLine, RiRestartLine } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useId, useState } from 'react';

import {
  account,
  codeGroups,
  context,
  efforts,
  fallback,
  files,
  models,
  permissions,
  product,
  workspace,
} from './canon';
import { ChatTools } from './chat-tools';
import { CodeTools } from './code-tools';
import { chatGroups, launchDocument, OPEN_CHAT } from './data';
import { DocumentPane } from './document-pane';
import { Home } from './home';
import type { TranscriptView } from './model';
import { ModelMenu } from './model-menu';
import { PaneCard } from './pane-card';
import { Session } from './session';
import { AgentSidebar } from './sidebar';
import { ThreadMenu } from './thread-menu';
import { TopBar } from './top-bar';
import { useShell } from './use-shell';

/**
 * Agent chat (Inset direction): Tandem in Chat mode. The sidebar on the grey frame holds the
 * mode switch and the chats in their projects. One raised card holds the rest: the open chat with
 * its transcript and composer, and, behind a vertical line in the same card, the document Tandem
 * wrote. Each half has its own 48px bar, so their lines meet, and each scrolls inside itself.
 * `screen="home"` opens on a new chat instead. The Chat | Code switch works: Code lists the
 * sessions by repository and starts on its own new-session screen.
 *
 * The block opens at rest. Replay in the top bar plays the newest turn again from the start;
 * Stop (or Esc) cuts it where it is, with Continue to go on, and a message sent meanwhile waits
 * in the queue over the composer.
 */
export default function AgentChat({ screen = 'chat' }: { screen?: 'chat' | 'home' }) {
  const sidebarId = useId();
  const paneId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<TranscriptView>('normal');
  /** The document version open in the pane, counted from 0; null while the pane is closed. */
  const [paneVersion, setPaneVersion] = useState<number | null>(screen === 'chat' ? 1 : null);

  const shell = useShell({
    chat: chatGroups,
    code: codeGroups,
    mode: 'chat',
    openId: screen === 'chat' ? OPEN_CHAT : null,
    reply: fallback,
    files,
  });
  const { mode, thread, session } = shell;

  /* The document belongs to the launch chat. A version is there once its step has run. */
  const versions = launchDocument.versions.filter(({ step }) => {
    const status = session.steps.find((item) => item.id === step)?.status;
    return !step || status === 'running' || status === 'done';
  });
  const writing = session.steps.find((item) => item.id === versions.at(-1)?.step);
  const progress = writing?.status === 'running' ? writing.progress : undefined;
  /** While a version is being written the pane shows that one. */
  const paneShown =
    thread?.id !== OPEN_CHAT || paneVersion === null
      ? null
      : progress !== undefined
        ? versions.length - 1
        : Math.min(paneVersion, versions.length - 1);

  /** What a turn made: the document, as the version that turn wrote. */
  const card = (name: string) => {
    const index = launchDocument.versions.findIndex((version) => version.card === name);
    return (
      <PaneCard
        icon={RiFileTextLine}
        title={launchDocument.title}
        caption={`Document · Version ${index + 1}`}
        open={paneShown === index}
        paneId={paneId}
        onToggle={() => setPaneVersion(paneShown === index ? null : index)}
      />
    );
  };

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <AgentSidebar
        id={sidebarId}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        product={product}
        workspace={workspace}
        account={account}
        {...shell.sidebar}
      />

      <div className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 overflow-hidden">
        <main className="flex min-w-0 flex-1 flex-col">
          <TopBar
            sidebarId={sidebarId}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            crumbs={shell.crumbs}
          >
            {thread && (
              <>
                <Button variant="secondary" preset="ghost" size="sm" onClick={session.replay}>
                  <Button.Icon icon={RiRestartLine} />
                  Replay
                </Button>
                <Button variant="secondary" preset="border" size="sm">
                  Share
                </Button>
                <ThreadMenu view={view} onViewChange={setView} />
              </>
            )}
          </TopBar>

          {thread ? (
            <Session
              session={session}
              threadId={thread.id}
              agent={product}
              view={view}
              card={card}
              tools={
                mode === 'chat' ? (
                  <ChatTools onAttach={shell.attach} />
                ) : (
                  <CodeTools permissions={permissions} context={context} onAttach={shell.attach} />
                )
              }
              model={<ModelMenu models={models} efforts={efforts} />}
            />
          ) : (
            <Home key={mode} mode={mode} onSend={shell.begin} />
          )}
        </main>

        {paneShown !== null && (
          <DocumentPane
            id={paneId}
            title={launchDocument.title}
            versions={versions.map((version) => version.prose)}
            version={paneShown}
            onVersionChange={setPaneVersion}
            progress={progress}
            onClose={() => setPaneVersion(null)}
          />
        )}
      </div>
    </div>
  );
}
