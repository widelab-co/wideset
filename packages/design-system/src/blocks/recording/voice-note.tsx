// TODO(custom): a voice note's playback row (play, how far, length); Wideset has no audio player.
import { RiPauseFill, RiPlayFill } from '@remixicon/react';
import { IconButton, ProgressBar } from '@wideset/react';

import { formatClock } from './format';
import { usePlayback } from './use-playback';

/**
 * A voice note in the comments, kept to one row: play, a 4px bar of how far it has played, and
 * its length (the time played while it plays). It has its own clock, apart from the call's.
 */
export function VoiceNote({ duration }: { duration: number }) {
  const { time, playing, toggle } = usePlayback(duration);

  return (
    <div className="gap-ws-5 flex items-center">
      <IconButton
        icon={playing ? RiPauseFill : RiPlayFill}
        variant="secondary"
        preset="border"
        size="xs"
        aria-label={playing ? 'Pause voice note' : 'Play voice note'}
        onClick={toggle}
      />
      <ProgressBar
        value={time}
        max={duration}
        aria-label="Voice note"
        getValueLabel={(value, max) => `${formatClock(value)} of ${formatClock(max)}`}
      />
      <span className="typography-label-sm text-ws-static-subtle shrink-0 tabular-nums">
        {formatClock(playing ? time : duration)}
      </span>
    </div>
  );
}
