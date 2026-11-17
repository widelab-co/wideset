import { RiBankCardLine, RiMastercardLine } from '@remixicon/react';
import { Tile } from '@wideset/react';

import type { CardErrors, CardValues } from './card';
import { CardFields } from './card-fields';
import { savedCard } from './data';
import { formatExpiry } from './format';

export type Method = 'saved' | 'new';

type PaymentMethodProps = {
  /** Prefix of the card fields' ids. */
  id: string;
  method: Method;
  onMethodChange: (method: Method) => void;
  card: CardValues;
  cardErrors: CardErrors;
  onCardChange: (card: CardValues) => void;
};

/**
 * How the order is paid: the card on file, chosen to start with, or another one. Picking the
 * other opens its fields under the choice, in place, so the order stays in view.
 */
export function PaymentMethod({
  id,
  method,
  onMethodChange,
  card,
  cardErrors,
  onCardChange,
}: PaymentMethodProps) {
  return (
    <div className="gap-ws-9 flex flex-col">
      <Tile.RadioGroup
        aria-label="Payment method"
        orientation="horizontal"
        value={method}
        onValueChange={(value) => onMethodChange(value as Method)}
      >
        <Tile.Radio
          value="saved"
          icon={RiMastercardLine}
          title={`${savedCard.brand} ending ${savedCard.last4}`}
          description={`Expires ${formatExpiry(savedCard.expires)}`}
        />
        <Tile.Radio
          value="new"
          icon={RiBankCardLine}
          title="Use another card"
          description="Visa, Mastercard or American Express"
        />
      </Tile.RadioGroup>
      {method === 'new' && (
        <CardFields id={id} values={card} errors={cardErrors} onChange={onCardChange} />
      )}
    </div>
  );
}
