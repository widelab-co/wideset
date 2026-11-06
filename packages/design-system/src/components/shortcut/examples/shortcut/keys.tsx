/**
 * One `Shortcut.Key` per key, in the order they are pressed: modifiers first, in the order macOS
 * prints them (⌃ ⌥ ⇧ ⌘), then the key. Screen readers hear the modifier glyphs as Control, Option,
 * Shift and Command; letters, digits and named keys such as Esc are read as written.
 */
import { Shortcut } from '@wideset/react';

export default function ShortcutKeys() {
  return (
    <div className="gap-ws-8 flex flex-wrap items-center">
      <Shortcut>
        <Shortcut.Key>Esc</Shortcut.Key>
      </Shortcut>
      <Shortcut>
        <Shortcut.Key>⌘</Shortcut.Key>
        <Shortcut.Key>K</Shortcut.Key>
      </Shortcut>
      <Shortcut>
        <Shortcut.Key>⌥</Shortcut.Key>
        <Shortcut.Key>⌘</Shortcut.Key>
        <Shortcut.Key>I</Shortcut.Key>
      </Shortcut>
      <Shortcut>
        <Shortcut.Key>⌃</Shortcut.Key>
        <Shortcut.Key>⇧</Shortcut.Key>
        <Shortcut.Key>⌘</Shortcut.Key>
        <Shortcut.Key>4</Shortcut.Key>
      </Shortcut>
    </div>
  );
}
