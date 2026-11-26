/** Off by default, since a link button stands on its own. Turn the underline on where colour alone does not tell it apart from the text near it. A link inside a sentence is a TextLink, which keeps the sentence's size and weight. */
import { LinkButton } from '@wideset/react';

export default function LinkButtonUnderlined() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-center">
      <LinkButton href="#invoices">View invoice</LinkButton>
      <LinkButton href="#invoices" underlined>
        View invoice
      </LinkButton>
    </div>
  );
}
