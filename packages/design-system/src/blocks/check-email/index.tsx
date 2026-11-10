import { ToastProvider } from '@wideset/react';

import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { LinkSent } from './link-sent';

/**
 * Check your e-mail, Inset direction with no navigation: the sign-in card after a magic sign-in
 * link was sent.
 */
export default function CheckEmail() {
  return (
    <ToastProvider position="bottom-center">
      <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
        <AuthCard
          other={{ href: ROUTES.signUp, label: 'Create account' }}
          className="w-full max-w-[38.75rem]"
        >
          <LinkSent />
        </AuthCard>
      </main>
    </ToastProvider>
  );
}
