// TODO(custom): a section of long text (heading, then its paragraphs, lists and tables at a reading rhythm); Wideset has typography-body-lg but no prose styles.
import type { ReactNode } from 'react';

const HEADING = {
  2: 'typography-subtitle-xs text-ws-static-strong',
  3: 'typography-label-strong-md text-ws-static-strong',
};

/**
 * A part of the article under its heading: 18px for a section, 16px for a sub-section, both
 * closer to their text than to what came before (a sub-section takes extra room above it). A section has an `id`, so "On this page" can
 * jump to it; `scroll-mt` leaves room above the heading once it lands.
 */
export function ArticleSection({
  id,
  level = 2,
  title,
  children,
}: {
  id?: string;
  level?: 2 | 3;
  title: string;
  children: ReactNode;
}) {
  const Heading = `h${level}` as const;

  return (
    <section
      id={id}
      aria-labelledby={id && `${id}-title`}
      className={
        level === 2 ? 'gap-ws-7 scroll-mt-ws-14 flex flex-col' : 'gap-ws-5 mt-ws-7 flex flex-col'
      }
    >
      <Heading id={id && `${id}-title`} className={HEADING[level]}>
        {title}
      </Heading>
      <div className="gap-ws-9 flex flex-col">{children}</div>
    </section>
  );
}
