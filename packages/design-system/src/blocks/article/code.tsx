// TODO(custom): code in long text, inline and as a block; Wideset has no Code component.
import type { ReactNode } from 'react';

/** A name to type exactly as written (a column, a field), in the monospace face of its line. */
export function Code({ children }: { children: ReactNode }) {
  return <code className="text-ws-static-strong font-ws-mono">{children}</code>;
}

/**
 * Lines to copy exactly, set apart in an outlined box (inside the white card a box is drawn, not
 * filled). Long lines scroll inside it rather than break.
 */
export function CodeBlock({ lines }: { lines: string[] }) {
  return (
    <pre className="border-ws-static-base rounded-ws-container-md px-ws-9 py-ws-7 typography-body-md text-ws-static-strong font-ws-mono overflow-x-auto border">
      <code>{lines.join('\n')}</code>
    </pre>
  );
}
