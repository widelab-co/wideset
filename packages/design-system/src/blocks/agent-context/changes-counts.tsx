// TODO(custom): lines added and removed as a pair of figures (+18 −4); Wideset has no diff stat.

type ChangeCountsProps = { added: number; removed: number };

/**
 * How much a change adds and removes, in the colours of their meanings: added is positive,
 * removed negative. Nothing removed shows no figure, as a new file has no old side. Read aloud as
 * a sentence rather than as "plus" and "minus".
 */
export function ChangeCounts({ added, removed }: ChangeCountsProps) {
  return (
    <span className="typography-label-sm gap-ws-3 flex shrink-0 tabular-nums">
      <span className="sr-only">
        {removed > 0 ? `${added} lines added, ${removed} removed` : `${added} lines added`}
      </span>
      <span aria-hidden="true" className="text-ws-semantic-positive">
        +{added}
      </span>
      {removed > 0 && (
        <span aria-hidden="true" className="text-ws-semantic-negative">
          −{removed}
        </span>
      )}
    </span>
  );
}
