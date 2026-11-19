import {
  type RemixiconComponentType,
  RiArrowDownSLine,
  RiBookOpenLine,
  RiCheckLine,
  RiClaudeFill,
  RiDownloadLine,
  RiFileCopyLine,
  RiFileTextLine,
  RiGithubLine,
  RiLayoutGridLine,
  RiMarkdownLine,
  RiMenuLine,
  RiOpenaiFill,
  RiPaletteLine,
  RiSearchLine,
  RiSparkling2Line,
} from '@remixicon/react';
import {
  Breadcrumbs,
  Button,
  cn,
  DropdownMenu,
  IconButton,
  ListItem,
  Popup,
  Sidebar,
  SplitButton,
  Tabs,
  TextInput,
} from '@wideset/react';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { loadExample } from '../lib/exampleLoader';
import type { CodeLang } from '../lib/highlight';
import type { ProjectPaths } from '../lib/importSource';
import { PLAYGROUNDS, withPlayground } from '../lib/playground';
import type { ManualFiles } from '../lib/registry';
import { isDark, loadAppearance, onAppearanceChange } from '../lib/theme';
import { useShownCode } from './ComponentCode';
import { Fit } from './Example';
import { ManualSteps } from './ManualSteps';
import SearchPalette, { type SearchItem } from './SearchPalette';
import TabRow from './TabRow';
import ThemeToggle from './ThemeToggle';
import { useHighlightedCode } from './useHighlightedCode';

const useCopy = () => {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  };
  return { copied, copy };
};

/** Whether the page is in dark mode, following the toggle. */
export const usePageDark = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(isDark(loadAppearance()));
    return onAppearanceChange((value) => setDark(isDark(value)));
  }, []);
  return dark;
};

const CopyIcon = ({ text, label = 'Copy code' }: { text: () => string; label?: string }) => {
  const { copied, copy } = useCopy();
  return (
    <IconButton
      icon={copied ? RiCheckLine : RiFileCopyLine}
      size="xs"
      preset="ghost"
      variant="secondary"
      aria-label={copied ? 'Copied' : label}
      onClick={() => copy(text())}
    />
  );
};

/**
 * The code block: the page's ground with a hairline and 12px corners; a header with the language
 * (or a file name, `label`, or a choice, `header`) and copy; the code under it. `peek` shows the
 * first lines fading out with "View code" over the fade; `flush` drops the frame inside a preview
 * card.
 */
