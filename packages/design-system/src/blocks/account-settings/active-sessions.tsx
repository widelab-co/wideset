import { Button, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import { type Session, sessions as initialSessions } from './data';
import { formatDateTime, formatLastActive } from './format';
import { SettingRow } from './setting-row';

/**
 * Where Maya is signed in: each device with where and when it was last used. This device is
 * marked and cannot sign itself out here; every other one can, one at a time or all at once.
 */
export function ActiveSessions() {
  const titleId = useId();
  const { showToast } = useToast();
  const [sessions, setSessions] = useState(initialSessions);
  const others = sessions.filter((session) => !session.current);

  const signOut = (gone: Session[]) => {
    setSessions(sessions.filter((session) => !gone.includes(session)));
    showToast({
      content:
        gone.length === 1
          ? `Signed out of ${gone[0].device}`
          : `Signed out of ${gone.length} other sessions`,
    });
  };

  return (
    <div className="gap-ws-9 flex flex-col">
      <h3 id={titleId} className="typography-label-strong-sm text-ws-static-strong">
        Active sessions
      </h3>
      <ul aria-labelledby={titleId} className="gap-ws-11 flex flex-col">
        {sessions.map((session) => (
          <li key={session.id}>
            <SettingRow
              icon={session.icon}
              label={session.device}
              description={
                <>
                  {session.place} ·{' '}
                  <time dateTime={session.lastActive} title={formatDateTime(session.lastActive)}>
                    {formatLastActive(session.lastActive)}
                  </time>
                </>
              }
            >
              {session.current ? (
                <span className="typography-label-sm text-ws-static-subtle">This device</span>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  preset="border"
                  aria-label={`Sign out of ${session.device}`}
                  onClick={() => signOut([session])}
                >
                  Sign out
                </Button>
              )}
            </SettingRow>
          </li>
        ))}
      </ul>
      <div>
        <Button
          size="sm"
          variant="secondary"
          preset="border"
          disabled={others.length === 0}
          onClick={() => signOut(others)}
        >
          Sign out of all other sessions
        </Button>
      </div>
    </div>
  );
}
