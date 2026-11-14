import { AppShell } from '@wideset/react';

import { Balance } from './Balance';
import { Distribution } from './Distribution';
import { SwapForm } from './SwapForm';
import { TopBar } from './TopBar';
import { Transactions } from './Transactions';

/** Crypto wallet, Canvas direction: a grey page, the top bar on it, the content in white sections. */
export default function Crypto() {
  return (
    <AppShell direction="canvas">
      <AppShell.Main className="flex flex-col">
        <TopBar />
        {/* 6px under the cards, not Figma's 8: the 111px gap above "Transactions"' button rounds
          up to the 112px token, and 8 would push a 960px-tall window into a 1px scroll. */}
        <div className="gap-ws-16 pr-ws-5 pb-ws-4 pl-ws-16 mx-auto flex w-full max-w-[90rem] flex-1 items-start">
          <SwapForm className="w-[26.5rem] shrink-0" />
          <div className="bg-ws-static-foreground rounded-ws-container-md pt-ws-16 pr-ws-14 pl-ws-16 flex min-w-0 flex-1 flex-col">
            <Balance />
            <div className="mt-ws-16 border-ws-static-subtle flex flex-1 border-t">
              <Transactions className="border-ws-static-subtle pt-ws-14 pr-ws-16 pb-ws-16 flex-1 border-r" />
              <Distribution className="pt-ws-14 pb-ws-19 pl-ws-16 flex-1" />
            </div>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
