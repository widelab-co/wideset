import { AppShell, Avatar } from '@wideset/react';
import { useState } from 'react';

import { Composer } from './composer';
import { USER } from './data';
import { TopBar } from './top-bar';

/** AI chat, Flat direction: a top bar on the white page, the greeting and the composer centred. */
export default function AiChat() {
  const [sent, setSent] = useState<{ id: number; text: string }[]>([]);

  return (
    <AppShell direction="flat" className="relative isolate overflow-hidden">
      {/* Figma's glow: a 321px circle, indigo to pink at 4%, blurred; it follows the column. */}
      <div
        aria-hidden
        className="rounded-ws-control-full from-ws-non-semantic-indigo-strong to-ws-non-semantic-pink-strong pointer-events-none absolute top-[7.1875rem] left-[calc(50%-29rem)] size-[20.0625rem] bg-linear-to-b/srgb opacity-[0.04] blur-[150px]"
      />
      <AppShell.Main>
        <TopBar />
        <div className="px-ws-12">
          <div className="gap-ws-12 pb-ws-12 mx-auto flex w-full max-w-[41.25rem] flex-col pt-[11rem]">
            {/* Figma places the composer 26px under the greeting: the column's 24 plus 2 here. */}
            <div className="px-ws-5 pb-ws-2 flex flex-col items-start">
              <Avatar agent size="lg" alt="" />
              {/* Figma's greeting is its own style, 32/32 at -0.2px, not a step of the title scale.
                  Its gradient runs in sRGB; Tailwind's default (oklab) brightens the middle. */}
              <h1 className="mt-ws-10 text-ws-800 leading-ws-800 tracking-ws-tight-50 font-ws-medium from-ws-non-semantic-brand-strong to-ws-non-semantic-pink-strong bg-linear-to-r/srgb bg-clip-text text-balance text-transparent">
                <span className="block">Hello {USER.firstName},</span>
                <span className="block">What would you like to know?</span>
              </h1>
            </div>

            {sent.length > 0 && (
              <ol aria-label="Sent messages" className="gap-ws-5 flex flex-col">
                {sent.map((message) => (
                  <li key={message.id} className="flex justify-end">
                    <p className="bg-ws-dynamic-primary-alpha-strong-default text-ws-non-semantic-indigo-on-subtle rounded-ws-container-sm p-ws-5 typography-body-md max-w-[22.25rem] break-words whitespace-pre-wrap">
                      {message.text}
                    </p>
                  </li>
                ))}
              </ol>
            )}

            <Composer onSend={(text) => setSent((all) => [...all, { id: Date.now(), text }])} />
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
