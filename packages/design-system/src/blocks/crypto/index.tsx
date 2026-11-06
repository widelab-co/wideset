import { Balance } from './Balance';
import { Distribution } from './Distribution';
import { SwapForm } from './SwapForm';
import { TopBar } from './TopBar';
import { Transactions } from './Transactions';

/** Crypto wallet, Canvas direction: a grey page, the top bar on it, the content in white sections. */
export default function Crypto() {
  return (
    <div className="bg-ws-static-background flex min-h-dvh flex-col">
      <TopBar />
      <main className="gap-ws-16 pr-ws-5 pb-ws-5 pl-ws-16 flex flex-1">
        <SwapForm className="w-[26.5rem] shrink-0" />
        <div className="bg-ws-static-foreground rounded-ws-container-md pt-ws-16 pr-ws-14 pl-ws-16 flex min-w-0 flex-1 flex-col">
          <Balance />
          <div className="mt-ws-16 border-ws-static-subtle flex flex-1 border-t">
            <Transactions className="border-ws-static-subtle pt-ws-14 pr-ws-16 pb-ws-16 flex-1 border-r" />
            <Distribution className="pt-ws-14 pb-ws-19 pl-ws-16 flex-1" />
          </div>
        </div>
      </main>
    </div>
  );
}
