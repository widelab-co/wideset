import {
  RiArrowDownSLine,
  RiArrowUpDownLine,
  RiArrowUpSLine,
  RiBtcFill,
  RiEthFill,
  RiInformationLine,
  RiXrpFill,
} from '@remixicon/react';
import {
  Button,
  Checkbox,
  cn,
  Divider,
  DropdownMenu,
  IconButton,
  ListItem,
  Tooltip,
} from '@wideset/react';
import { useId, useState } from 'react';

import { type Coin, COINS, PRICES, QUOTE } from './data';
import { formatRate, formatUsd, formatValue } from './format';

const MODES = ['Swap', 'Send', 'Buy'] as const;

/** The swap form, straight on the grey canvas: its fields take the highlight fill. */
export function SwapForm({ className }: { className?: string }) {
  const [mode, setMode] = useState<(typeof MODES)[number]>('Swap');
  const [sell, setSell] = useState<Side>(QUOTE.sell);
  const [buy, setBuy] = useState<Side>(QUOTE.buy);
  const [agreed, setAgreed] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const advancedId = useId();

  return (
    <div className={cn('pt-ws-12 flex flex-col', className)}>
      <div role="group" aria-label="Transaction type" className="gap-ws-9 flex">
        {MODES.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={mode === item}
            onClick={() => setMode(item)}
            className={cn(
              'typography-subtitle-sm rounded-ws-control-sm focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default cursor-pointer',
              mode === item
                ? 'text-ws-static-strong'
                : 'text-ws-static-subtle hover:text-ws-static-base',
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-ws-12 gap-ws-5 relative flex flex-col">
        <AmountField label="Sell" side={sell} onChange={setSell} />
        <AmountField label="Buy" side={buy} onChange={setBuy} />
        <div className="bg-ws-static-foreground shadow-ws-low rounded-ws-control-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Round in every state: the button takes the circle's radius, so its hover, press
              and focus ring follow the round chip instead of drawing a square inside it. */}
          <IconButton
            variant="secondary"
            preset="ghost"
            icon={RiArrowUpDownLine}
            aria-label="Switch currencies"
            className="rounded-ws-control-full"
            onClick={() => {
              setSell(buy);
              setBuy(sell);
            }}
          />
        </div>
      </div>

      <div className="mt-ws-9 gap-ws-2 flex items-center justify-center">
        <Tooltip>
          <Tooltip.Trigger asChild>
            <IconButton
              variant="secondary"
              preset="ghost"
              size="xs"
              icon={RiInformationLine}
              aria-label="About the rate"
            />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Label>Mid-market rate, refreshed every 30 seconds</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>
        <p className="typography-body-sm text-ws-static-subtle">
          1 {sell.coin} = {formatRate(PRICES[sell.coin] / PRICES[buy.coin])} {buy.coin}
        </p>
      </div>

      <Divider weight="thin" emphasis="subtle" className="mt-ws-14" />

      <section aria-labelledby="swap-summary" className="mt-ws-14">
        <h2 id="swap-summary" className="typography-subtitle-xs text-ws-static-base">
          Summary
        </h2>
        <Rows rows={QUOTE.summary} className="mt-ws-12" />
      </section>

      <div className="mt-ws-23 gap-ws-7 flex flex-col">
        <Checkbox checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)}>
          <Checkbox.Label>
            I agree to <span className="font-ws-medium">terms & conditions</span> of the platform
            services
          </Checkbox.Label>
          <Checkbox.Description>Swaps can’t be reversed once confirmed.</Checkbox.Description>
        </Checkbox>
        <div className="gap-ws-5 flex flex-col">
          <Button variant="secondary" size="lg" className="w-full" disabled={!agreed}>
            {mode}
          </Button>
          <Button
            variant="secondary"
            preset="ghost"
            size="lg"
            className="w-full"
            aria-expanded={advanced}
            aria-controls={advancedId}
            onClick={() => setAdvanced((open) => !open)}
          >
            Advanced info
            <Button.Icon icon={advanced ? RiArrowUpSLine : RiArrowDownSLine} />
          </Button>
        </div>
        <Rows id={advancedId} rows={QUOTE.advanced} hidden={!advanced} />
      </div>
    </div>
  );
}

type Side = { coin: Coin; amount: string };

/** A sell or buy amount: the label, a large amount input, its USD value and the coin picker. */
function AmountField({
  label,
  side,
  onChange,
}: {
  label: string;
  side: Side;
  onChange: (side: Side) => void;
}) {
  const id = useId();
  const usd = (Number.parseFloat(side.amount) || 0) * PRICES[side.coin];

  return (
    <div className="bg-ws-static-highlight-base rounded-ws-control-lg shadow-ws-forms-base focus-within:shadow-ws-forms-active py-ws-9 pr-ws-7 pl-ws-9 flex items-start">
      <label
        htmlFor={id}
        className="typography-label-sm text-ws-static-subtle w-[3.75rem] shrink-0"
      >
        {label}
      </label>
      <div className="gap-ws-7 flex min-w-0 flex-1 flex-col">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={side.amount}
          onChange={(event) => onChange({ ...side, amount: event.target.value })}
          className="typography-title-sm text-ws-static-strong w-full bg-transparent tabular-nums outline-none"
        />
        <span className="typography-number-xs text-ws-static-subtle">{formatUsd(usd)}</span>
      </div>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            aria-label={`${label} currency: ${side.coin}`}
            className="bg-ws-static-alpha-base hover:bg-ws-dynamic-secondary-hover rounded-ws-control-full gap-ws-4 py-ws-3 pr-ws-5 pl-ws-3 text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex shrink-0 cursor-pointer items-center"
          >
            <CoinMark coin={side.coin} />
            <RiArrowDownSLine aria-hidden className="size-ws-7" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {COINS.map(({ coin, name }) => (
            <DropdownMenu.Item key={coin} onSelect={() => onChange({ ...side, coin })}>
              <ListItem.Prefix>
                <CoinMark coin={coin} />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>{name}</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}

const MARK: Record<Coin, { icon: typeof RiBtcFill; className: string }> = {
  BTC: {
    icon: RiBtcFill,
    className: 'bg-ws-non-semantic-orange-strong text-ws-non-semantic-orange-on-strong',
  },
  ETH: { icon: RiEthFill, className: 'bg-ws-static-highlight-base text-ws-static-strong' },
  XRP: {
    icon: RiXrpFill,
    className: 'bg-ws-static-inverse-background text-ws-static-inverse-strong',
  },
};

/** A coin's mark: its Remix glyph on a round chip. */
function CoinMark({ coin }: { coin: Coin }) {
  const { icon: Icon, className } = MARK[coin];
  return (
    <span
      className={cn(
        'size-ws-11 rounded-ws-control-full flex shrink-0 items-center justify-center',
        className,
      )}
    >
      <Icon aria-hidden className="size-ws-9" />
    </span>
  );
}

/** Label and value rows of a quote. */
function Rows({
  rows,
  className,
  ...props
}: {
  rows: readonly { label: string; value: number; unit: string }[];
  className?: string;
  id?: string;
  hidden?: boolean;
}) {
  return (
    <dl className={cn('gap-ws-7 flex flex-col', className)} {...props}>
      {rows.map((row) => (
        <div key={row.label} className="gap-ws-9 flex justify-between">
          <dt className="typography-body-md text-ws-static-base">{row.label}</dt>
          <dd className="typography-number-sm text-ws-static-base tabular-nums">
            {formatValue(row.value, row.unit)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
