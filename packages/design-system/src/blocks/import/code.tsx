// TODO(custom): code in text, inline; Wideset has no Code component and no monospace font token (Tailwind's font-mono stands in).
import type { ReactNode } from 'react';

/** A name to type exactly as written (a column, a field), in the monospace face of its line. */
export function Code({ children }: { children: ReactNode }) {
  return <code className="text-ws-static-strong font-mono">{children}</code>;
}