export const Code = ({
  code,
  lang = 'tsx',
  label = lang,
  header,
  peek = false,
  flush = false,
  rule = false,
}: {
  code: string;
  lang?: CodeLang;
  label?: string;
  header?: ReactNode;
  peek?: boolean;
  flush?: boolean;
  /** A hairline under the header, edge to edge (a header that holds a choice). */
  rule?: boolean;
}) => {
  const html = useHighlightedCode(code, lang);
  // A short snippet shows whole: the peek is for code longer than its four lines.
  const [open, setOpen] = useState(!peek || code.trimEnd().split('\n').length <= 4);
  return (
    <div
      className={cn(
        'docs-snippet',
        rule && 'docs-snippet-ruled',
        !flush && 'overflow-hidden rounded-ws-container-md border border-ws-static-subtle',
      )}
    >
      <div
        className={cn(
          'flex min-h-ws-15 items-center justify-between gap-ws-5 py-ws-2 pr-ws-4 pl-ws-9',
          rule && 'border-b border-ws-static-subtle',
        )}
      >
        {header ?? (
          <span className="min-w-0 font-mono typography-caption-md wrap-anywhere text-ws-static-subtle">
            {label}
          </span>
        )}
        <CopyIcon text={() => code} />
      </div>
      <div className={cn('relative', !open && 'max-h-[7.5rem] overflow-hidden')}>
        {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <pre>{code.trimEnd()}</pre>}
        {!open && (
          <div className="docs-snippet-fade absolute inset-x-0 bottom-0 flex h-ws-19 items-end justify-center pb-ws-5">
            <Button size="xs" variant="secondary" preset="border" onClick={() => setOpen(true)}>
              View code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * The component page's thumbnail: the component as the gallery draws it, on the soft stage every
 * thumbnail sits on. No code under it.
 */
export const Stage = withPlayground(({ component }: { component: string }) => {
  const definition = PLAYGROUNDS[component];
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div
      data-stage
      className="grid min-h-[20rem] place-items-center overflow-hidden rounded-ws-container-md bg-ws-static-alpha-subtle px-ws-14 py-ws-14 text-ws-static-base"
    >
      {(mounted || !definition.clientOnly) && (
        <div className="w-max max-w-full">
          {definition.preview ? definition.preview() : definition.render(definition.defaults)}
        </div>
      )}
    </div>
  );
});

/** An example: one hairline card, the live file on its stage and its source in the peek under it. */
export const ExampleCard = ({
  file,
  code,
  paths,
}: {
  file: string;
  code: string;
  paths: ProjectPaths;
}) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const shown = useShownCode(code, paths);
  useEffect(() => {
    let live = true;
    loadExample(file).then((loaded) => {
      if (live && loaded) setComponent(() => loaded);
    });
    return () => {
      live = false;
    };
  }, [file]);
  return (
    <div className="overflow-hidden rounded-ws-container-md border border-ws-static-subtle">
      <div
        data-stage
        className="grid min-h-[16rem] place-items-center px-ws-14 py-ws-14 text-ws-static-base"
      >
        {Component && (
          <Fit>
            <Component />
          </Fit>
        )}
      </div>
      <div className="border-t border-ws-static-subtle">
        <Code code={shown} peek flush />
      </div>
    </div>
  );
};

const RUNNERS = [
  { value: 'pnpm', run: 'pnpm dlx' },
  { value: 'npm', run: 'npx' },
  { value: 'yarn', run: 'yarn dlx' },
  { value: 'bun', run: 'bunx' },
];

const PILL =
  'h-ws-12 rounded-ws-control-md px-ws-5 typography-caption-md outline-ws-dynamic-primary-strong-default transition-colors focus-visible:wds-focus-visible';
const ARROWS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

/**
 * A row of small pills that picks one value, in a card's header. A radio group: one tab stop
 * (the chosen pill), the arrow keys choose the next or the previous one.
 */
const Pills = ({
  label,
  options,
  value,
  onChange,
  mono = false,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
}) => (
  // ds-exempt: small pills in a code block's header; SegmentedControl's items are a 14px
  // control, too loud for this row, and a second row of Tabs would compete with the page's.
  <div role="radiogroup" aria-label={label} className="flex shrink-0 gap-ws-2">
    {options.map((item, index) => (
      <button
        key={item.value}
        type="button"
        role="radio"
        aria-checked={value === item.value}
        tabIndex={value === item.value ? 0 : -1}
        onClick={() => onChange(item.value)}
        onKeyDown={(event) => {
          const step = ARROWS[event.key];
          if (!step) return;
          event.preventDefault();
          onChange(options[(index + step + options.length) % options.length].value);
          // The chosen pill takes the focus once drawn (Install draws the row anew for Manual).
          requestAnimationFrame(() =>
            document
              .querySelector<HTMLElement>(
                `[role="radiogroup"][aria-label="${label}"] [aria-checked="true"]`,
              )
              ?.focus(),
          );
        }}
        className={cn(
          PILL,
          mono && 'font-mono',
          value === item.value
            ? 'bg-ws-static-alpha-base text-ws-static-strong'
            : 'text-ws-static-subtle hover:text-ws-static-strong',
        )}
      >
        {item.label}
      </button>
    ))}
  </div>
);

const METHODS = [
  { value: 'cli', label: 'CLI' },
  { value: 'manual', label: 'Manual' },
];

/**
 * Installation, one card: its header picks CLI or Manual (and, for the CLI, the package manager),
 * its body is the command or the files to copy. The choice lives in the card, so the page's flow
 * holds no second row of tabs.
 */
export const Install = ({ id, files }: { id: string; files: ManualFiles }) => {
  const [method, setMethod] = useState('cli');
  const [runner, setRunner] = useState('pnpm');
  const run = RUNNERS.find((item) => item.value === runner)!.run;
  const methods = (
    <Pills label="Install with" options={METHODS} value={method} onChange={setMethod} />
  );
  if (method === 'manual')
    return (
      <div className="overflow-hidden rounded-ws-container-md border border-ws-static-subtle">
        <div className="flex h-ws-15 items-center border-b border-ws-static-subtle pr-ws-4 pl-ws-9">
          {methods}
        </div>
        <div className="p-ws-9">
          <ManualSteps files={files} />
        </div>
      </div>
    );
  return (
    <>
      <Code
        lang="bash"
        code={`${run} wideset add ${id}`}
        rule
        header={
          <div className="docs-scroll flex min-w-0 flex-1 items-center justify-between gap-ws-7 overflow-x-auto">
            {methods}
            <Pills
              label="Package manager"
              options={RUNNERS.map((item) => ({ value: item.value, label: item.value }))}
              value={runner}
              onChange={setRunner}
              mono
            />
          </div>
        }
      />
      <p className="mt-ws-5 typography-body-sm text-ws-static-subtle">
        Copies the component and any Wideset components it uses into your project.
      </p>
    </>
  );
};

/** A secondary bordered link button (asChild needs a React child, so it is built here). */
export const ButtonLink = ({
  href,
  newTab = false,
  children,
}: {
  href: string;
  newTab?: boolean;
  children: ReactNode;
}) => (
  <Button asChild size="sm" variant="secondary" preset="border">
    <a href={href} {...(newTab && { target: '_blank', rel: 'noreferrer' })}>
      {children}
    </a>
  </Button>
);

const OPEN_IN = [
  {
    label: 'Open in ChatGPT',
    Icon: RiOpenaiFill,
    url: (q: string) => `https://chatgpt.com/?prompt=${q}`,
  },
  {
    label: 'Open in Claude',
    Icon: RiClaudeFill,
    url: (q: string) => `https://claude.ai/new?q=${q}`,
  },
];

/** "Copy page ▾": the button copies the page as Markdown; the menu views it or hands it to a model. */
export const CopyPage = ({
  markdown,
  twin = true,
}: {
  markdown: string;
  /** The page has a Markdown twin at `<page>.md` to view. */
  twin?: boolean;
}) => {
  const { copied, copy } = useCopy();
  const page = () => location.pathname.replace(/\/$/, '');
  const ask = () =>
    encodeURIComponent(
      `I'm reading the Wideset docs page ${location.href}.${
        twin ? ` Read its Markdown (${location.origin}${page()}.md), then` : ''
      } Help me use it.`,
    );
  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
  return (
    <SplitButton
      size="sm"
      variant="secondary"
      preset="border"
      icon={RiArrowDownSLine}
      iconAriaLabel="More ways to use this page"
      menuAlign="end"
      onClick={() => copy(markdown)}
      menuContent={
        <>
          {twin && (
            <DropdownMenu.Item onSelect={() => open(`${page()}.md`)}>
              <ListItem.Prefix>
                <RiMarkdownLine className="size-ws-9" />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>View as Markdown</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          )}
          {OPEN_IN.map((item) => (
            <DropdownMenu.Item key={item.label} onSelect={() => open(item.url(ask()))}>
              <ListItem.Prefix>
                <item.Icon className="size-ws-9" />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>{item.label}</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          ))}
        </>
      }
    >
      <SplitButton.Icon icon={copied ? RiCheckLine : RiFileCopyLine} />
      {copied ? 'Copied' : 'Copy page'}
    </SplitButton>
  );
};

export type NavGroup = {
  label?: string;
  items: { title: string; href: string; fresh?: boolean }[];
};

/** A page switched in place (the Playground's component): the URL changes, the page hears it. */
export const SOFT_NAVIGATE = 'docs:navigate';

/**
 * The one sidebar, the same on every page: a search field that narrows the list as you type,
 * then the page's own rows (library Sidebar rows; the current one filled). `soft`: the rows switch
 * the page in place instead of loading it (the Playground).
 */
export const SideNav = ({
  groups,
  current,
  placeholder,
  soft = false,
  className,
}: {
  groups: NavGroup[];
  /** The current row's href. */
  current: string;
  placeholder: string;
  soft?: boolean;
  /** Extra classes on the sidebar (the narrow menu drops the column's top padding). */
  className?: string;
}) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(current);
  useEffect(() => {
    if (soft) {
      // Both sidebars (the column and the narrow menu) follow a switch made in either.
      const sync = () => setActive(`${location.pathname}${location.search.split('&')[0]}`);
      if (location.search) sync();
      addEventListener('popstate', sync);
      addEventListener(SOFT_NAVIGATE, sync);
      return () => {
        removeEventListener('popstate', sync);
        removeEventListener(SOFT_NAVIGATE, sync);
      };
    }
    // The list scrolls on its own; bring the current row to its middle.
    const row = document.querySelector<HTMLElement>('#docs-nav [aria-current="page"]');
    const viewport = row?.closest<HTMLElement>('[data-slot="scroll-area-viewport"]');
    if (!row || !viewport) return;
    const offset = row.getBoundingClientRect().top - viewport.getBoundingClientRect().top;
    viewport.scrollTop += offset - viewport.clientHeight / 2 + row.offsetHeight / 2;
  }, [soft]);
  const needle = query.trim().toLowerCase();
  const shown = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.title.toLowerCase().includes(needle)),
    }))
    .filter((group) => group.items.length > 0);
  return (
    <Sidebar
      className={cn('h-full w-full border-r-0 bg-transparent pt-ws-14', className)}
      aria-label="Navigation"
    >
      <Sidebar.Header>
        <TextInput
          size="sm"
          className="w-full"
          value={query}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
        >
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input type="search" placeholder={placeholder} aria-label={placeholder} />
        </TextInput>
      </Sidebar.Header>
      <Sidebar.Section scrollable>
        <div className="flex flex-col gap-ws-7">
          {shown.map((group, index) => (
            <nav
              key={group.label ?? index}
              aria-label={group.label ?? 'Pages'}
              className="flex flex-col"
            >
              {group.label && <Sidebar.SectionHeader>{group.label}</Sidebar.SectionHeader>}
              {group.items.map((item) => (
                <Sidebar.Item
                  key={item.href}
                  href={item.href}
                  label={
                    item.fresh ? (
                      <span className="inline-flex items-center gap-ws-4">
                        {item.title}
                        <span
                          className="size-ws-4 shrink-0 rounded-ws-control-full bg-ws-dynamic-primary-default"
                          title="New"
                        />
                      </span>
                    ) : (
                      item.title
                    )
                  }
                  active={item.href === active}
                  aria-current={item.href === active ? 'page' : undefined}
                  onClick={
                    soft
                      ? (event: React.MouseEvent) => {
                          if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                          event.preventDefault();
                          history.pushState(null, '', item.href);
                          setActive(item.href);
                          document.documentElement.removeAttribute('data-docs-menu');
                          window.dispatchEvent(new Event(SOFT_NAVIGATE));
                        }
                      : undefined
                  }
                />
              ))}
            </nav>
          ))}
          {shown.length === 0 && (
            <p className="px-ws-5 typography-body-sm text-ws-static-subtle">Nothing matches.</p>
          )}
        </div>
      </Sidebar.Section>
    </Sidebar>
  );
};

