// TODO(custom): neutral 4px bar of a share, on a track; ProgressBar is brand-coloured and has no neutral variant.
import { cn } from '@wideset/react';

/**
 * A share of quota as a neutral 4px bar, on a track that ends at the quota, so 100%
 * is the right edge and a person past it reads as a full bar. Neutral, so on a page of brand
 * goal bars the leaderboard does not compete; the percentage beside it says the number.
 */
export function QuotaBar({ share, className }: { share: number; className?: string }) {
  return (
    <svg aria-hidden="true" className={cn('h-ws-3 w-full', className)}>
      <rect
        width="100%"
        height="100%"
        rx="2"
        className="fill-(--ws-dynamic-stroke-secondary-default)"
      />
      <rect
        width={`${Math.min(share, 1) * 100}%`}
        height="100%"
        rx="2"
        className="fill-(--ws-semantic-stroke-neutral)"
      />
    </svg>
  );
}
