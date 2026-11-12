// TODO(custom): a line of figures, two of which open a list; Wideset has no stat or inline figure button.
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import { me, openDeals, profile } from './data';
import { formatOrdinal, formatShare } from './format';
import { PeoplePopup } from './people-popup';

/** A figure and what it counts, the figure in the strong colour: `7 followers`. */
function Figure({ value, label }: { value: string | number; label: string }) {
  return (
    <>
      <span className="text-ws-static-strong font-ws-medium tabular-nums">{value}</span> {label}
    </>
  );
}

/** A figure that opens the people it counts: plain text until hovered, then underlined. */
const FigureButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  (props, ref) => (
    <button
      ref={ref}
      type="button"
      className="rounded-ws-control-sm focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default cursor-pointer decoration-from-font hover:underline"
      {...props}
    />
  ),
);
FigureButton.displayName = 'FigureButton';

type ProfileFactsProps = {
  /** Ids of the people the signed-in user follows; Jonas's followers include them once they do. */
  following: string[];
  onToggle: (id: string) => void;
};

/**
 * The person in a line of plain figures under the header: who follows them and whom they follow
 * (the figures are the content, and each opens the list it counts), then their work this
 * quarter: open deals, quota attainment and where that puts them on the leaderboard.
 */
export function ProfileFacts({ following, onToggle }: ProfileFactsProps) {
  const followers = following.includes(profile.id) ? [me, ...profile.followers] : profile.followers;

  return (
    <p className="gap-x-ws-12 gap-y-ws-3 typography-body-md text-ws-static-subtle flex flex-wrap items-center">
      <PeoplePopup title="Followers" people={followers} following={following} onToggle={onToggle}>
        <FigureButton>
          <Figure
            value={followers.length}
            label={followers.length === 1 ? 'follower' : 'followers'}
          />
        </FigureButton>
      </PeoplePopup>
      <PeoplePopup
        title="Following"
        people={profile.following}
        following={following}
        onToggle={onToggle}
      >
        <FigureButton>
          <Figure value={profile.following.length} label="following" />
        </FigureButton>
      </PeoplePopup>
      <span>
        <Figure value={openDeals.length} label="open deals" />
      </span>
      <span>
        <Figure value={formatShare(profile.closed / profile.quota)} label="of quota this quarter" />
      </span>
      <span>
        <Figure
          value={formatOrdinal(profile.leaderboard.rank)}
          label={`of ${profile.leaderboard.of} on the team leaderboard`}
        />
      </span>
    </p>
  );
}