type MenuRow = { title: string; text: string; href: string; icon: RemixiconComponentType };
const DOCS_MENU: { label: string; rows: MenuRow[] }[] = [
  {
    label: 'Documentation',
    rows: [
      {
        title: 'Introduction',
        text: 'What Wideset is and how it works.',
        href: '/docs/introduction',
        icon: RiBookOpenLine,
      },
      {
        title: 'Installation',
        text: 'Add the package or copy the source.',
        href: '/docs/installation',
        icon: RiDownloadLine,
      },
      {
        title: 'Components',
        text: 'Every component, with examples.',
        href: '/components',
        icon: RiLayoutGridLine,
      },
      {
        title: 'Theming',
        text: 'Rebrand through the token ramps.',
        href: '/docs/theming',
        icon: RiPaletteLine,
      },
    ],
  },
  {
    label: 'For agents',
    rows: [
      {
        title: 'Working with AI',
        text: 'Specs and skills agents can read.',
        href: '/docs/ai',
        icon: RiSparkling2Line,
      },
      {
        title: 'llms.txt',
        text: 'The docs as one plain-text index.',
        href: '/llms.txt',
        icon: RiFileTextLine,
      },
    ],
  },
];

/** The bar's text links, as the website's navbar: 14px, no underline; the current page strong. */
const NAV_LINK =
  'rounded-ws-control-sm typography-label-strong-sm whitespace-nowrap no-underline outline-ws-dynamic-primary-strong-default transition-colors focus-visible:wds-focus-visible';
