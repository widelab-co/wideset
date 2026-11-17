// TODO(custom): a template as a card that opens as a whole, with a save toggle on it; Card has no interactive state and ActionTile is a one-row tile with no room for a preview or a second control.
import { RiBookmarkFill, RiBookmarkLine } from '@remixicon/react';
import { IconButton, StatusBadge } from '@wideset/react';

import { makerName, type Template } from './data';
import { formatTeams } from './format';
import { TemplatePreview } from './template-preview';

type TemplateCardProps = {
  template: Template;
  saved: boolean;
  /** Already in the workspace. */
  added: boolean;
  onOpen: () => void;
  onSaveChange: (saved: boolean) => void;
};

/**
 * One template in the library: its drawn shape, its name and one line, who made it and how many
 * teams use it, in plain text. The name is the button that opens the detail, stretched over the
 * card so the whole card answers; on hover the card lifts a little. The bookmark sits above that
 * layer and saves without opening. A template already in the workspace carries a neutral Added.
 */
export function TemplateCard({ template, saved, added, onOpen, onSaveChange }: TemplateCardProps) {
  return (
    <article className="rounded-ws-container-md border-ws-static-base hover:border-ws-static-strong hover:shadow-ws-low relative flex w-full flex-col overflow-hidden border transition-shadow">
      <TemplatePreview kind={template.kind} className="border-ws-static-subtle border-b" />
      {added && (
        <StatusBadge size="sm" className="top-ws-5 left-ws-5 absolute">
          Added
        </StatusBadge>
      )}
      <div className="gap-ws-5 p-ws-7 flex flex-1 items-start">
        <div className="gap-ws-2 flex min-w-0 flex-1 flex-col">
          <h3 className="typography-label-strong-md text-ws-static-strong">
            <button
              type="button"
              onClick={onOpen}
              className="focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 cursor-pointer text-left after:absolute"
            >
              {template.name}
            </button>
          </h3>
          <p className="typography-body-md text-ws-static-base line-clamp-2">{template.summary}</p>
          <p className="typography-caption-md text-ws-static-subtle mt-ws-3">
            By {makerName(template.by)} · {formatTeams(template.teams)}
          </p>
        </div>
        <IconButton
          icon={saved ? RiBookmarkFill : RiBookmarkLine}
          size="xs"
          variant="secondary"
          preset="ghost"
          aria-label={`Save ${template.name}`}
          aria-pressed={saved}
          onClick={() => onSaveChange(!saved)}
          className="z-ws-base relative shrink-0"
        />
      </div>
    </article>
  );
}
