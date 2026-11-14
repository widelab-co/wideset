import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { SignInForm } from './sign-in-form';

/** Sign in, Inset direction with no navigation: one raised card centred on the grey page. */
export default function SignInCard() {
  return (
    <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
      <AuthCard
        other={{ href: ROUTES.signUp, label: 'Create account' }}
        className="w-full max-w-[38.75rem]"
      >
        <SignInForm />
      </AuthCard>
    </main>
  );
}
