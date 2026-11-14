import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { SsoForm } from './sso-form';

/**
 * Single sign-on, Inset direction with no navigation: the sign-in card with Google, Microsoft and a
 * work e-mail for SAML.
 */
export default function SsoSignIn() {
  return (
    <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
      <AuthCard
        other={{ href: ROUTES.signUp, label: 'Create account' }}
        className="w-full max-w-[38.75rem]"
      >
        <SsoForm />
      </AuthCard>
    </main>
  );
}
