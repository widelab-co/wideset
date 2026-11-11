import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCornerDownLeftLine,
  RiSearchLine,
} from '@remixicon/react';
import { Modal, TextInput } from '@wideset/react';
import { type KeyboardEvent, useId, useState } from 'react';

import { CommandRow } from './command-row';
import { type Command, GROUPS } from './data';
import { Hint, Key } from './keyboard-hints';

/** A query that starts with this lists only actions. */
const ACTIONS_PREFIX = '>';

type Section = { label: string; items: Command[] };

/**
 * What the palette lists for a query. Nothing typed: the recent items and the suggested actions.
 * Typed: every command whose name or context holds the text, in the app's groups. Typed after
 * `>`: the actions only.
 */
function sectionsFor(
  query: string,
  commands: Command[],
  recent: string[],
  suggested: string[],
): { text: string; sections: Section[] } {
  const term = query.trimStart();
  const actionsOnly = term.startsWith(ACTIONS_PREFIX);
  const text = (actionsOnly ? term.slice(ACTIONS_PREFIX.length) : term).trim();

  if (!term) {
    const byId = (id: string) => commands.find((command) => command.id === id);
    const pick = (ids: string[]) => ids.map(byId).filter((command) => command !== undefined);
    return {
      text,
      sections: [
        { label: 'Recent', items: pick(recent) },
        { label: 'Actions', items: pick(suggested) },
      ],
    };
  }

  const needle = text.toLowerCase();
  const found = commands.filter(
    (command) =>
      (!actionsOnly || command.group === 'Actions') &&
      `${command.name} ${command.context}`.toLowerCase().includes(needle),
  );
  return {
    text,
    sections: GROUPS.map((group) => ({
      label: group,
      items: found.filter((command) => command.group === group),
    })).filter((section) => section.items.length > 0),
  };
}

type PaletteBodyProps = {
  commands: Command[];
  recent: string[];
  suggested: string[];
  onRun: (command: Command) => void;
};

/**
 * The palette's inside, mounted each time it opens, so it always starts empty with the first row
 * active. The field keeps the focus the whole time: typing filters, the arrow keys move the
 * highlight (the field points at it for screen readers), Enter runs it. Esc is the Modal's own.
 */
function PaletteBody({ commands, recent, suggested, onRun }: PaletteBodyProps) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const { text, sections } = sectionsFor(query, commands, recent, suggested);
  const shown = sections.flatMap((section) => section.items);
  const current = shown[active];
  const optionId = (command: Command) => `${id}-${command.id}`;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = shown[active + (event.key === 'ArrowDown' ? 1 : -1)];
      if (!next) return;
      setActive(shown.indexOf(next));
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && current) {
      event.preventDefault();
      onRun(current);
    }
  };

  return (
    // The keys belong to the field; the wrapper only listens for them as they bubble up.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div onKeyDown={onKeyDown} className="flex min-h-0 flex-col">
      <div className="px-ws-11 pt-ws-11 pb-ws-9 border-ws-static-base border-b">
        <TextInput
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
        >
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input
            type="search"
            placeholder="Search pages, customers and deals, or type > for actions"
            aria-label="Search or run a command"
            role="combobox"
            aria-expanded
            aria-controls={`${id}-list`}
            aria-activedescendant={current && optionId(current)}
            autoComplete="off"
          />
        </TextInput>
      </div>

      {/* At most nine rows tall; past that the list scrolls under the field. */}
      <div className="px-ws-11 py-ws-5 max-h-[26rem] min-h-0 overflow-y-auto">
        {shown.length === 0 ? (
          <p role="status" className="px-ws-7 py-ws-9 typography-body-md text-ws-static-subtle">
            No results for “{text}”.
          </p>
        ) : (
          <div id={`${id}-list`} role="listbox" aria-label="Commands">
            {sections.map((section) => (
              <div
                key={section.label}
                role="group"
                aria-labelledby={`${id}-${section.label}`}
                className="not-first:mt-ws-5"
              >
                <div
                  id={`${id}-${section.label}`}
                  role="presentation"
                  className="px-ws-7 pt-ws-5 pb-ws-3 typography-label-sm text-ws-static-subtle"
                >
                  {section.label}
                </div>
                {section.items.map((command) => (
                  <CommandRow
                    key={command.id}
                    id={optionId(command)}
                    command={command}
                    query={text}
                    active={command === current}
                    onActivate={() => setActive(shown.indexOf(command))}
                    onRun={() => onRun(command)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal.Footer variant="extension">
        <div className="gap-ws-12 flex items-center">
          <Hint
            keys={
              <span className="gap-ws-3 flex">
                <Key icon={RiArrowUpSLine} name="Up arrow" />
                <Key icon={RiArrowDownSLine} name="Down arrow" />
              </span>
            }
          >
            Move
          </Hint>
          <Hint keys={<Key icon={RiCornerDownLeftLine} name="Enter" />}>Run</Hint>
          <Hint keys={<Key>{ACTIONS_PREFIX}</Key>}>Actions only</Hint>
        </div>
        <Hint keys={<Key>esc</Key>}>Close</Hint>
      </Modal.Footer>
    </div>
  );
}

type CommandPaletteProps = PaletteBodyProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * The command palette: a dialog near the top of the window, so the list grows down from the
 * field instead of moving it. One field finds pages, customers and deals and runs actions; the
 * results are grouped, each with its icon, a quiet context and its shortcut. No tabs and no X: the
 * hint row names the way out, and a click outside closes it too.
 */
export function CommandPalette({ open, onOpenChange, ...body }: CommandPaletteProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        showCloseButton={false}
        aria-describedby={undefined}
        className="top-ws-26 translate-y-0"
      >
        <Modal.Title className="sr-only">Command palette</Modal.Title>
        <PaletteBody {...body} />
      </Modal.Content>
    </Modal>
  );
}
