// TODO(custom): quoted message (a line down the side, the author, the first lines); Wideset has no quote or reply-preview component.
import type { Message } from './data';

/**
 * The earlier message a reply answers, over the reply: quieter than the reply itself and cut
 * after two lines, since the whole of it is further up the thread.
 */
export function MessageQuote({ quote }: { quote: NonNullable<Message['quote']> }) {
  return (
    <blockquote className="border-ws-static-base pl-ws-7 my-ws-2 flex max-w-[40rem] flex-col border-l-2">
      <cite className="typography-caption-strong-md text-ws-static-base not-italic">
        {quote.author.name}
      </cite>
      <p className="typography-body-md text-ws-static-subtle line-clamp-2">{quote.text}</p>
    </blockquote>
  );
}
