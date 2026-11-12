import { RiAddLine, RiCheckLine, RiEraserLine, RiFileCopyLine, RiStopLine } from '@remixicon/react';
import { Tabs, TextInput } from '@wideset/react';
import { type FormEvent, useEffect, useRef, useState } from 'react';

import { BarAction } from './bar-action';
import { PASSING_TESTS, type Run, SHELLS, stateOf, textOf } from './terminal-data';
import { TerminalOutput } from './terminal-output';
import { TerminalStateMark } from './terminal-state-mark';

/** How long the tests take to answer at the prompt, and how long Copy shows its check. */
const TEST_RUN = 1200;
const COPIED = 1600;

/**
 * The Terminal pane: the session's shells as quiet tabs, each with the state of its last command
 * (the tests the agent ran, the dev server it left running, your own shell) and a `+` for another;
 * on the right Stop for a running process, Clear and Copy output. Under the bar the open shell's
 * log, and at the foot a command field: `clear` and `pnpm test bookings` answer, anything else is
 * not found. A shell with a process in the foreground takes no command until it is stopped.
 * The field is the library's, with the prompt sign as its prefix; only its type is monospace.
 */
export function TerminalPane() {
  const [shells, setShells] = useState(SHELLS);
  const [active, setActive] = useState(SHELLS[0].id);
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  // Numbers the shells and commands added here; the timers are the test runs still going.
  const added = useRef(0);
  const timers = useRef<number[]>([]);
  const prompt = useRef<HTMLInputElement>(null);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), COPIED);
    return () => window.clearTimeout(id);
  }, [copied]);

  const shell = shells.find(({ id }) => id === active) ?? shells[0];
  const running = shell.runs.find(({ state }) => state === 'running');

  const update = (id: string, change: (runs: Run[]) => Run[]) =>
    setShells((all) =>
      all.map((one) => (one.id === id ? { ...one, runs: change(one.runs) } : one)),
    );

  // A process still going keeps its line; what it printed so far goes with the rest.
  const clear = () =>
    update(shell.id, (runs) =>
      runs.filter(({ state }) => state === 'running').map((one) => ({ ...one, output: [] })),
    );

  const run = (event: FormEvent) => {
    event.preventDefault();
    const command = draft.trim();
    if (!command || running) return;
    setDraft('');
    if (command === 'clear') return clear();

    const id = `run-${(added.current += 1)}`;
    const mine = { id, by: 'you', command } as const;
    if (command !== 'pnpm test bookings') {
      const [name] = command.split(/\s+/);
      const output = [[`zsh: command not found: ${name}`]];
      return update(shell.id, (runs) => [...runs, { ...mine, state: 127, output }]);
    }
    // The tests take a moment: the shell is busy and can be stopped until they answer.
    update(shell.id, (runs) => [...runs, { ...mine, state: 'running', output: [] }]);
    timers.current.push(
      window.setTimeout(
        () =>
          update(shell.id, (runs) =>
            runs.map((one) =>
              one.id === id && one.state === 'running'
                ? { ...one, state: 0, output: PASSING_TESTS }
                : one,
            ),
          ),
        TEST_RUN,
      ),
    );
  };

  const stop = () =>
    update(shell.id, (runs) =>
      runs.map((one) =>
        one.state === 'running'
          ? { ...one, state: 'stopped', output: [...one.output, [['subtle', '^C']]] }
          : one,
      ),
    );

  const open = () => {
    const id = `shell-${(added.current += 1)}`;
    setShells([...shells, { id, name: 'zsh', runs: [] }]);
    setActive(id);
    // A new shell is opened to type in.
    prompt.current?.focus();
  };

  const copy = () => {
    void navigator.clipboard?.writeText(textOf(shell)).catch(() => {});
    setCopied(true);
  };

  return (
    <Tabs
      type="ghost"
      value={shell.id}
      onValueChange={setActive}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="h-ws-16 border-ws-static-subtle px-ws-11 gap-ws-5 flex shrink-0 items-center border-b">
        {/* More shells than fit scroll sideways inside the bar; the actions keep their place. */}
        <div className="gap-ws-3 flex min-w-0 items-center overflow-x-auto">
          <Tabs.List aria-label="Shells">
            {shells.map(({ id, name, runs }) => {
              const state = runs.at(-1)?.state;
              return (
                <Tabs.Item key={id} value={id} className="shrink-0">
                  <TerminalStateMark state={state} />
                  <Tabs.Label>{name}</Tabs.Label>
                  {state !== undefined && (
                    <span className="sr-only">, {stateOf(state).label.toLowerCase()}</span>
                  )}
                </Tabs.Item>
              );
            })}
          </Tabs.List>
          <BarAction icon={RiAddLine} label="New shell" onClick={open} />
        </div>
        <div className="gap-ws-2 ml-auto flex shrink-0 items-center">
          {/* Disabled while nothing runs, so the bar keeps its layout. */}
          <BarAction icon={RiStopLine} label="Stop" disabled={!running} onClick={stop} />
          <BarAction
            icon={RiEraserLine}
            label="Clear"
            disabled={shell.runs.length === 0}
            onClick={clear}
          />
          <BarAction
            icon={copied ? RiCheckLine : RiFileCopyLine}
            label="Copy output"
            // The check arrives with a short fade, growing the last step into place.
            iconClassName={
              copied
                ? 'animate-in fade-in-0 zoom-in-[0.8] duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)'
                : undefined
            }
            onClick={copy}
          />
          <span role="status" className="sr-only">
            {copied ? 'Output copied' : ''}
          </span>
        </div>
      </div>

      {shells.map(({ id, runs }) => (
        <Tabs.Content key={id} value={id} className="min-h-0 flex-1">
          <TerminalOutput runs={runs} />
        </Tabs.Content>
      ))}

      <form onSubmit={run} className="px-ws-11 pb-ws-9 pt-ws-5 shrink-0">
        {/* Read-only, not disabled, while a process runs: the field keeps the focus for the next
            command and says why it takes none. */}
        <TextInput
          size="sm"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          readOnly={Boolean(running)}
        >
          <TextInput.Prefix>$</TextInput.Prefix>
          <TextInput.Input
            ref={prompt}
            aria-label="Command"
            placeholder={running ? `Stop ${running.command} to type here` : 'Type a command'}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="font-ws-mono"
          />
        </TextInput>
      </form>
    </Tabs>
  );
}
