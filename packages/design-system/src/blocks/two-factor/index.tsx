import { useState } from 'react';

import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { SignedIn } from './signed-in';
import { TwoFactorForm } from './two-factor-form';

/**
 * Two-factor code, Inset direction with no navigation: the sign-in card's second step, a six-digit
 * code from an authenticator app or a backup code, then saying the person is signed in.
 */
export default function TwoFactor() {
  // Once the code is accepted: whether the device is remembered.
  const [trusted, setTrusted] = useState<boolean>();

  return (
    <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
      <AuthCard
        other={{ href: ROUTES.signIn, label: 'Use another account' }}
        className="w-full max-w-[38.75rem]"
      >
        {trusted === undefined ? (
          <TwoFactorForm onVerified={setTrusted} />
        ) : (
          <SignedIn trusted={trusted} />
        )}
      </AuthCard>
    </main>
  );
}
