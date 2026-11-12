import { Button, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import { account, linkedAccounts } from './data';
import { SettingRow } from './setting-row';

/**
 * The providers Maya can sign in with besides her password: each says whom it is linked as, or
 * that it is not, and offers the one thing to do about it. A change applies at once.
 */
export function LinkedAccounts() {
  const titleId = useId();
  const { showToast } = useToast();
  const [linked, setLinked] = useState(linkedAccounts);

  const link = (id: string, connected: string | null) =>
    setLinked(linked.map((item) => (item.id === id ? { ...item, connected } : item)));

  return (
    <div className="gap-ws-9 flex flex-col">
      <h3 id={titleId} className="typography-label-strong-sm text-ws-static-strong">
        Linked accounts
      </h3>
      <ul aria-labelledby={titleId} className="gap-ws-11 flex flex-col">
        {linked.map(({ id, name, icon, connected }) => (
          <li key={id}>
            <SettingRow
              icon={icon}
              label={name}
              description={connected ? `Connected as ${connected}` : 'Not connected'}
            >
              {connected ? (
                <Button
                  size="sm"
                  variant="secondary"
                  preset="border"
                  aria-label={`Disconnect ${name}`}
                  onClick={() => {
                    link(id, null);
                    showToast({ content: `${name} disconnected` });
                  }}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  preset="border"
                  aria-label={`Connect ${name}`}
                  onClick={() => {
                    link(id, account.email);
                    showToast({ status: 'success', content: `${name} connected` });
                  }}
                >
                  Connect
                </Button>
              )}
            </SettingRow>
          </li>
        ))}
      </ul>
    </div>
  );
}
