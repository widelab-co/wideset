import { AppShell, Toast, ToastProvider, useToast } from '@wideset/react';
import { useState } from 'react';

import { ChatList } from './chat-list';
import { ContactPanel } from './contact-panel';
import { Conversation } from './conversation';
import { conversation } from './data';
import { CommunicationSidebar } from './sidebar';

/** The page: three panels split by lines, the contact panel closable. */
function Panels() {
  const { showToast, dismissToast } = useToast();
  const [details, setDetails] = useState(true);
  const [note, setNote] = useState('');

  const archive = () => {
    const id = showToast({
      status: 'info',
      content: `${conversation.title} archived`,
      action: (
        <Toast.Action preset="ghost" onClick={() => dismissToast(id)}>
          Undo
        </Toast.Action>
      ),
    });
  };

  return (
    <main className="flex min-w-0 flex-1">
      <ChatList />
      <Conversation
        onArchive={archive}
        onShowDetails={details ? undefined : () => setDetails(true)}
      />
      {details && (
        <ContactPanel
          onClose={() => setDetails(false)}
          onArchive={archive}
          note={note}
          onNoteChange={setNote}
        />
      )}
    </main>
  );
}

/** Communication (Frame direction): chats, the open conversation and the contact's details. */
export default function Communication() {
  return (
    <ToastProvider position="bottom-center">
      <AppShell direction="frame">
        <CommunicationSidebar />
        <Panels />
      </AppShell>
    </ToastProvider>
  );
}
