// TODO(custom): whole-row link done with a stretched <a>; Table has no row link.
import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react';
import { Avatar, Table } from '@wideset/react';

import { maya, type Standing } from './data';
import { formatShare, formatUsd } from './format';
import { QuotaBar } from './quota-bar';

/** Where a person moved since last week: a quiet arrow and the places, or a dash. */
function RankChange({ from, to }: { from: number; to: number }) {
  const places = from - to;
  if (places === 0)
    return (
      <span className="text-ws-static-subtle">
        <span aria-hidden="true">–</span>
        <span className="sr-only">No change</span>
      </span>
    );
  const Arrow = places > 0 ? RiArrowUpLine : RiArrowDownLine;
  return (
    <span className="gap-ws-2 text-ws-static-subtle inline-flex items-center">
      <Arrow aria-hidden="true" className="size-ws-8" />
      <span className="sr-only">{places > 0 ? 'Up' : 'Down'} </span>
      {Math.abs(places)}
    </span>
  );
}

/**
 * The team ranked by what it closed this quarter, each with the share of their quota as the
 * neutral bar and how far they moved since last week. No medals and no podium: the rank is a
 * number. The signed-in person's row carries the table's selected fill, the one way it differs.
 * A row opens the person's profile.
 */
export function Leaderboard({ standings }: { standings: Standing[] }) {
  const ranked = [...standings].sort((a, b) => b.revenue - a.revenue);

  return (
    <Table size="md" interactive aria-label="Leaderboard" className="w-full">
      <Table.Head>
        <Table.Row>
          <Table.Header align="right" className="w-[3rem]">
            Rank
          </Table.Header>
          <Table.Header>Person</Table.Header>
          <Table.Header align="right" className="whitespace-nowrap">
            Closed revenue
          </Table.Header>
          <Table.Header className="w-[13rem] whitespace-nowrap">Share of quota</Table.Header>
          <Table.Header align="right" className="whitespace-nowrap">
            Since last week
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {ranked.map(({ person, revenue, quota, lastWeek }, index) => {
          const you = person.id === maya.id;
          return (
            <Table.Row key={person.id} selected={you} className="relative">
              <Table.Cell align="right" className="tabular-nums">
                {index + 1}
              </Table.Cell>
              <Table.Cell>
                <span className="gap-ws-5 flex items-center">
                  <Avatar size="sm" initials={person.initials} color={person.color} aria-hidden />
                  {/* The name's link stretches over the whole row: one target, the hover on every cell. */}
                  <a
                    href={`#members/${person.id}`}
                    className="text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 truncate after:absolute"
                  >
                    {person.name}
                    {you && <span className="sr-only"> (you)</span>}
                  </a>
                </span>
              </Table.Cell>
              <Table.Cell align="right">
                <span className="typography-number-sm text-ws-static-strong tabular-nums">
                  {formatUsd(revenue)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span className="gap-ws-7 flex items-center">
                  <QuotaBar share={revenue / quota} />
                  <span className="w-[2.5rem] shrink-0 text-right tabular-nums">
                    {formatShare(revenue / quota)}
                  </span>
                </span>
              </Table.Cell>
              <Table.Cell align="right" className="tabular-nums">
                <RankChange from={lastWeek} to={index + 1} />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
