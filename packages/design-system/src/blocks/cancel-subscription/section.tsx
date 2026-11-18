// TODO(custom): section title above its content; Wideset has no Section or PageSection.
import { type ReactNode, useId } from 'react';

type SectionProps = {
  title: string;
  /** One quiet line under the title. */
  description?: string;
  children: ReactNode;
};

/** One step of the page: a 16px title, then what it holds. The title names the region. */
export function Section({ title, description, children }: SectionProps) {
  const id = useId();

  return (
    <section aria-labelledby={id} className="gap-ws-7 flex flex-col">
      <div className="gap-ws-2 flex flex-col">
        <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
          {title}
        </h2>
        {description && <p className="typography-body-md text-ws-static-subtle">{description}</p>}
      </div>
      {children}
    </section>
  );
}
