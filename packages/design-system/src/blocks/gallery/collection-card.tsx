// TODO(custom): a collection as a card that opens as a whole; Card has no interactive state and ActionTile is a one-row tile with no room for previews.
import { type Collection, makerName, type Template } from './data';
import { TemplatePreview } from './template-preview';

/**
 * A featured collection: the shapes of its first three templates side by side, then its name,
 * what it is for and who put it together. Quiet on purpose, the same border and greys as a
 * template card; the name is the button that opens it, stretched over the card.
 */
export function CollectionCard({
  collection,
  templates,
  onOpen,
}: {
  collection: Collection;
  /** Its templates, in the collection's order. */
  templates: Template[];
  onOpen: () => void;
}) {
  return (
    <article className="rounded-ws-container-md border-ws-static-base hover:border-ws-static-strong hover:shadow-ws-low relative flex w-full flex-col overflow-hidden border transition-shadow">
      <div className="gap-ws-5 p-ws-7 border-ws-static-subtle grid grid-cols-3 border-b">
        {templates.slice(0, 3).map((template) => (
          <TemplatePreview
            key={template.id}
            kind={template.kind}
            compact
            className="rounded-ws-control-lg"
          />
        ))}
      </div>
      <div className="gap-ws-2 p-ws-7 flex flex-col">
        <h3 className="typography-label-strong-md text-ws-static-strong">
          <button
            type="button"
            onClick={onOpen}
            className="focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 cursor-pointer text-left after:absolute"
          >
            {collection.name}
          </button>
        </h3>
        <p className="typography-body-md text-ws-static-base">{collection.description}</p>
        <p className="typography-caption-md text-ws-static-subtle mt-ws-3">
          By {makerName(collection.by)}
        </p>
      </div>
    </article>
  );
}