const tone = (active: boolean) =>
  active ? 'text-ws-static-strong' : 'text-ws-static-subtle hover:text-ws-static-strong';

/**
 * The Docs item: a real link to the docs' first page, with a menu as an extra (Popup: Escape and
 * outside clicks are the library's). The menu opens on hover and on keyboard focus, never on a
 * click or a tap, which navigate; ArrowDown moves into it. 16px around, two columns of rows; a
 * row is a rounded block with its own padding, so its hover never touches the panel's edge.
 */
const DocsMenu = ({ active }: { active: boolean }) => {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panel = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const show = (next: boolean) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), next ? 80 : 160);
  };
  return (
    // Only closing comes from the library (Escape, a click outside): a click on the link goes to
    // the page, it does not toggle the menu.
    <Popup open={open} onOpenChange={(next) => !next && setOpen(false)}>
      <Popup.Trigger asChild>
        <a
          ref={link}
          href="/docs/introduction"
          aria-current={active ? 'page' : undefined}
          onPointerEnter={(event) => event.pointerType === 'mouse' && show(true)}
          onPointerLeave={() => show(false)}
          onFocus={(event) => event.currentTarget.matches(':focus-visible') && show(true)}
          onBlur={() => show(false)}
          onKeyDown={(event) => {
            if (event.key !== 'ArrowDown') return;
            event.preventDefault();
            clearTimeout(timer.current);
            setOpen(true);
            setTimeout(() => panel.current?.querySelector('a')?.focus(), 50);
          }}
          className={cn(NAV_LINK, tone(active || open))}
        >
          Docs
        </a>
      </Popup.Trigger>
      <Popup.Container
        ref={panel}
        align="start"
        sideOffset={12}
        aria-label="Docs"
        // Focus stays on the link: the menu is an extra, entered with ArrowDown.
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        // Escape from inside the menu gives the focus back to the link, which must not reopen it.
        onEscapeKeyDown={() => {
          if (!panel.current?.contains(document.activeElement)) return;
          link.current?.focus();
          clearTimeout(timer.current);
        }}
        onPointerEnter={() => show(true)}
        onPointerLeave={() => show(false)}
        onFocus={() => show(true)}
        onBlur={() => show(false)}
        className="grid w-[38rem] max-w-[calc(100vw-2rem)] grid-cols-2 gap-ws-9 border border-ws-static-subtle p-ws-9 shadow-ws-medium"
      >
        {DOCS_MENU.map((column) => (
          <div key={column.label} className="flex flex-col gap-ws-3">
            <p className="px-ws-5 pb-ws-2 typography-caption-md text-ws-static-subtle">
              {column.label}
            </p>
            {column.rows.map((row) => (
              <a
                key={row.href}
                href={row.href}
                className="flex items-start gap-ws-6 rounded-ws-control-lg p-ws-5 no-underline outline-ws-dynamic-primary-strong-default transition-colors hover:bg-ws-static-alpha-subtle focus-visible:wds-focus-visible"
              >
                <span className="grid size-ws-14 shrink-0 place-items-center rounded-ws-control-md border border-ws-static-subtle text-ws-static-base">
                  <row.icon className="size-ws-9" aria-hidden="true" />
                </span>
                <span className="flex min-w-0 flex-col gap-ws-2">
                  <span className="typography-label-strong-sm text-ws-static-strong">
                    {row.title}
                  </span>
                  <span className="typography-body-sm text-ws-static-subtle">{row.text}</span>
                </span>
              </a>
            ))}
          </div>
        ))}
      </Popup.Container>
    </Popup>
  );
};

