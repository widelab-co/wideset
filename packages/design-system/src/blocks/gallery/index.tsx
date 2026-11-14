import { RiArrowLeftLine, RiSideBarLine } from '@remixicon/react';
import {
  AppShell,
  Breadcrumbs,
  Button,
  cn,
  IconButton,
  Select,
  Tabs,
  Toast,
  ToastProvider,
  useToast,
} from '@wideset/react';
import { useId, useRef, useState } from 'react';

import { CollectionCard } from './collection-card';
import {
  ADDED,
  CATEGORIES,
  type Category,
  type Collection,
  COLLECTIONS,
  makerName,
  ME,
  SAVED,
  type SortKey,
  sortOptions,
  TEMPLATES,
  workspace,
} from './data';
import { EmptyState } from './empty-state';
import { NameDialog } from './name-dialog';
import { PageHeader } from './page-header';
import { Section } from './section';
import { GallerySidebar } from './sidebar';
import { TemplateCard } from './template-card';
import { TemplatePanel } from './template-panel';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
/** As many columns as fit a card: the sidebar opens and closes, so the window says little. */
const GRID = 'gap-ws-7 grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]';

const byId = (id: string) => TEMPLATES.find((template) => template.id === id)!;

/**
 * The library inside the card, under the toasts. It holds what is saved, what is added and the
 * collections, so a save on a card and in the detail are the same toggle, and the detail's Add
 * marks the card too.
 */
