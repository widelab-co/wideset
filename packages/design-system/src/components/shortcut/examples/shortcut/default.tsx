/** The playground's stage: the shortcut that opens search, its props set from the rail. */
import { Shortcut, type ShortcutProps } from '@wideset/react';

export default function ShortcutDefault(props: ShortcutProps) {
  return (
    <Shortcut {...props}>
      <Shortcut.Key>⌘</Shortcut.Key>
      <Shortcut.Key>K</Shortcut.Key>
    </Shortcut>
  );
}
