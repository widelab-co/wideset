import { type SectionId, sections } from './data';

/**
 * The settings section list, a panel at the page's left edge split off by a line (Frame). Its
 * rows are drawn like `Sidebar.Item`, which only works inside a `Sidebar`: one target across the
 * row, the neutral fill on the open section.
 */
export function SettingsNav({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <nav
      aria-labelledby="settings-nav-title"
      className="gap-ws-5 px-ws-5 py-ws-12 border-ws-static-subtle flex w-[15rem] shrink-0 flex-col overflow-y-auto border-r"
    >
      <h2
        id="settings-nav-title"
        className="typography-label-strong-md text-ws-static-strong px-ws-5 py-ws-3"
      >
        Settings
      </h2>
      <ul className="flex flex-col">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault();
                onSelect(id);
              }}
              className="h-ws-14 px-ws-5 rounded-ws-control-lg typography-label-strong-sm text-ws-static-base hover:bg-ws-dynamic-tertiary-alpha-strong-default hover:text-ws-static-strong aria-[current=page]:bg-ws-dynamic-tertiary-alpha-strong-default aria-[current=page]:text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full items-center"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
