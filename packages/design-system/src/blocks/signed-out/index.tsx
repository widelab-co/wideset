import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { SignedOutNotice } from './signed-out-notice';

/**
 * Signed out, Inset direction with no navigation: the sign-in card after signing out, with the
 * accounts still signed in on this device and the way to sign in again.
 */
export default function SignedOut() {
  return (
    <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
      <AuthCard
        other={{ href: ROUTES.signUp, label: 'Create account' }}
        className="w-full max-w-[38.75rem]"
      >
        <SignedOutNotice />
      </AuthCard>
    </main>
  );
}
