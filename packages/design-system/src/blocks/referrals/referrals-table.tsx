import { StatusBadge, Table } from '@wideset/react';

import { type Referral, type ReferralStatus, rewardOf } from './data';
import { formatDate, formatUsd } from './format';

/**
 * Invited and Signed up are steps on the way, so they stay neutral. Subscribed is the outcome
 * the programme pays for, the one row state that moved money: it alone takes the positive
 * colour, so the rows that earned credit can be found without reading.
 */
const STATUS: Record<ReferralStatus, { label: string; color: 'neutral' | 'positive' }> = {
  invited: { label: 'Invited', color: 'neutral' },
  'signed-up': { label: 'Signed up', color: 'neutral' },
  subscribed: { label: 'Subscribed', color: 'positive' },
};

/**
 * Who was invited, newest first: the address, the day, how far they got and what it earned. The
 * reward is an amount, so it is right-aligned in tabular figures; a referral that has earned
 * nothing yet shows a dash, not $0.00.
 */
export function ReferralsTable({ referrals }: { referrals: Referral[] }) {
  return (
    <Table className="table-fixed">
      <Table.Head>
        <Table.Row>
          {/* Half, then a quarter: the columns stand under the figures above the table. */}
          <Table.Header flushMargin className="w-[50%]">
            E-mail
          </Table.Header>
          <Table.Header className="w-[25%]">Sent</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header align="right" flushMargin className="w-[6rem]">
            Reward
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {referrals.map((referral) => {
          const status = STATUS[referral.status];
          const reward = rewardOf(referral);
          return (
            <Table.Row key={referral.email}>
              <Table.Cell flushMargin truncate className="text-ws-static-strong">
                {referral.email}
              </Table.Cell>
              <Table.Cell className="tabular-nums">{formatDate(referral.invited)}</Table.Cell>
              <Table.Cell>
                <StatusBadge color={status.color}>{status.label}</StatusBadge>
              </Table.Cell>
              <Table.Cell align="right" flushMargin className="tabular-nums">
                {reward ? (
                  formatUsd(reward)
                ) : (
                  <span className="text-ws-static-subtle">
                    <span aria-hidden="true">–</span>
                    <span className="sr-only">Nothing yet</span>
                  </span>
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
