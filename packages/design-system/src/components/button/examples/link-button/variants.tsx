/**
 * A link button navigates; it renders an `<a>`, so it opens in a new tab and shows its address
 * like any link. Primary is the main route out of a view, secondary a supporting one. Danger
 * leads somewhere risky, such as account deletion; success to the next step after a win. Inverse
 * is for dark or coloured surfaces.
 */
import { LinkButton } from '@wideset/react';

export default function LinkButtonVariants() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-center">
      <LinkButton variant="primary" href="#invoices">
        View invoices
      </LinkButton>
      <LinkButton variant="secondary" href="#settings">
        Billing settings
      </LinkButton>
      <LinkButton variant="danger" href="#delete-account">
        Delete account
      </LinkButton>
      <LinkButton variant="success" href="#next-steps">
        See next steps
      </LinkButton>
      <div className="bg-ws-static-inverse-background rounded-ws-container-md p-ws-8">
        <LinkButton variant="inverse" href="#pricing">
          Compare plans
        </LinkButton>
      </div>
    </div>
  );
}
