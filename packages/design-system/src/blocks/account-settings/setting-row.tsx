// TODO(custom): setting row (name and description beside an action); no component in Wideset.
import type { RemixiconComponentType } from '@remixicon/react';
import type { ReactNode } from 'react';

/**
 * A setting with an action: its name and one line on the left, the button on the right edge.
 * A row that stands for a thing (a linked account, a device) leads with its icon.
 */
export function SettingRow({
  label,
  description,
  icon: Icon,
  children,
}: {
  label: ReactNode;
  description: ReactNode;
  icon?: RemixiconComponentType;
  children?: ReactNode;
}) {
  return (
    <div className="gap-ws-9 flex items-center justify-between">
      <div className="gap-ws-7 flex min-w-0 items-center">
        {Icon && <Icon aria-hidden="true" className="size-ws-9 text-ws-static-base shrink-0" />}
        <div className="gap-ws-3 flex min-w-0 flex-col">
          {/* Set like Switch.Label, so action rows and switch rows read the same. */}
          <p className="typography-label-sm text-ws-dynamic-secondary-default">{label}</p>
          <p className="typography-label-sm text-ws-static-subtle">{description}</p>
        </div>
      </div>
      {children && <div className="gap-ws-5 flex shrink-0">{children}</div>}
    </div>
  );
}