/**
 * The top bar after the logo, as the website's navbar: the pages as plain text links at the left
 * (Docs opens its menu), and at the right GitHub (icon and text), the theme and "Get started".
 * The one search palette lives here with no trigger of its own: ⌘K opens it.
 */
export const TopNav = ({
  area,
  items,
  github,
}: {
  area: string;
  items: SearchItem[];
  github: string;
}) => (
  <>
    <nav aria-label="Pages" className="ml-ws-14 hidden items-center gap-ws-11 lg:flex">
      <DocsMenu active={area === 'docs'} />
      {[
        { id: 'components', label: 'Components', href: '/components' },
        { id: 'blocks', label: 'Blocks', href: '/blocks' },
        { id: 'playground', label: 'Playground', href: '/docs/playground' },
      ].map((page) => (
        <a
          key={page.id}
          href={page.href}
          aria-current={page.id === area ? 'page' : undefined}
          className={cn(NAV_LINK, tone(page.id === area))}
        >
          {page.label}
        </a>
      ))}
    </nav>
    <div className="ml-auto flex items-center gap-ws-10">
      <SearchPalette items={items} />
      <a
        href={github}
        target="_blank"
        rel="noreferrer"
        className={cn(
          NAV_LINK,
          'hidden items-center gap-ws-5 text-ws-static-strong hover:underline sm:flex',
        )}
      >
        <RiGithubLine className="size-ws-11" aria-hidden="true" />
        GitHub
      </a>
      <ThemeToggle />
      <a
        href="/docs/installation"
        className={cn(NAV_LINK, 'hidden text-ws-static-strong hover:underline sm:block')}
      >
        Get started
      </a>
      <MenuButton />
    </div>
  </>
);

