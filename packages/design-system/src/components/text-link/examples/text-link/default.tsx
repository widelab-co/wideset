/** The playground's stage: the sign-in help line, its first link's props set from the rail. */
import { TextLink, type TextLinkProps } from '@wideset/react';

export default function TextLinkDefault(props: Partial<TextLinkProps>) {
  return (
    <p className="typography-body-md text-ws-static-subtle w-[24rem] max-w-full">
      Trouble with signing in? Request a magic{' '}
      <TextLink href="#magic-link" {...props}>
        sign-in link
      </TextLink>{' '}
      or <TextLink href="#reset-password">reset your password</TextLink>.
    </p>
  );
}
