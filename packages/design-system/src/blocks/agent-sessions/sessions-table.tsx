// TODO(custom): rows grouped under a repository inside one table, and a child row indented under its parent; Table has no group row and no nesting.
import {
  RiCornerDownRightLine,
  RiGitBranchLine,
  RiGitRepositoryLine,
  RiLoader4Line,
} from '@remixicon/react';
import { Card, Checkbox, cn, StatusBadge, Table } from '@wideset/react';

import { ChecksMark } from './checks-mark';
import { type CodeSession, NOW, type Repository, STATES } from './data';
import { EmptyState } from './empty-state';
import { Inline } from './inline';
import { SessionRequest } from './session-request';
import { formatAgo, formatDateTime, formatRunTime } from './sessions-format';

const COLUMN_COUNT = 7;

/**
 * In a card, the table runs edge to edge: the outer cells are inset like a card's title, and the
 * last row leaves its line to the card's border.
 */
const IN_CARD =
  '[&_tr>*:first-child]:pl-ws-11 [&_tr>*:last-child]:pr-ws-11 [&_tbody:last-child>tr:last-child>*]:border-b-0';

type SessionsTableProps = {
  /** The repositories with the sessions the filter and the search left. */
  repositories: Repository[];
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  /** Answers what a session waits for: "allowed", "denied", or the option picked. */
  onAnswer: (id: string, answer: string) => void;
  onClearFilters: () => void;
};

/**
 * Every session as one list to work through, in a card: the columns named once, then a band per
 * repository and its sessions under it. A row says what the session is, how it stands (the colour
 * of the state's meaning), where it works, its pull request with the checks summed in one mark,
 * and when it last did something and for how long it has run. A session that needs you is a
 * taller row: what it asks, and the answer, sit under its last step. A subagent is indented under
 * its parent. A click anywhere on a row selects it; the checkbox is the same control for the
 * keyboard, and the session's name opens it.
 */
export function SessionsTable({
  repositories,
  selected,
  onSelectedChange,
  onAnswer,
  onClearFilters,
}: SessionsTableProps) {
  const ids = repositories.flatMap((repository) => repository.sessions.map(({ id }) => id));
  const picked = ids.filter((id) => selected.includes(id)).length;
  const toggle = (id: string) =>
    onSelectedChange(
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );

  return (
    <Card role="region" aria-label="Sessions">
      <Table
        size="md"
        placement="top"
        selectionMode={ids.length > 0 ? 'multiple' : undefined}
        className={cn('table-fixed', IN_CARD)}
      >
        <Table.Head>
          <Table.Row>
            <Table.Header className="w-[3.25rem]">
              <Checkbox
                aria-label="Select all sessions"
                disabled={ids.length === 0}
                checked={picked === 0 ? false : picked === ids.length ? true : 'indeterminate'}
                onCheckedChange={(checked) => onSelectedChange(checked === true ? ids : [])}
              />
            </Table.Header>
            <Table.Header>Session</Table.Header>
            <Table.Header className="w-[7rem]">State</Table.Header>
            <Table.Header className="w-[16rem]">Branch</Table.Header>
            <Table.Header className="w-[8.5rem]">Pull request</Table.Header>
            <Table.Header className="w-[8.5rem]">Last active</Table.Header>
            <Table.Header align="right" className="w-[6rem]">
              Run time
            </Table.Header>
          </Table.Row>
        </Table.Head>

        {ids.length === 0 && (
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={COLUMN_COUNT}>
                <EmptyState onClearFilters={onClearFilters} />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}

        {repositories.map((repository) => (
          <Table.Body key={repository.id}>
            {/* A plain row, so the band neither hovers nor selects like a session. */}
            <tr>
              <th
                colSpan={COLUMN_COUNT}
                scope="rowgroup"
                className="bg-ws-static-alpha-subtle border-ws-static-base px-ws-9 py-ws-5 border-b text-left"
              >
                <span className="gap-ws-3 typography-label-strong-sm text-ws-static-strong flex items-center">
                  <RiGitRepositoryLine
                    aria-hidden="true"
                    className="size-ws-9 text-ws-static-subtle shrink-0"
                  />
                  {repository.name}
                </span>
              </th>
            </tr>
            {repository.sessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                selected={selected.includes(session.id)}
                onToggle={() => toggle(session.id)}
                onAnswer={(answer) => onAnswer(session.id, answer)}
              />
            ))}
          </Table.Body>
        ))}
      </Table>
    </Card>
  );
}

