// TODO(custom): a step to the neighbouring record (xs icon button with its words beside it); no such control in Wideset.
import type { RemixiconComponentType } from '@remixicon/react';
import { cn, IconButton } from '@wideset/react';
import { useId } from 'react';

type RecordStepProps = {
  label: string;
  icon: RemixiconComponentType;
  /** Puts the words first, for the step on the right. */
  iconLast?: boolean;
  /** Left out when there is no record on that side: the step is disabled. */
  onClick?: () => void;
};

/**
 * Figma's footer step: an icon button and the words that say where it goes. The words are the
 * button's `label`, so a click on them steps too and the pair is one target.
 */
export function RecordStep({ label, icon, iconLast, onClick }: RecordStepProps) {
  const id = useId();

  return (
    <span className={cn('gap-ws-5 flex items-center', iconLast && 'flex-row-reverse')}>
      <IconButton
        id={id}
        variant="secondary"
        preset="border"
        size="xs"
        icon={icon}
        aria-label={label}
        disabled={!onClick}
        onClick={onClick}
      />
      <label htmlFor={id} aria-hidden="true" className="typography-body-md text-ws-static-subtle">
        {label}
      </label>
    </span>
  );
}