function GalleryPage() {
  const { showToast, dismissToast } = useToast();
  const opened = useRef(0);
  const [category, setCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('popular');
  const [collectionId, setCollectionId] = useState<string>();
  const [saved, setSaved] = useState(SAVED);
  const [added, setAdded] = useState(ADDED);
  const [collections, setCollections] = useState(COLLECTIONS);
  // The template stays while the panel slides out, so its words do not vanish under it.
  const [panel, setPanel] = useState<{ id: string; open: boolean }>();
  const [naming, setNaming] = useState<{ key: number; open: boolean; templateId: string }>();

  const collection = collections.find((entry) => entry.id === collectionId);
  const search = query.trim().toLowerCase();
  const shown = TEMPLATES.filter(
    (template) =>
      (category === 'all' ||
        (category === 'saved' ? saved.includes(template.id) : template.kind === category)) &&
      (!collection || collection.templates.includes(template.id)) &&
      `${template.name} ${template.summary}`.toLowerCase().includes(search),
  ).sort((a, b) =>
    sort === 'popular' ? b.teams - a.teams : b.published.localeCompare(a.published),
  );
  const featured = category === 'all' && !search && !collection;
  const categoryLabel = CATEGORIES.find((entry) => entry.value === category)!.label;

  const setSavedOne = (id: string, on: boolean) =>
    setSaved((all) => (on ? [...all, id] : all.filter((item) => item !== id)));

  /** Puts a template in one of your collections, or takes it out; Undo reverses either. */
  const toggleInCollection = (target: Collection, templateId: string) => {
    const before = collections;
    const inside = target.templates.includes(templateId);
    setCollections((all) =>
      all.map((entry) =>
        entry.id !== target.id
          ? entry
          : {
              ...entry,
              templates: inside
                ? entry.templates.filter((id) => id !== templateId)
                : [...entry.templates, templateId],
            },
      ),
    );
    const toastId = showToast({
      content: `${inside ? 'Removed from' : 'Added to'} ${target.name}`,
      action: (
        <Toast.Action
          preset="ghost"
          onClick={() => {
            setCollections(before);
            dismissToast(toastId);
          }}
        >
          Undo
        </Toast.Action>
      ),
    });
  };

  const openCollection = (id: string) => {
    setCollectionId(id);
    setCategory('all');
    setQuery('');
  };

  const panelTemplate = panel && byId(panel.id);

  let results;
  if (shown.length > 0) {
    results = (
      <ul aria-label="Templates" className={GRID}>
        {shown.map((template) => (
          <li key={template.id} className="flex">
            <TemplateCard
              template={template}
              saved={saved.includes(template.id)}
              added={added.includes(template.id)}
              onOpen={() => setPanel({ id: template.id, open: true })}
              onSaveChange={(on) => setSavedOne(template.id, on)}
            />
          </li>
        ))}
      </ul>
    );
  } else if (search) {
    results = (
      <EmptyState
        title={`No templates match “${query.trim()}”`}
        description={
          category === 'all' && !collection
            ? 'Check the spelling, or search for what the template does: “renewal”, “forecast”.'
            : `Nothing in ${collection?.name ?? categoryLabel} matches. Search every template instead.`
        }
      >
        <Button
          size="sm"
          variant="secondary"
          preset="border"
          onClick={() => {
            if (category === 'all' && !collection) return setQuery('');
            setCategory('all');
            setCollectionId(undefined);
          }}
        >
          {category === 'all' && !collection ? 'Clear search' : 'Search all templates'}
        </Button>
      </EmptyState>
    );
  } else {
    results = (
      <EmptyState
        title="Nothing saved yet"
        description="Save a template with its bookmark to keep it here while you decide."
      />
    );
  }

  return (
    <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
      <PageHeader query={query} onQueryChange={setQuery} />

      {/* The categories and the sort share one line; the tabs' indicator sits on it. */}
      <div className="border-ws-static-subtle gap-ws-9 flex items-end justify-between border-b">
        <Tabs
          value={category}
          onValueChange={(value) => setCategory(value as Category)}
          divider={false}
          className="min-w-0 overflow-x-auto"
        >
          <Tabs.List aria-label="Categories">
            {CATEGORIES.map((entry) => (
              <Tabs.Item key={entry.value} value={entry.value}>
                <Tabs.Label>{entry.label}</Tabs.Label>
              </Tabs.Item>
            ))}
          </Tabs.List>
        </Tabs>
        <Select
          size="sm"
          preset="border"
          aria-label="Sort templates"
          options={sortOptions}
          value={sort}
          onValueChange={(value) => setSort(value as SortKey)}
          className="mb-ws-4 w-auto shrink-0"
        />
      </div>

      {collection && (
        <div className="gap-ws-7 flex flex-col items-start">
          <Button
            size="sm"
            variant="secondary"
            preset="ghost"
            onClick={() => setCollectionId(undefined)}
            className="-ml-ws-5"
          >
            <Button.Icon icon={RiArrowLeftLine} />
            All templates
          </Button>
          <div className="gap-ws-2 flex flex-col">
            <h2 className="typography-subtitle-xs text-ws-static-strong">{collection.name}</h2>
            <p className="typography-body-md text-ws-static-base">{collection.description}</p>
            <p className="typography-caption-md text-ws-static-subtle">
              By {makerName(collection.by)}
            </p>
          </div>
        </div>
      )}

      {featured ? (
        <div className="gap-ws-16 flex flex-col">
          <Section title="Collections">
            <ul
              aria-label="Collections"
              className="gap-ws-7 grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]"
            >
              {collections.map((entry) => (
                <li key={entry.id} className="flex">
                  <CollectionCard
                    collection={entry}
                    templates={entry.templates.map(byId)}
                    onOpen={() => openCollection(entry.id)}
                  />
                </li>
              ))}
            </ul>
          </Section>
          <Section title="All templates">{results}</Section>
        </div>
      ) : (
        <div className={cn(shown.length === 0 && 'py-ws-20')}>{results}</div>
      )}

      {panel && panelTemplate && (
        <TemplatePanel
          template={panelTemplate}
          saved={saved.includes(panelTemplate.id)}
          added={added.includes(panelTemplate.id)}
          collections={collections.filter((entry) => entry.by === ME)}
          open={panel.open}
          onOpenChange={(open) => setPanel({ ...panel, open })}
          onSaveChange={(on) => setSavedOne(panelTemplate.id, on)}
          onAdd={() => setAdded((all) => [...all, panelTemplate.id])}
          onToggleCollection={(target) => toggleInCollection(target, panelTemplate.id)}
          quiet={naming?.open}
          onNewCollection={() =>
            setNaming({ key: ++opened.current, open: true, templateId: panelTemplate.id })
          }
        />
      )}

      {naming && (
        <NameDialog
          key={naming.key}
          title="New collection"
          description={`Start a collection with ${byId(naming.templateId).name}. Anyone in ${workspace.name} can browse it.`}
          label="Name"
          initial=""
          submit="Create collection"
          taken={collections.map((entry) => entry.name)}
          open={naming.open}
          onOpenChange={(open) => setNaming({ ...naming, open })}
          onSubmit={(name) => {
            const id = `${name.toLowerCase().replace(/\W+/g, '-')}-${collections.length}`;
            setCollections((all) => [
              ...all,
              {
                id,
                name,
                description: `Made by ${makerName(ME)}.`,
                by: ME,
                templates: [naming.templateId],
              },
            ]);
            showToast({ status: 'success', content: `Created ${name}` });
          }}
        />
      )}
    </div>
  );
}

/**
 * Gallery (Inset direction): Orbit's template library on the raised page beside the workspace
 * sidebar. A search in the header, the categories as tabs with the sort beside them, the
 * collections first and every template as a card under them. A card opens its detail in a side
 * panel, where Add to workspace is the screen's one filled button; saving works from both.
 */
export default function Gallery() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <AppShell direction="inset">
        <GallerySidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <AppShell.Main>
          <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
            {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is
                pulled left so its glyph, not its box, sits 20px from the edge; the crumbs follow
                it. */}
            <div className="gap-ws-5 px-ws-11 flex w-full items-center">
              <IconButton
                icon={RiSideBarLine}
                variant="secondary"
                preset="ghost"
                size="sm"
                iconClassName="text-ws-static-subtle size-ws-9"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                aria-expanded={!collapsed}
                aria-controls={sidebarId}
                onClick={() => setCollapsed(!collapsed)}
                className="-ml-ws-5"
              />
              <Breadcrumbs separator="arrow">
                <Breadcrumbs.Item>Templates</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          {/* The page scrolls inside the card, so the card's corners stay put. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <GalleryPage />
          </div>
        </AppShell.Main>
      </AppShell>
    </ToastProvider>
  );
}
