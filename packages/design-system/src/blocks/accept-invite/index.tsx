import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { InviteForm } from './invite-form';

/**
 * Accept an invitation, Inset direction with no navigation: the sign-up card, opened from an
 * invitation, with the inviter, the workspace and the role above the form.
 */
export default function AcceptInvite() {
  return (
    <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
      <AuthCard
        other={{ href: ROUTES.signIn, label: 'Sign in' }}
        className="w-full max-w-[38.75rem]"
      >
        <InviteForm />
      </AuthCard>
    </main>
  );
}
