import { RiSideBarLine } from '@remixicon/react';
import {
  AppShell,
  Breadcrumbs,
  Card,
  cn,
  IconButton,
  ToastProvider,
  useToast,
} from '@wideset/react';
import { useId, useState } from 'react';

import { AchievementList } from './achievement-list';
import { ActivityTimeline } from './activity-timeline';
import { achievements, activity, followingAtStart, openDeals, profile } from './data';
import { DealsTable } from './deals-table';
import { FactsList } from './facts-list';
import { ProfileFacts } from './profile-facts';
import { ProfileHeader } from './profile-header';
import { Section } from './section';
import { ProfileSidebar } from './sidebar';
import { TextLink } from './text-link';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

const firstName = profile.name.split(' ')[0];

const CONTACT = [
  {
    label: 'E-mail',
    value: <TextLink href={`mailto:${profile.email}`}>{profile.email}</TextLink>,
  },
  {
    label: 'Phone',
    value: (
      <TextLink href={`tel:${profile.phone.replace(/\s/g, '')}`} className="tabular-nums">
        {profile.phone}
      </TextLink>
    ),
  },
  {
    label: 'Calendar',
    value: <TextLink href={`#meet/${profile.id}`}>Book a meeting</TextLink>,
  },
];

/** The page: who the person is, then their work beside the facts about them. */
function ProfilePage() {
  const sidebarId = useId();
  const dealsId = useId();
  const activityId = useId();
  const { showToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [following, setFollowing] = useState(followingAtStart);
  const [muted, setMuted] = useState(false);

  const toggle = (id: string) =>
    setFollowing((all) => (all.includes(id) ? all.filter((item) => item !== id) : [...all, id]));

  const copyLink = () => {
    const { origin, pathname, search } = window.location;
    void navigator.clipboard?.writeText(`${origin}${pathname}${search}`).catch(() => {});
    showToast({ content: 'Link copied' });
  };

  return (
    <AppShell direction="inset">
      <ProfileSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <AppShell.Main>
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSideBarLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item asChild>
                <a href="#members">Members</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{profile.name}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-14 pt-ws-14 pb-ws-16 flex flex-col')}>
            <div className="gap-ws-11 flex flex-col">
              <ProfileHeader
                followed={following.includes(profile.id)}
                muted={muted}
                onFollowedChange={() => toggle(profile.id)}
                onMutedChange={(value) => {
                  setMuted(value);
                  showToast({
                    content: value
                      ? `${firstName} is muted. His posts stay out of your feed.`
                      : `${firstName} is unmuted.`,
                  });
                }}
                onMessage={() => showToast({ content: `New message to ${firstName} in Chat` })}
                onCopyLink={copyLink}
                onReport={() =>
                  showToast({ content: 'Reported. A workspace admin will look at it.' })
                }
              />
              <ProfileFacts following={following} onToggle={toggle} />
            </div>

            <div className="gap-ws-16 border-ws-static-subtle pt-ws-14 grid grid-cols-1 items-start border-t lg:grid-cols-[minmax(0,1fr)_18rem]">
              {/* His work, the part of the page to act on, sits in cards. */}
              <div className="gap-ws-12 flex min-w-0 flex-col">
                <Card role="region" aria-labelledby={dealsId}>
                  <Card.Header>
                    <h2 id={dealsId} className="typography-label-strong-md text-ws-static-strong">
                      Open deals
                    </h2>
                  </Card.Header>
                  {/* Straight in the card, not in Card.Content, whose scrollbar gutter would stop
                      the table's lines short. */}
                  <DealsTable deals={openDeals} />
                </Card>
                <Card role="region" aria-labelledby={activityId}>
                  <Card.Header>
                    <h2
                      id={activityId}
                      className="typography-label-strong-md text-ws-static-strong"
                    >
                      Recent activity
                    </h2>
                  </Card.Header>
                  {/* Card.Content keeps 10px free on the right for a scrollbar: the padding gives
                      it back. */}
                  <Card.Content contentClassName="pr-ws-6">
                    <ActivityTimeline items={activity} />
                  </Card.Content>
                </Card>
              </div>

              {/* What there is to know about him stays on the white, without a box; its first title
                  stands on the line of the first card's title. */}
              <aside
                aria-label={`About ${firstName}`}
                className="gap-ws-16 lg:pt-ws-9 flex flex-col"
              >
                <Section title="About">
                  <div className="gap-ws-5 typography-body-md text-ws-static-base flex flex-col">
                    {profile.about.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </Section>
                <Section title="Contact">
                  <FactsList facts={CONTACT} />
                </Section>
                <Section title="Achievements this year">
                  <AchievementList items={achievements} />
                </Section>
              </aside>
            </div>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

/**
 * Profile (Inset direction): a teammate as others see them, on the raised page beside the
 * workspace sidebar. A work profile, not a social page: no cover, no banner, no badges. The header
 * says who they are and where, with Follow as the one filled button until it is pressed; a line of
 * plain figures under it opens their followers and whom they follow. Below, their open deals and
 * recent activity in cards, the work to act on, beside what to know about them, how to reach them
 * and what they reached, quieter on the white.
 */
export default function Profile() {
  return (
    <ToastProvider position="bottom-center">
      <ProfilePage />
    </ToastProvider>
  );
}