/**
 * The narrow window's menu button. Open, the menu takes the focus and the page behind it is
 * hidden from focus (docs.css); Escape closes it and gives the focus back to the button.
 */
const MenuButton = () => {
  const button = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const sync = new MutationObserver(() => setOpen(root.hasAttribute('data-docs-menu')));
    sync.observe(root, { attributes: true, attributeFilter: ['data-docs-menu'] });
    return () => sync.disconnect();
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const root = document.documentElement;
      if (event.key !== 'Escape' || !root.hasAttribute('data-docs-menu')) return;
      root.removeAttribute('data-docs-menu');
      button.current?.focus();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);
  return (
    <IconButton
      ref={button}
      icon={RiMenuLine}
      size="sm"
      preset="ghost"
      variant="secondary"
      aria-label="Menu"
      aria-controls="docs-menu"
      aria-expanded={open}
      className="lg:hidden"
      onClick={() => {
        if (document.documentElement.toggleAttribute('data-docs-menu'))
          document.querySelector<HTMLElement>('#docs-menu a')?.focus();
      }}
    />
  );
};

/**
 * A component or block page's tabs. The panels are the page's own HTML (`data-tab-panel`),
 * shown by `html[data-tab]` (docs.css), which the page sets from the address before first paint;
 * this row keeps the two in step. The tab is in the address (`?tab=anatomy`; the first tab has
 * none), so Back and Forward move between tabs and a tab can be linked.
 */
export const PageTabs = ({ tabs }: { tabs: { id: string; label: string }[] }) => {
  const first = tabs[0].id;
  const [value, setValue] = useState(first);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const show = (id: string) => {
      if (id === first) delete document.documentElement.dataset.tab;
      else document.documentElement.dataset.tab = id;
      setValue(id);
      // The rails read the sections in view.
      window.dispatchEvent(new Event('scroll'));
    };
    const sync = () => {
      const asked = new URLSearchParams(location.search).get('tab');
      show(tabs.some((tab) => tab.id === asked) ? asked! : first);
    };
    sync();
    setReady(true);
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
    // `tabs` is the page's constant list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const pick = (id: string) => {
    if (id === value) return;
    // A tab's own address (a block's `?file=`) does not follow it to another tab.
    const url = new URL(location.pathname, location.href);
    if (id !== first) url.searchParams.set('tab', id);
    history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  return (
    <div className="docs-page-tabs mb-ws-14" data-ready={ready ? '' : undefined}>
      <Tabs value={value} onValueChange={pick} size="sm" divider={false}>
        <TabRow selected={value}>
          <Tabs.List aria-label="Sections of this page" className="min-w-full">
            {tabs.map((tab) => (
              <Tabs.Item
                key={tab.id}
                value={tab.id}
                id={`tab-${tab.id}`}
                aria-controls={`panel-${tab.id}`}
              >
                <Tabs.Label>{tab.label}</Tabs.Label>
              </Tabs.Item>
            ))}
          </Tabs.List>
        </TabRow>
      </Tabs>
    </div>
  );
};

/**
 * "On this page": the label, then the sections on a vertical line; the section in view lays a
 * solid segment on the line. Nested rows are indented. A section counts once its top passes the
 * upper quarter of the window; at the very end the last one does.
 */
