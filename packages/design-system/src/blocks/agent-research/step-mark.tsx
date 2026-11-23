// TODO(custom): how a step went, as a 16px mark (running, done, failed, waiting, skipped); Wideset has no spinner and StatusBadge is a labelled badge.
import {
  type RemixiconComponentType,
  RiCheckLine,
  RiCloseCircleLine,
  RiLoader4Line,
  RiSubtractLine,
  RiTimeLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';

import type { StepStatus } from './model';
import { SWAP } from './motion';

const MARK: Record<StepStatus, { icon: RemixiconComponentType; name: string; className: string }> =
  {
    running: {
      icon: RiLoader4Line,
      name: 'Running',
      className: 'text-ws-static-subtle motion-safe:animate-spin',
    },
    done: { icon: RiCheckLine, name: 'Done', className: 'text-ws-static-subtle' },
    failed: { icon: RiCloseCircleLine, name: 'Failed', className: 'text-ws-semantic-negative' },
    waiting: { icon: RiTimeLine, name: 'Waiting for you', className: 'text-ws-semantic-notice' },
    skipped: { icon: RiSubtractLine, name: 'Skipped', className: 'text-ws-static-subtle' },
  };

/**
 * The mark a step row starts with. Done is a quiet grey check: colour is kept for what needs a
 * look (failed, waiting for you). In a running turn the mark that follows the spinner grows in.
 */
export function StepMark({ status, live = false }: { status: StepStatus; live?: boolean }) {
  const { icon: Icon, name, className } = MARK[status];
  return (
    <>
      <Icon
        aria-hidden
        className={cn('size-ws-9 shrink-0', className, live && status !== 'running' && SWAP)}
      />
      <span className="sr-only">{name}:</span>
    </>
  );
}
