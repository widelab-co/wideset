import { RiCheckboxCircleFill } from '@remixicon/react';
import { Button } from '@wideset/react';

import { account, file } from './data';
import { customers } from './format';
import { OutcomeFigures } from './outcome-figures';

type ImportResultProps = {
  /** The heading's id: focus lands on it when the import ends. */
  id: string;
  result: { added: number; updated: number; skipped: number };
  onImportAnother: () => void;
};

/**
 * The last step: the result where the steps were. A small mark in the positive colour, the only
 * colour on it, since a finished import is good news; what came in, as the same figures the review
 * promised; and the two ways on, to the customers or to another file.
 */
export function ImportResult({ id, result, onImportAnother }: ImportResultProps) {
  return (
    <section aria-labelledby={id} className="gap-ws-12 flex flex-col">
      <div className="gap-ws-7 flex flex-col">
        <RiCheckboxCircleFill aria-hidden="true" className="size-ws-12 text-ws-semantic-positive" />
        <div className="gap-ws-2 flex flex-col">
          <h2
            id={id}
            tabIndex={-1}
            className="typography-subtitle-xs text-ws-static-strong outline-none"
          >
            {customers(result.added + result.updated)} imported
          </h2>
          <p className="typography-body-md text-ws-static-subtle">
            From {file.name}. New customers carry Import as their source, so you can filter for
            them; a summary is on its way to {account.email}.
          </p>
        </div>
      </div>
      <OutcomeFigures {...result} />
      <div className="gap-ws-5 flex">
        <Button size="sm" asChild>
          <a href="#customers">
            <span className="px-ws-2">View customers</span>
          </a>
        </Button>
        <Button size="sm" variant="secondary" preset="border" onClick={onImportAnother}>
          Import another file
        </Button>
      </div>
    </section>
  );
}
