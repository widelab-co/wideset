// TODO(custom): key-value pair (label above value); no DescriptionList in Wideset.
import type { ReactNode } from 'react';

/** A fact: its label above its value. Render inside a `dl`. */
export function KeyValue({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="gap-ws-3 flex min-w-0 flex-col">
      <dt className="typography-label-sm text-ws-static-subtle">{label}</dt>
      <dd className="typography-body-md text-ws-static-base tabular-nums">{children}</dd>
    </div>
  );
}
