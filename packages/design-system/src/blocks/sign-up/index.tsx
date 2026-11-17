import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { SignUpForm } from './sign-up-form';

/** Sign up, Inset direction with no navigation: the sign-in card, creating an account instead. */
export default function SignUp() {
  return (
    <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
      <AuthCard
        other={{ href: ROUTES.signIn, label: 'Sign in' }}
        className="w-full max-w-[38.75rem]"
      >
        <SignUpForm />
      </AuthCard>
    </main>
  );
}
