import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightUpLine,
  RiBookmarkFill,
  RiBookmarkLine,
  RiCheckLine,
  RiCloseLine,
  RiStackLine,
} from '@remixicon/react';
import {
  Avatar,
  AvatarGroup,
  Button,
  DropdownMenu,
  IconButton,
  LinkButton,
  ListItem,
  Sidepanel,
} from '@wideset/react';
import { useId } from 'react';

import {
  type Collection,
  KIND_HOME,
  KIND_LABEL,
  makerName,
  PEOPLE,
  type Template,
  workspace,
} from './data';
import { formatList, formatTeams } from './format';
import { TemplatePreview } from './template-preview';

type TemplatePanelProps = {
  template: Template;
  saved: boolean;
  added: boolean;
  /** Collections the signed-in person can change (their own). */
  collections: Collection[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveChange: (saved: boolean) => void;
  onAdd: () => void;
  onToggleCollection: (collection: Collection) => void;
  onNewCollection: () => void;
};

/**
 * One template beside the library: a larger drawing of it, what it does, what adding it brings
 * and who already uses it, then Add to workspace, the panel's one filled button. Once added, the
 * button says Added and a link opens the template where it now lives. Saving and adding to a
 * collection sit at the other end of the footer, the same toggle as on the card.
 */
export function TemplatePanel({
  template,
  saved,
  added,
  collections,
  open,
  onOpenChange,
  onSaveChange,
  onAdd,
  onToggleCollection,
  onNewCollection,
}: TemplatePanelProps) {
  const insideId = useId();
  const usersId = useId();
  const teammates = template.usedBy.map((id) => PEOPLE[id]);
  const home = KIND_HOME[template.kind];

  return (
    <Sidepanel open={open} onOpenChange={onOpenChange}>
      <Sidepanel.Panel size="sm">
        <Sidepanel.Actions>
          <Sidepanel.Close asChild>
            <IconButton
              variant="secondary"
              preset="border"
              size="sm"
              icon={RiCloseLine}
              aria-label="Close"
            />
          </Sidepanel.Close>
        </Sidepanel.Actions>

        <Sidepanel.Header>
          <div className="pr-ws-16">
            <Sidepanel.Title>{template.name}</Sidepanel.Title>
            <Sidepanel.Description>
              {`${KIND_LABEL[template.kind]} · By ${makerName(template.by)}`}
            </Sidepanel.Description>
          </div>
        </Sidepanel.Header>

        <Sidepanel.Content className="gap-ws-12 flex flex-col">
          <TemplatePreview
            kind={template.kind}
            className="rounded-ws-container-md border-ws-static-subtle border"
          />

          <p className="typography-body-md text-ws-static-base">{template.about}</p>

          <section aria-labelledby={insideId} className="gap-ws-5 flex flex-col">
            <h3 id={insideId} className="typography-label-strong-md text-ws-static-strong">
              What’s inside
            </h3>
            <ul className="gap-ws-3 flex flex-col">
              {template.contents.map((item) => (
                <li key={item} className="gap-ws-5 typography-body-md text-ws-static-base flex">
                  <RiCheckLine
                    aria-hidden="true"
                    className="size-ws-9 text-ws-static-subtle mt-ws-1 shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby={usersId} className="gap-ws-5 flex flex-col">
            <h3 id={usersId} className="typography-label-strong-md text-ws-static-strong">
              Who uses it
            </h3>
            <div className="gap-ws-7 flex items-center">
              {teammates.length > 0 && (
                <AvatarGroup size="sm" className="w-auto shrink-0">
                  {teammates.map((person) => (
                    <Avatar
                      key={person.name}
                      initials={person.initials}
                      color={person.color}
                      title={person.name}
                    />
                  ))}
                </AvatarGroup>
              )}
              <p className="typography-body-md text-ws-static-base">
                {teammates.length > 0
                  ? `${formatList(teammates.map((person) => person.name))} ${teammates.length === 1 ? 'uses' : 'use'} it in ${workspace.name}. `
                  : `Nobody in ${workspace.name} uses it yet. `}
                <span className="text-ws-static-subtle">
                  {`${formatTeams(template.teams)} use it in Orbit.`}
                </span>
              </p>
            </div>
          </section>
        </Sidepanel.Content>

        <Sidepanel.Footer>
          <div className="gap-ws-5 flex">
            <IconButton
              icon={saved ? RiBookmarkFill : RiBookmarkLine}
              variant="secondary"
              preset="border"
              aria-label={`Save ${template.name}`}
              aria-pressed={saved}
              onClick={() => onSaveChange(!saved)}
            />
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="secondary" preset="border">
                  Add to collection
                  <Button.Icon icon={RiArrowDownSLine} />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content side="top" align="start" className="w-[14rem]">
                {collections.map((collection) => {
                  const inside = collection.templates.includes(template.id);
                  return (
                    <DropdownMenu.Item
                      key={collection.id}
                      onSelect={() => onToggleCollection(collection)}
                    >
                      <ListItem.Prefix>
                        <RiStackLine className="size-ws-9" />
                      </ListItem.Prefix>
                      <ListItem.Content>
                        <ListItem.Label>{collection.name}</ListItem.Label>
                      </ListItem.Content>
                      {inside && (
                        <ListItem.Suffix>
                          <RiCheckLine
                            role="img"
                            aria-label="In this collection"
                            className="size-ws-9"
                          />
                        </ListItem.Suffix>
                      )}
                    </DropdownMenu.Item>
                  );
                })}
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={onNewCollection}>
                  <ListItem.Prefix>
                    <RiAddLine className="size-ws-9" />
                  </ListItem.Prefix>
                  <ListItem.Content>
                    <ListItem.Label>New collection</ListItem.Label>
                  </ListItem.Content>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>

          <div className="gap-ws-9 ml-auto flex items-center">
            {added ? (
              <>
                <LinkButton href={home.href} className="gap-ws-3">
                  {home.label}
                  <RiArrowRightUpLine aria-hidden className="size-ws-9" />
                </LinkButton>
                <Button disabled>
                  <Button.Icon icon={RiCheckLine} />
                  Added
                </Button>
              </>
            ) : (
              <Button onClick={onAdd}>
                <Button.Icon icon={RiAddLine} />
                Add to workspace
              </Button>
            )}
          </div>
        </Sidepanel.Footer>
      </Sidepanel.Panel>
    </Sidepanel>
  );
}
