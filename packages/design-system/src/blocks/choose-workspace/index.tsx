import { ToastProvider } from '@wideset/react';

import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { WorkspacePicker } from './workspace-picker';

/**
 * Choose a workspace, Inset direction with no navigation: the sign-in card after signing in to an
 * account in several workspaces, with the invitations waiting and creating a new one.
 */
export default function ChooseWorkspace() {
  return (
    <ToastProvider position="bottom-center">
      <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
        <AuthCard
          other={{ href: ROUTES.signIn, label: 'Use another account' }}
          className="w-full max-w-[38.75rem]"
        >
          <WorkspacePicker />
        </AuthCard>
      </main>
    </ToastProvider>
  );
}