type SessionRowProps = {
  session: CodeSession;
  selected: boolean;
  onToggle: () => void;
  onAnswer: (answer: string) => void;
};

function SessionRow({ session, selected, onToggle, onAnswer }: SessionRowProps) {
  const state = STATES[session.state];
  const { pullRequest } = session;

  return (
    <Table.Row selected={selected} onClick={onToggle}>
      <Table.Cell>
        {/* As tall as the name's line, so the box sits on it in a row of any height. */}
        <span className="h-ws-11 flex items-center">
          <Checkbox checked={selected} aria-label={`Select ${session.title}`} />
        </span>
      </Table.Cell>
      <Table.Cell>
        <div className={cn('gap-ws-3 flex items-start', session.child && 'pl-ws-5')}>
          {session.child && (
            <RiCornerDownRightLine
              role="img"
              aria-label="Subagent"
              className="size-ws-9 text-ws-static-subtle mt-ws-1 shrink-0"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <a
              href={`#${session.id}`}
              id={`session-${session.id}`}
              onClick={(event) => event.stopPropagation()}
              className="typography-label-strong-sm text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default w-fit max-w-full truncate hover:underline"
            >
              {session.title}
            </a>
            <Table.CellDescription className="text-pretty">
              <Inline text={session.last} />
            </Table.CellDescription>
            {session.request && (
              <SessionRequest
                session={session.title}
                request={session.request}
                onAnswer={onAnswer}
              />
            )}
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>
        <StatusBadge size="sm" color={state.color}>
          {session.state === 'working' && (
            <StatusBadge.Icon icon={RiLoader4Line} className="motion-safe:animate-spin" />
          )}
          <StatusBadge.Label>{state.label}</StatusBadge.Label>
        </StatusBadge>
      </Table.Cell>
      <Table.Cell>
        {/* A branch name is code: it breaks anywhere rather than lose its end to an ellipsis. */}
        <span className="gap-ws-3 flex min-w-0 items-start">
          <RiGitBranchLine
            aria-hidden="true"
            className="size-ws-9 text-ws-static-subtle mt-ws-1 shrink-0"
          />
          <span className="font-ws-mono typography-body-sm tracking-ws-normal wrap-anywhere">
            {session.branch}
          </span>
        </span>
      </Table.Cell>
      <Table.Cell>
        {pullRequest ? (
          <span className="gap-ws-3 flex items-center">
            <ChecksMark checks={pullRequest.checks} />
            <span className="text-ws-static-strong tabular-nums">#{pullRequest.number}</span>
            <span className="text-ws-static-subtle">{pullRequest.state}</span>
          </span>
        ) : (
          <span className="text-ws-static-subtle">
            <span aria-hidden="true">—</span>
            <span className="sr-only">No pull request</span>
          </span>
        )}
      </Table.Cell>
      <Table.Cell>
        <time
          dateTime={session.lastAt}
          title={formatDateTime(session.lastAt)}
          className="text-ws-static-subtle whitespace-nowrap"
        >
          {formatAgo(session.lastAt, NOW)}
        </time>
      </Table.Cell>
      <Table.Cell align="right">
        <span className="tabular-nums">{formatRunTime(session.minutes)}</span>
      </Table.Cell>
    </Table.Row>
  );
}
