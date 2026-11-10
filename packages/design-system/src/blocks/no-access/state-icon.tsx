// TODO(custom): icon on a quiet tile, the mark of a state page; Wideset has no icon tile (ActionTile's entity is brand purple).
import type { RemixiconComponentType } from '@remixicon/react';

/** The icon that names a whole-page state (no access, request sent) at a glance. Decorative. */
export function StateIcon({ icon: Icon }: { icon: RemixiconComponentType }) {
  return (
    <span className="border-ws-static-base rounded-ws-container-md size-ws-18 flex shrink-0 items-center justify-center border">
      <Icon aria-hidden="true" className="size-ws-12 text-ws-static-strong" />
    </span>
  );
}
