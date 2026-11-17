// TODO(custom): an "On this page" list that follows the scroll; Wideset has no table of contents or scroll-spy navigation.
import { cn } from '@wideset/react';
import { type RefObject, useEffect, useId, useState } from 'react';

type OnThisPageProps = {
  sections: readonly { id: string; title: string }[];
  /** The element the article scrolls in: the page card's body, not the window. */
  scrollRef: RefObject<HTMLElement | null>;
};

/**
 * The article's sections as plain anchor links beside it: a click jumps to the section (the
 * scroll container scrolls smoothly), and the section in view is marked as the scroll goes. A
 * section counts as in view once its heading passes the top quarter of the view; at the very end
 * the last one does, even if it is too short to reach that line. The mark is neutral, like a
 * selected tab: strong text and a strong line on the rail.
 */
export function OnThisPage({ sections, scrollRef }: OnThisPageProps) {
  const titleId = useId();
  const [current, setCurrent] = useState(sections[0]?.id);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const update = () => {
      const line = root.getBoundingClientRect().top + root.clientHeight / 4;
      const atEnd = root.scrollTop + root.clientHeight >= root.scrollHeight - 1;
      const passed = sections.filter(
        ({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= line,
      );
      setCurrent((atEnd ? sections.at(-1) : passed.at(-1))?.id ?? sections[0]?.id);
    };

    update();
    root.addEventListener('scroll', update, { passive: true });
    return () => root.removeEventListener('scroll', update);
  }, [sections, scrollRef]);

  return (
    <nav aria-labelledby={titleId} className="gap-ws-7 flex flex-col">
      <h2 id={titleId} className="typography-label-strong-sm text-ws-static-strong">
        On this page
      </h2>
      <ul className="border-ws-static-base flex flex-col border-l">
        {sections.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={id === current ? 'location' : undefined}
              className={cn(
                'py-ws-3 pl-ws-7 typography-label-sm focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default -ml-px block border-l-[2px]',
                id === current
                  ? 'border-ws-static-strong text-ws-static-strong'
                  : 'text-ws-static-subtle hover:text-ws-static-strong border-transparent',
              )}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
