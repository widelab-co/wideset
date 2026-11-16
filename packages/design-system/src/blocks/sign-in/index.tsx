import { AuthCard } from './auth-card';
import { ROUTES } from './data';
import { ProductPreview } from './product-preview';
import { SignInForm } from './sign-in-form';

/**
 * Sign in, Inset direction with no navigation: two raised cards on the grey page, the form beside
 * the product, as tall as each other. Under 1280px the product goes and the form stays, centred.
 */
export default function SignIn() {
  return (
    <main className="bg-ws-static-background p-ws-12 flex min-h-dvh items-center justify-center">
      <div className="gap-ws-9 flex w-full max-w-[78.5rem] justify-center">
        <AuthCard
          other={{ href: ROUTES.signUp, label: 'Create account' }}
          className="w-full max-w-[38.75rem]"
        >
          <SignInForm />
        </AuthCard>
        <ProductPreview className="hidden w-full max-w-[38.75rem] xl:block" />
      </div>
    </main>
  );
}
