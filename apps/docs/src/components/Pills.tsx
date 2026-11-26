import { cn } from '@wideset/react';

const PILL =
  'h-ws-12 rounded-ws-control-md px-ws-5 typography-caption-md outline-ws-dynamic-primary-strong-default transition-colors focus-visible:wds-focus-visible';
const ARROWS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * A row of small pills that picks one value, in a card's header. A radio group: one tab stop
 * (the chosen pill), the arrow keys choose the next or the previous one.
 */
export const Pills = ({
  label,
  options,
  value,
  onChange,
  mono = false,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
}) => (
  // ds-exempt: small pills in a code block's header; SegmentedControl's items are a 14px
  // control, too loud for this row, and a second row of Tabs would compete with the page's.
  <div role="radiogroup" aria-label={label} className="flex shrink-0 gap-ws-2">
    {options.map((item, index) => (
      <button
        key={item.value}
        type="button"
        role="radio"
        aria-checked={value === item.value}
        tabIndex={value === item.value ? 0 : -1}
        onClick={() => onChange(item.value)}
        onKeyDown={(event) => {
          const step = ARROWS[event.key];
          if (!step) return;
          event.preventDefault();
          const group = event.currentTarget.closest('[role="radiogroup"]');
          onChange(options[(index + step + options.length) % options.length].value);
          // The chosen pill takes the focus once drawn, in this group; Install draws its row
          // anew for Manual, so then the group is found again by its label.
          requestAnimationFrame(() => {
            const scope = group?.isConnected
              ? group
              : document.querySelector(`[role="radiogroup"][aria-label="${label}"]`);
            scope?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
          });
        }}
        className={cn(
          PILL,
          mono && 'font-mono',
          value === item.value
            ? 'bg-ws-static-alpha-base text-ws-static-strong'
            : 'text-ws-static-subtle hover:text-ws-static-strong',
        )}
      >
        {item.label}
      </button>
    ))}
  </div>
);
