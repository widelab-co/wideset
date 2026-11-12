// TODO(custom): a pull request's heading (title and number, state, the branches it joins); Wideset has no heading for a record with its state and facts.
import { RiArrowRightLine, RiExternalLinkLine, RiGitBranchLine } from '@remixicon/react';
import { IconButton, StatusBadge, Tooltip } from '@wideset/react';

import { PULL_REQUEST } from './checks-data';

/**
 * What the pane is about: the pull request's title with its number after it, then its state and
 * the branch it brings into which. Draft is a state with nothing to signal, so its badge stays
 * neutral. Branch names are code, so they are set in monospace and break anywhere rather than
 * push the pane wider. The way out to the git host is a quiet icon at the title's end.
 */
export function PullRequestHeader() {
  const { number, title, state, head, base, href } = PULL_REQUEST;

  return (
    <header className="gap-ws-5 flex flex-col">
      <div className="gap-ws-7 flex items-start">
        <h2 className="typography-subtitle-xs text-ws-static-strong min-w-0 flex-1 text-pretty">
          {title} <span className="text-ws-static-subtle tabular-nums">#{number}</span>
        </h2>
        <Tooltip size="sm">
          <Tooltip.Trigger asChild>
            <IconButton
              asChild
              icon={RiExternalLinkLine}
              variant="secondary"
              preset="ghost"
              size="xs"
            >
              {/* eslint-disable-next-line jsx-a11y/anchor-has-content -- IconButton slots its icon into the anchor, which is named by its label */}
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open pull request #${number} on the git host`}
              />
            </IconButton>
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">
            <Tooltip.Label>Open on the git host</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>
      </div>

      <div className="gap-x-ws-7 gap-y-ws-3 flex flex-wrap items-center">
        <StatusBadge>{state}</StatusBadge>
        <p className="font-ws-mono typography-body-sm tracking-ws-normal text-ws-static-base gap-ws-3 flex min-w-0 flex-wrap items-center">
          <RiGitBranchLine
            aria-hidden="true"
            className="size-ws-9 text-ws-static-subtle shrink-0"
          />
          <span className="wrap-anywhere">{head}</span>
          <RiArrowRightLine
            role="img"
            aria-label="into"
            className="size-ws-8 text-ws-static-subtle shrink-0"
          />
          <span>{base}</span>
        </p>
      </div>
    </header>
  );
}
