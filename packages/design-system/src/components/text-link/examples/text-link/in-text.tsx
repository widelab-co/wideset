/**
 * TextLink has no type of its own: it takes the size, weight and line height of the text around
 * it and adds only the primary colour and an underline, so the same link sits in a body paragraph
 * and in small print. The underline stays in every state, since colour alone does not tell a link
 * from the words around it. Hover and press darken the colour; keyboard focus draws the ring.
 */
import { TextLink } from '@wideset/react';

export default function TextLinkInText() {
  return (
    <div className="gap-ws-8 flex w-[24rem] max-w-full flex-col">
      <p className="typography-body-md text-ws-static-subtle">
        Trouble with signing in? Request a magic{' '}
        <TextLink href="#magic-link">sign-in link</TextLink> or{' '}
        <TextLink href="#reset-password">reset your password</TextLink>.
      </p>
      <p className="typography-body-sm text-ws-static-subtle">
        By creating an account you agree to the <TextLink href="#terms">Terms of service</TextLink>{' '}
        and the <TextLink href="#privacy">Privacy policy</TextLink>.
      </p>
    </div>
  );
}