export const Rail = ({ items }: { items: { id: string; label: string; indent?: boolean }[] }) => {
  const [current, setCurrent] = useState(items[0]?.id);
  const labelId = useId();
  useEffect(() => {
    const update = () => {
      const shown = items.flatMap(({ id }) => {
        const heading = document.getElementById(id);
        return heading?.getClientRects().length ? [heading] : [];
      });
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const anchor = shown.find((heading) => location.hash === `#${heading.id}`);
      if (anchor) {
        const offset = parseFloat(getComputedStyle(anchor).scrollMarginTop) || 0;
        const top = scrollY + anchor.getBoundingClientRect().top - offset;
        // A heading near the end may be unable to reach the usual offset.
        if (Math.abs(scrollY - Math.max(0, Math.min(top, maxScroll))) <= 2) {
          setCurrent(anchor.id);
          return;
        }
      }
      const atEnd = scrollY > 0 && scrollY >= maxScroll - 1;
      const passed = shown.filter(
        (heading) => heading.getBoundingClientRect().top <= innerHeight / 4,
      );
      setCurrent((atEnd ? shown.at(-1) : passed.at(-1))?.id ?? shown[0]?.id);
    };
    update();
    addEventListener('scroll', update, { passive: true });
    addEventListener('hashchange', update);
    return () => {
      removeEventListener('scroll', update);
      removeEventListener('hashchange', update);
    };
  }, [items]);
  return (
    <nav aria-labelledby={labelId} className="flex flex-col gap-ws-7">
      <p id={labelId} className="typography-label-sm text-ws-static-subtle">
        On this page
      </p>
      <ul className="flex flex-col border-l border-ws-static-subtle">
        {items.map(({ id, label, indent }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={id === current ? 'location' : undefined}
              className={cn(
                'relative -ml-px block border-l-2 py-ws-3 text-[0.8125rem] leading-ws-500 outline-ws-dynamic-primary-strong-default transition-colors focus-visible:wds-focus-visible',
                indent ? 'pl-ws-11' : 'pl-ws-7',
                id === current
                  ? 'border-ws-static-strong text-ws-static-strong'
                  : 'border-transparent text-ws-static-subtle hover:text-ws-static-strong',
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

/**
 * A linked crumb: no tint on hover or press (the rest ground stays); its text goes from subtle to
 * strong on the quick motion clock. The library's focus ring stays; the current page (the last
 * crumb) is the library's own, untouched. Docs-side until Breadcrumbs has a link variant.
 */
const CRUMB_LINK =
  'hover:bg-ws-dynamic-secondary-alpha-default focus-visible:bg-ws-dynamic-secondary-alpha-default active:bg-ws-dynamic-secondary-alpha-default hover:text-ws-static-strong active:text-ws-static-strong transition-colors duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out)';

export const Crumbs = ({
  crumbs,
  title,
}: {
  crumbs: { label: string; href: string }[];
  title: string;
}) => (
  <Breadcrumbs separator="arrow" className="min-w-0 overflow-hidden">
    {crumbs.map((crumb) => (
      <Breadcrumbs.Item key={crumb.href} asChild className={CRUMB_LINK}>
        <a href={crumb.href}>{crumb.label}</a>
      </Breadcrumbs.Item>
    ))}
    <Breadcrumbs.Item>{title}</Breadcrumbs.Item>
  </Breadcrumbs>
);

/**
 * The MDX pages' code (Markdown fences, rendered on the server) gets the code block's copy
 * button: each `pre` is wrapped once and the button portalled into its top-right corner.
 */
export const ProseCopy = () => {
  const [slots, setSlots] = useState<{ pre: HTMLElement; slot: HTMLElement }[]>([]);
  useEffect(() => {
    setSlots(
      [...document.querySelectorAll<HTMLElement>('.docs-prose pre:not(.docs-code pre)')].map(
        (pre) => {
          const wrap = document.createElement('div');
          wrap.className = 'docs-prose-pre relative';
          pre.before(wrap);
          wrap.append(pre);
          const slot = document.createElement('div');
          slot.className = 'absolute top-ws-4 right-ws-4';
          wrap.append(slot);
          return { pre, slot };
        },
      ),
    );
  }, []);
  return slots.map(({ pre, slot }) => createPortal(<CopyIcon text={() => pre.innerText} />, slot));
};
