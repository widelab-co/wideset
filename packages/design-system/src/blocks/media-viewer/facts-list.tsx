// TODO(custom): facts read back as rows (label left, value right, groups under a line, a strong total); no DescriptionList in Wideset.
import { cn } from '@wideset/react';

export type Fact = {
  label: string;
  value: string;
  /** The figure the reader is after: the total. */
  strong?: boolean;
};

/**
 * Facts as rows, the label on the left and its value on the right edge, so amounts stand in one
 * column. Each group after the first opens under a line. The line is the group's own border: a
 * `dl` holds only its rows.
 */
export function FactsList({ groups }: { groups: Fact[][] }) {
  return (
    <div className="gap-ws-9 flex flex-col">
      {groups.map((facts, index) => (
        <dl
          key={facts[0].label}
          className={cn(
            'gap-ws-7 flex flex-col',
            index > 0 && 'border-ws-static-base pt-ws-9 border-t',
          )}
        >
          {facts.map(({ label, value, strong }) => (
            <div key={label} className="gap-ws-9 flex items-baseline justify-between">
              <dt
                className={
                  strong
                    ? 'typography-label-strong-md text-ws-static-strong'
                    : 'typography-body-md text-ws-static-subtle'
                }
              >
                {label}
              </dt>
              <dd
                className={cn(
                  'text-right tabular-nums',
                  strong
                    ? 'typography-label-strong-md text-ws-static-strong'
                    : 'typography-body-md text-ws-static-base',
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      ))}
    </div>
  );
}
