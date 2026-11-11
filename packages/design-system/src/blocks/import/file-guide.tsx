import { Code } from './code';
import { fields, guide } from './data';
import { Section } from './section';
import { TextLink } from './text-link';

/**
 * Beside the steps: the columns Orbit reads, as the help article lists them, so the file can be
 * checked without leaving the page, and the article for the rest. Plain text, no box: it is help,
 * not a step.
 */
export function FileGuide() {
  return (
    <Section
      title="Columns Orbit reads"
      description="Only name is required. Any other column can be matched to a field or left out."
    >
      <dl className="gap-ws-7 flex flex-col">
        {fields.map((field) => (
          <div key={field.value} className="gap-ws-2 flex flex-col">
            <dt className="typography-label-sm">
              <Code>{field.column}</Code>
              {field.required && <span className="text-ws-static-subtle">, required</span>}
            </dt>
            <dd className="typography-label-sm text-ws-static-subtle">{field.holds}</dd>
          </div>
        ))}
      </dl>
      <p className="typography-body-md text-ws-static-subtle">
        More in <TextLink href={guide.href}>{guide.title}</TextLink>.
      </p>
    </Section>
  );
}
