import { RiGitBranchLine, RiGitRepositoryLine } from '@remixicon/react';
import { Avatar, Chip, Select } from '@wideset/react';
import { useState } from 'react';

import {
  account,
  branches,
  efforts,
  files,
  models,
  permissions,
  product,
  repositories,
  starters,
} from './canon';
import { ChatTools } from './chat-tools';
import { CodeTools } from './code-tools';
import { Composer } from './composer';
import type { Mode } from './model';
import { ModelMenu } from './model-menu';

type HomeProps = {
  mode: Mode;
  /** Starts the thread with its first message. */
  onSend: (text: string) => void;
};

/**
 * A new chat or session: the agent's orb (the one place it shows), a small greeting with one
 * quiet line under it, then the composer in the middle of the page, where the eye lands, with
 * the mode's tools, the model and the effort. No gradient text and no glow: the composer is the
 * page, not the greeting. Code asks first where the work happens: the repository and the branch.
 * Under the composer, a few ways to start; picking one writes its opening words into the
 * composer and leaves the cursor at their end.
 */
export function Home({ mode, onSend }: HomeProps) {
  const [starter, setStarter] = useState({ text: '', id: 0 });
  const [attached, setAttached] = useState<string[]>([]);
  const [repository, setRepository] = useState(repositories[0]);
  const [branch, setBranch] = useState(branches[0]);
  const code = mode === 'code';

  const attach = () => {
    const next = files.find((name) => !attached.includes(name));
    if (next) setAttached([...attached, next]);
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="gap-ws-12 px-ws-11 py-ws-14 mx-auto flex min-h-full w-full max-w-[44rem] flex-col justify-center">
        <div className="gap-ws-9 px-ws-5 flex flex-col items-start">
          <Avatar agent size="lg" alt="" />
          <div className="gap-ws-3 flex flex-col">
            <h1 className="typography-subtitle-md text-ws-static-strong">
              Good morning, {account.name.split(' ')[0]}
            </h1>
            <p className="typography-body-md text-ws-static-subtle">
              {code
                ? 'Choose where the work happens, then say what to change.'
                : 'Ask a question, hand over a task, or pick a way to start.'}
            </p>
          </div>
        </div>

        <div className="gap-ws-7 flex flex-col">
          {code && (
            <div className="gap-ws-5 px-ws-3 flex">
              <Select
                size="sm"
                aria-label="Repository"
                className="w-[14rem]"
                options={repositories.map((value) => ({
                  value,
                  label: value,
                  prefix: <RiGitRepositoryLine className="size-ws-9" />,
                }))}
                value={repository}
                onValueChange={setRepository}
              />
              <Select
                size="sm"
                aria-label="Branch"
                className="w-[16rem]"
                options={branches.map((value) => ({
                  value,
                  label: value,
                  prefix: <RiGitBranchLine className="size-ws-9" />,
                }))}
                value={branch}
                onValueChange={setBranch}
              />
            </div>
          )}
          <Composer
            label={`Message ${product}`}
            placeholder={code ? 'Describe the change' : `How can ${product} help?`}
            draft={starter}
            attachments={attached}
            onDetach={(index) => setAttached(attached.filter((_, at) => at !== index))}
            tools={
              code ? (
                <CodeTools permissions={permissions} onAttach={attach} />
              ) : (
                <ChatTools onAttach={attach} />
              )
            }
            model={<ModelMenu models={models} efforts={efforts} />}
            roomy
            onSend={onSend}
          />
          <div role="group" aria-label="Ways to start" className="gap-ws-3 px-ws-3 flex flex-wrap">
            {starters[mode].map(({ label, icon, prompt }) => (
              <Chip
                key={label}
                variant="secondary"
                style="border"
                onClick={() => setStarter({ text: prompt, id: starter.id + 1 })}
              >
                <Chip.Icon icon={icon} />
                {label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
