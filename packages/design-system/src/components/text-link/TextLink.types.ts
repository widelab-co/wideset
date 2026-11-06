import type { AnchorHTMLAttributes, ReactNode } from 'react';

/** A link inside running text. */
export type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Renders the link styling onto its only child, such as your router's link, via Radix Slot. */
  asChild?: boolean;
  /** Link text, read as part of the sentence around it. */
  children?: ReactNode;
  /** Additional CSS classes merged with the link. */
  className?: string;
  /** Destination URL of the native anchor. */
  href?: string;
};
