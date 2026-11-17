import {
  RiCollapseVerticalLine,
  RiExpandVerticalLine,
  RiGitPullRequestLine,
  RiSearchLine,
} from '@remixicon/react';
import { Button, IconButton, TextInput, Tooltip } from '@wideset/react';

import { ChangeCounts } from './changes-counts';
import { PULL_REQUEST } from './checks-data';

type ChangesToolbarProps = {
  /** How many files the session changed, and how many of them the filter shows. */
  total: number;
  shown: number;
  added: number;
  removed: number;
  query: string;
  onQueryChange: (query: string) => void;
  /** Whether any file shown is open: then the one button folds them all, else it opens them. */
  anyOpen: boolean;
  onToggleAll: () => void;
};

/**
 * The pane's bar: what the session changed in all (files, lines added and removed), then a
 * filter by path, one button that folds every file or opens them again, and the way to the pull
 * request. The filter is a field, not a menu: five paths or five hundred, typing a part of one
 * is the quickest way to it. The pull request is a link, drawn as a quiet button to sit level
 * with the icon beside it.
 */
export function ChangesToolbar({
  total,
  shown,
  added,
  removed,
  query,
  onQueryChange,
  anyOpen,
  onToggleAll,
}: ChangesToolbarProps) {
  const toggleLabel = anyOpen ? 'Fold all files' : 'Expand all files';

  return (
    <div className="h-ws-16 border-ws-static-subtle px-ws-11 gap-ws-7 flex shrink-0 items-center border-b">
      <p className="typography-label-sm text-ws-static-base gap-ws-5 flex shrink-0 items-center">
        <span aria-live="polite" className="tabular-nums">
          {shown === total ? `${total} files` : `${shown} of ${total} files`}
        </span>
        <ChangeCounts added={added} removed={removed} />
      </p>

      <div className="gap-ws-3 ml-auto flex min-w-0 flex-1 items-center justify-end">
        <TextInput
          size="sm"
          className="mr-ws-3 max-w-[14rem] min-w-0 flex-1"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        >
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input type="search" placeholder="Filter files" aria-label="Filter files" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton aria-label="Clear filter" />
          </TextInput.Suffix>
        </TextInput>

        <Tooltip size="sm">
          <Tooltip.Trigger asChild>
            <IconButton
              icon={anyOpen ? RiCollapseVerticalLine : RiExpandVerticalLine}
              aria-label={toggleLabel}
              size="xs"
              variant="secondary"
              preset="ghost"
              onClick={onToggleAll}
            />
          </Tooltip.Trigger>
          <Tooltip.Content side="bottom">
            <Tooltip.Label>{toggleLabel}</Tooltip.Label>
          </Tooltip.Content>
        </Tooltip>

        <Button asChild variant="secondary" preset="ghost" size="xs">
          <a
            href={PULL_REQUEST.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open pull request #${PULL_REQUEST.number}`}
          >
            <Button.Icon icon={RiGitPullRequestLine} />
            {/* Under asChild the label's inset is ours to give, as Button gives its own. */}
            <span className="px-ws-2 tabular-nums">#{PULL_REQUEST.number}</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
