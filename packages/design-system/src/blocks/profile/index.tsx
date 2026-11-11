import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton, ToastProvider, useToast } from '@wideset/react';
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
    <div className="bg-ws-static-background flex h-dvh">
      <ProfileSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
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
              <div className="gap-ws-16 flex min-w-0 flex-col">
                <Section title="Open deals">
                  <DealsTable deals={openDeals} />
                </Section>
                <Section title="Recent activity">
                  <ActivityTimeline items={activity} />
                </Section>
              </div>

              <aside aria-label={`About ${firstName}`} className="gap-ws-16 flex flex-col">
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
      </main>
    </div>
  );
}

/**
 * Profile (Inset direction): a teammate as others see them, on the raised page beside the
 * workspace sidebar. A work profile, not a social page: no cover, no banner, no badges. The header
 * says who they are and where, with Follow as the one filled button until it is pressed; a line of
 * plain figures under it opens their followers and whom they follow. Below, their open deals and
 * recent activity beside what to know about them, how to reach them and what they reached.
 */
export default function Profile() {
  return (
    <ToastProvider position="bottom-center">
      <ProfilePage />
    </ToastProvider>
  );
}
