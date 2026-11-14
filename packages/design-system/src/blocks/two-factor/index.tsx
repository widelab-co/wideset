import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { TwoFactorForm } from './two-factor-form';

/**
 * Two-factor code, Inset direction with no navigation: the sign-in card's second step, a six-digit
 * code from an authenticator app or a backup code.
 */
export default function TwoFactor() {
  return (
    <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
      <AuthCard
        other={{ href: ROUTES.signIn, label: 'Use another account' }}
        className="w-full max-w-[38.75rem]"
      >
        <TwoFactorForm />
      </AuthCard>
    </main>
  );
}
