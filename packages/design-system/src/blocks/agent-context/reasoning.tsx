// TODO(custom): the agent's reasoning as one line (a shimmering "Thinking" with the seconds, then "Thought for 12s") that opens to its text; Wideset has no reasoning or disclosure-line part.
import { RiBrainLine } from '@remixicon/react';
import { cn } from '@wideset/react';
import { useEffect, useState } from 'react';

import { Fold } from './fold';
import { formatDuration } from './format';
import type { Block } from './model';
import { ARRIVE } from './motion';
import { Row } from './row';
import { Shimmer } from './shimmer';

type ReasoningProps = {
  block: Extract<Block, { kind: 'reasoning' }>;
  /** The Thinking and Verbose views: the text starts open and stays open. */
  defaultOpen: boolean;
  live: boolean;
};

/**
 * What the agent thought before it acted. While it thinks: "Thinking" with a light passing over
 * it and the seconds counting; a click opens the text as it is written, quiet, behind a line on
 * its left. Once done it folds itself to "Thought for 12s", which opens again on a click.
 */
export function Reasoning({ block, defaultOpen, live }: ReasoningProps) {
  const [open, setOpen] = useState(defaultOpen);
  const running = Boolean(block.running);

  // Done thinking: the text folds away by itself, unless the view keeps reasoning open.
  useEffect(() => {
    if (!running && !defaultOpen) setOpen(false);
  }, [running, defaultOpen]);

  return (
    <div className={cn(live && ARRIVE)}>
      <Row
        mark={<RiBrainLine aria-hidden className="size-ws-9 text-ws-static-subtle shrink-0" />}
        open={open}
        onToggle={() => setOpen(!open)}
      >
        {running ? (
          <span className="gap-ws-3 flex items-baseline">
            <Shimmer>Thinking</Shimmer>
            <span className="text-ws-static-subtle tabular-nums">
              {formatDuration(block.seconds)}
            </span>
          </span>
        ) : (
          <span className="text-ws-static-subtle tabular-nums">
            Thought for {formatDuration(block.seconds)}
          </span>
        )}
      </Row>
      <Fold open={open}>
        <p className="typography-body-md text-ws-static-subtle border-ws-static-base ml-ws-7 my-ws-3 border-l pl-[0.9375rem] whitespace-pre-line">
          {block.text}
        </p>
      </Fold>
    </div>
  );
}
