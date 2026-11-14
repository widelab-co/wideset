// TODO(custom): contact channel rows (icon, name, hours and reply time) and a status line; ListItem is a 32px menu row with no room for lines under the name.
import {
  type RemixiconComponentType,
  RiChat3Line,
  RiCheckboxCircleFill,
  RiMailLine,
} from '@remixicon/react';
import { Button, Card } from '@wideset/react';
import { type ReactNode, useId } from 'react';

import { support } from './data';
import { TextLink } from './text-link';

/** One way to reach the team: a quiet icon, its name, then when and how fast. */
function Channel({
  icon: Icon,
  title,
  children,
}: {
  icon: RemixiconComponentType;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="gap-ws-7 flex">
      <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle mt-ws-1 shrink-0" />
      <div className="gap-ws-1 flex min-w-0 flex-col">
        <span className="typography-label-strong-sm text-ws-static-strong">{title}</span>
        <span className="typography-body-md text-ws-static-subtle flex flex-col">{children}</span>
      </div>
    </li>
  );
}

/**
 * The ways to reach a person, last in the reading order, in a card beside the articles: chat with
 * its hours and the current wait, e-mail with the usual reply time, then the way to write to the
 * team. The system status is the card's footer, one quiet line; its mark is green because "all
 * is well" is a judgement.
 */
export function ContactSupport() {
  const id = useId();

  return (
    <Card role="region" aria-labelledby={id}>
      <Card.Header>
        <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
          Talk to a person
        </h2>
      </Card.Header>
      {/* Card.Content keeps 10px free on its right for a scrollbar: the padding gives it back. */}
      <Card.Content contentClassName="pr-ws-6 gap-ws-11 flex flex-col">
        <ul className="gap-ws-9 flex flex-col">
          <Channel icon={RiChat3Line} title="Chat with support">
            <span>{support.chat.hours}</span>
            <span>{support.chat.wait}</span>
          </Channel>
          <Channel icon={RiMailLine} title="E-mail">
            <TextLink href={`mailto:${support.email.address}`} className="self-start">
              {support.email.address}
            </TextLink>
            <span>{support.email.reply}</span>
          </Channel>
        </ul>
        {/* Bordered: filled, it would outweigh the search, the page's main control. */}
        <Button size="sm" variant="secondary" preset="border" asChild className="self-start">
          <a href="#contact-support">Contact support</a>
        </Button>
      </Card.Content>
      <Card.Footer>
        <p className="gap-ws-5 typography-body-md text-ws-static-subtle flex w-full items-center">
          <RiCheckboxCircleFill
            aria-hidden="true"
            className="size-ws-9 text-ws-semantic-positive shrink-0"
          />
          <span className="flex-1">{support.status.label}</span>
          <TextLink href={support.status.href}>Status page</TextLink>
        </p>
      </Card.Footer>
    </Card>
  );
}
