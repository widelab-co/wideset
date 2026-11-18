import { ToastProvider } from '@wideset/react';
import { useState } from 'react';

import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { EmailVerified } from './email-verified';
import { VerifyForm } from './verify-form';

/**
 * Verify e-mail, Inset direction with no navigation: the sign-in card after sign-up, asking for
 * the six-digit code sent to the new address, then saying it is verified.
 */
export default function VerifyEmail() {
  const [verified, setVerified] = useState(false);

  return (
    <ToastProvider position="bottom-center">
      <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
        <AuthCard
          other={{ href: ROUTES.signIn, label: 'Sign in' }}
          className="w-full max-w-[38.75rem]"
        >
          {verified ? <EmailVerified /> : <VerifyForm onVerified={() => setVerified(true)} />}
        </AuthCard>
      </main>
    </ToastProvider>
  );
}
