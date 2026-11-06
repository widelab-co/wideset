/**
 * Strong, the default, draws the keys in a bordered cap so they read apart from the label at the
 * end of a menu or sidebar row. Weak shows the bare keys at the height of a line of body text, for
 * a shortcut inside a sentence. Use one emphasis per list.
 */
import { Shortcut } from '@wideset/react';

export default function ShortcutEmphasis() {
  return (
    <div className="gap-ws-8 flex flex-col items-start">
      <Shortcut emphasis="strong">
        <Shortcut.Key>⌘</Shortcut.Key>
        <Shortcut.Key>K</Shortcut.Key>
      </Shortcut>
      <p className="typography-body-md text-ws-static-subtle">
        Press{' '}
        <Shortcut emphasis="weak">
          <Shortcut.Key>⌘</Shortcut.Key>
          <Shortcut.Key>K</Shortcut.Key>
        </Shortcut>{' '}
        to search invoices.
      </p>
    </div>
  );
}
