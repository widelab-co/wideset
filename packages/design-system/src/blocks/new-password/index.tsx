import { ToastProvider } from '@wideset/react';
import { useState } from 'react';

import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { LinkExpired } from './link-expired';
import { LinkSent } from './link-sent';
import { NewPasswordForm } from './new-password-form';
import { PasswordChanged } from './password-changed';

type Step = 'form' | 'saved' | 'expired' | 'sent';

/**
 * New password, Inset direction with no navigation: the sign-in card opened from a reset link,
 * choosing the new password, then saying it changed. A link that ran out shows why and sends a
 * new one instead.
 */
export default function NewPassword() {
  const [step, setStep] = useState<Step>('form');

  return (
    <ToastProvider position="bottom-center">
      <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
        <AuthCard
          other={{ href: ROUTES.signIn, label: 'Sign in' }}
          className="w-full max-w-[38.75rem]"
        >
          {step === 'form' && (
            <NewPasswordForm
              onSaved={() => setStep('saved')}
              onExpired={() => setStep('expired')}
            />
          )}
          {step === 'saved' && <PasswordChanged />}
          {step === 'expired' && <LinkExpired onSent={() => setStep('sent')} />}
          {step === 'sent' && <LinkSent />}
        </AuthCard>
      </main>
    </ToastProvider>
  );
}
