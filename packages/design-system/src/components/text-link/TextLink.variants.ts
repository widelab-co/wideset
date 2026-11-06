import { cn } from 'src/lib/utils';

/**
 * Figma draws an inline link as the paragraph's own text style in Dynamic/Text/Primary with an
 * underline, so there is no typography class: size, weight and line height come from the text
 * around the link. Hover and press follow LinkButton's primary states.
 */
export const textLinkClassName = cn(
  'text-ws-dynamic-primary-default underline',
  'hover:text-ws-dynamic-primary-hover active:text-ws-dynamic-primary-pressed',
  'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default rounded-ws-control-sm',
);
