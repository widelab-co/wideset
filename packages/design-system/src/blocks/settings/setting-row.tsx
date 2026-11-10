import type { ReactNode } from 'react';

/** A setting with an action: its name and one line on the left, the button on the right edge. */
export function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="gap-ws-9 flex items-center justify-between">
      <div className="gap-ws-3 flex min-w-0 flex-col">
        {/* Set like Switch.Label, so action rows and switch rows read the same. */}
        <p className="typography-label-sm text-ws-dynamic-secondary-default">{label}</p>
        <p className="typography-label-sm text-ws-static-subtle">{description}</p>
      </div>
      <div className="flex shrink-0">{children}</div>
    </div>
  );
}
