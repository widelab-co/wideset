import { ToastProvider } from '@wideset/react';
import { useState } from 'react';

import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { LinkSent } from './link-sent';
import { ResetForm } from './reset-form';

/**
 * Forgot password, Inset direction with no navigation: the sign-in card asking for an e-mail, then
 * saying the reset link is on its way.
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <ToastProvider position="bottom-center">
      <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
        <AuthCard
          other={{ href: ROUTES.signUp, label: 'Create account' }}
          className="w-full max-w-[38.75rem]"
        >
          {sent ? (
            <LinkSent email={email.trim()} onChangeEmail={() => setSent(false)} />
          ) : (
            <ResetForm email={email} onEmailChange={setEmail} onSent={() => setSent(true)} />
          )}
        </AuthCard>
      </main>
    </ToastProvider>
  );
}
