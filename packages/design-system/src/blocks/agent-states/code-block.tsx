// TODO(custom): a block of code in an answer (the lines in monospace, Copy in its corner); Wideset has no Code component.
import { CopyButton } from './copy-button';

/**
 * Lines to copy exactly, set apart in an outlined box that follows the theme, with Copy in its
 * top right corner. Long lines scroll inside the box rather than break.
 */
export function CodeBlock({ language, lines }: { language: string; lines: string[] }) {
  return (
    <div
      role="group"
      aria-label={`${language} code`}
      className="border-ws-static-base rounded-ws-container-md relative border"
    >
      <pre className="font-ws-mono typography-body-md tracking-ws-normal text-ws-static-strong py-ws-7 pl-ws-9 pr-ws-16 overflow-x-auto whitespace-pre">
        <code>{lines.join('\n')}</code>
      </pre>
      <div className="top-ws-3 right-ws-3 absolute">
        <CopyButton label="Copy code" quiet text={() => lines.join('\n')} />
      </div>
    </div>
  );
}
