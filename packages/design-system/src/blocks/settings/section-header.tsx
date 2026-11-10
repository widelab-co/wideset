/** A section's title (16px) and, when it needs one, the line that says what the section holds. */
export function SectionHeader({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="gap-ws-3 flex flex-col">
      <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
        {title}
      </h2>
      {description && <p className="typography-label-sm text-ws-static-subtle">{description}</p>}
    </div>
  );
}
