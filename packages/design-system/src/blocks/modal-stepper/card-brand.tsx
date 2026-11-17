// TODO(custom): card brand mark in a field's suffix; Wideset has no payment-brand entity (Figma's Text Input "Entity" suffix holds a Payment image) and blocks ship no logo artwork.
import { RiVisaLine } from '@remixicon/react';

/**
 * The card's brand in the card number field's suffix: Figma's 24px Payment entity, drawn as the
 * Remix mark on the inverse tile instead of logo artwork. Static here: a payment provider's field
 * reports the brand as the number is typed, so swap the mark on that.
 */
export function CardBrand() {
  return (
    <span
      role="img"
      aria-label="Visa"
      className="bg-ws-static-inverse-background text-ws-static-inverse-strong rounded-ws-control-sm size-ws-12 flex shrink-0 items-center justify-center"
    >
      <RiVisaLine aria-hidden="true" className="size-ws-10" />
    </span>
  );
}
