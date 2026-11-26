import type { ComponentProps } from 'react';

import { IconAction } from './icon-action';

/**
 * A quiet icon action in a pane's bar (the terminal's, the preview's, the console's): the kit's
 * icon action at the bar's 24px, named by a tooltip under it.
 */
export function BarAction(props: ComponentProps<typeof IconAction>) {
  return <IconAction size="xs" side="bottom" {...props} />;
}
