import { RiSideBarLine } from '@remixicon/react';
import {
  AppShell,
  Breadcrumbs,
  Button,
  cn,
  IconButton,
  InlineAlert,
  ToastProvider,
  useToast,
} from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { channels, initialDraft, type ProductDraft, type Status } from './data';
import { DetailsSection } from './details-section';
import { listSentence } from './format';
import { InventorySection } from './inventory-section';
import { ListPreview } from './list-preview';
import { MediaSection } from './media-section';
import { OptionsSection } from './options-section';
import { PageHeader } from './page-header';
import { PricingSection } from './pricing-section';
import { ProductStatus } from './product-status';
import { SalesChannels } from './sales-channels';
import { SaveBar } from './save-bar';
import { ProductFormSidebar } from './sidebar';
import { type ErrorField, MISSING, validate } from './validate';

/** The two ways to lay the form out: beside its status and preview, or alone in the middle. */
export type ProductFormLayout = 'split' | 'centered';

/**
 * The page's column per layout: the header and the body share its edges. Centred, it narrows to
 * a 42rem form (46rem less its padding), a comfortable line for labels and fields.
 */
const COLUMN: Record<ProductFormLayout, string> = {
  split: 'px-ws-14 mx-auto w-full max-w-[80rem]',
  centered: 'px-ws-14 mx-auto w-full max-w-[46rem]',
};

/** The order a failed save looks for its first field in: the order of the page. */
const FIELD_ORDER = Object.keys(MISSING) as ErrorField[];

/** What the header's line says about where the product stands. */
function standing(saved: boolean, status: Status, channelIds: string[]) {
  if (!saved) return 'Add something Lumen Studio sells. It goes on sale once it is published.';
  if (status === 'draft') return 'A draft: only your team can see it until it is published.';
  const names = channels.filter((c) => channelIds.includes(c.id)).map((c) => c.label);
  return names.length
    ? `On sale in ${listSentence(names)}.`
    : 'Published, but in no sales channel yet.';
}

/**
 * The page inside the toast provider. Split: the form's sections down the left, its status, where
 * it sells and how it looks in a list beside it, the actions in the header. Centred: the same
 * sections and where it sells in one column, the actions in a bar at the card's foot. The screen
 * holds the draft, so the preview, the margin and the variants follow every keystroke; errors
 * wait for the first try at saving, then follow what is typed.
 */
function ProductFormPage({ layout, collapsed, onToggleSidebar, sidebarId }: PageProps) {
  const { showToast } = useToast();
  const id = useId();
  const formId = `${id}-form`;

  const [draft, setDraft] = useState(initialDraft);
  const [status, setStatus] = useState<Status>('draft');
  /** The name it was last saved under: the page's title from then on. */
  const [savedName, setSavedName] = useState<string | null>(null);
  /** The save that was tried and stopped at a field; its checks then follow the typing. */
  const [attempt, setAttempt] = useState<'draft' | 'publish' | null>(null);
  const [pending, setPending] = useState<'draft' | 'publish' | null>(null);

  const errors = attempt ? validate(draft, attempt === 'publish') : {};
  const missing = FIELD_ORDER.filter((field) => errors[field]);
  const update = (patch: Partial<ProductDraft>) => setDraft({ ...draft, ...patch });

  // Cleared on unmount, so the stand-in request never lands on a closed screen.
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // A timeout stands in for the request; a real screen awaits it and, when it fails, keeps every
  // field as it was and says so in an InlineAlert above the form.
  function save(publishing: boolean) {
    const found = validate(draft, publishing);
    const first = FIELD_ORDER.find((field) => found[field]);
    setAttempt(publishing ? 'publish' : 'draft');
    if (first) return document.getElementById(`${id}-${first}`)?.focus();

    const name = draft.name.trim();
    setPending(publishing ? 'publish' : 'draft');
    timer.current = window.setTimeout(() => {
      setPending(null);
      setAttempt(null);
      setSavedName(name);
      setStatus(publishing ? 'active' : 'draft');
      showToast({
        status: 'success',
        content: !publishing
          ? 'Draft saved'
          : status === 'active'
            ? 'Changes saved'
            : `${name} is on sale`,
      });
    }, 700);
  }

  function changeStatus(next: Status) {
    if (next === 'active') return save(true);
    setStatus('draft');
    if (savedName) showToast({ content: `${savedName} is a draft again` });
  }

  const title = savedName ?? 'New product';
  const centered = layout === 'centered';
  const busy = pending !== null;

  const saveDraft = status === 'draft' && (
    <Button
      size="sm"
      variant="secondary"
      preset="border"
      disabled={busy}
      onClick={() => save(false)}
    >
      {pending === 'draft' ? 'Saving…' : 'Save draft'}
    </Button>
  );
  const publish = (
    <Button size="sm" type="submit" form={formId} disabled={busy}>
      {pending === 'publish'
        ? status === 'active'
          ? 'Saving…'
          : 'Publishing…'
        : status === 'active'
          ? 'Save changes'
          : 'Publish'}
    </Button>
  );
  const salesChannels = (
    <SalesChannels
      selected={draft.channels}
      onChange={(selected) => update({ channels: selected })}
    />
  );

  // Both layouts share this form: the alert, then one card a section, in the order it is filled.
  const form = (
    <form
      id={formId}
      noValidate
      aria-label="Product"
      onSubmit={(event) => {
        event.preventDefault();
        save(true);
      }}
      className="gap-ws-12 flex flex-col"
    >
      {missing.length > 0 && (
        <InlineAlert
          status="error"
          persistent
          title={attempt === 'publish' ? 'Can’t publish yet' : 'Can’t save the draft yet'}
          message={`Add ${listSentence(missing.map((field) => MISSING[field]))}.`}
        />
      )}
      <DetailsSection id={id} draft={draft} errors={errors} onChange={update} />
      <MediaSection id={id} photos={draft.photos} errors={errors} onChange={update} />
      <PricingSection id={id} draft={draft} errors={errors} onChange={update} />
      <OptionsSection id={id} draft={draft} onChange={update} />
      <InventorySection id={id} draft={draft} onChange={update} />
      {/* Centred, where it sells is the last thing to decide before publishing. */}
      {centered && salesChannels}
    </form>
  );

  return (
    <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
        {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
            left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
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
            onClick={onToggleSidebar}
            className="-ml-ws-5"
          />
          <Breadcrumbs separator="arrow">
            <Breadcrumbs.Item asChild>
              <a href="#catalogue">Catalogue</a>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>{title}</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>
      </div>

      {/* The page scrolls inside the card, so the card's corners stay put. `relative` keeps the
          hidden form inputs Select and Checkbox render (absolute) inside it: without it they
          escape and make the window scroll. */}
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className={cn(COLUMN[layout], 'gap-ws-14 pt-ws-14 pb-ws-16 flex flex-col')}>
          <PageHeader
            title={title}
            status={savedName ? status : undefined}
            description={standing(Boolean(savedName), status, draft.channels)}
          >
            {!centered && (
              <>
                {saveDraft}
                {publish}
              </>
            )}
          </PageHeader>

          {centered ? (
            form
          ) : (
            <div className="gap-ws-16 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,44rem)_20rem] lg:justify-between">
              {form}
              <aside
                aria-label="Status and preview"
                className="gap-ws-12 lg:top-ws-14 flex flex-col lg:sticky"
              >
                <ProductStatus status={status} onStatusChange={changeStatus} />
                {salesChannels}
                <ListPreview draft={draft} />
              </aside>
            </div>
          )}
        </div>
      </div>

      {/* Centred, the actions leave the header for a bar pinned to the card's foot, in view down
          the whole form. With no status card here, a product on sale is unpublished from it. */}
      {centered && (
        <SaveBar column={COLUMN.centered}>
          <Button size="sm" variant="secondary" preset="ghost" asChild>
            <a href="#catalogue">Cancel</a>
          </Button>
          {saveDraft || (
            <Button
              size="sm"
              variant="secondary"
              preset="border"
              disabled={busy}
              onClick={() => changeStatus('draft')}
            >
              Unpublish
            </Button>
          )}
          {publish}
        </SaveBar>
      )}
    </main>
  );
}

type PageProps = {
  layout: ProductFormLayout;
  collapsed: boolean;
  onToggleSidebar: () => void;
  sidebarId: string;
};

/**
 * Product form (Inset direction): adding a product to the catalogue on the raised page beside the
 * workspace sidebar. The form is a stack of cards in the order it is filled (details, media,
 * pricing, options, inventory). `split` (the default) keeps its status, where it sells and a
 * preview of its catalogue card in view beside it, the actions in the header; `centered` puts the
 * form alone in the middle with where it sells last, the actions in a bar at the card's foot.
 * Save draft keeps it to the team; Publish, the page's one filled button, checks what a customer
 * needs and puts it on sale.
 */
export default function ProductForm({ layout = 'split' }: { layout?: ProductFormLayout }) {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  // Centred, the save bar holds the foot of the card, so confirmations come in at the top right,
  // over the empty end of the bar above the page.
  return (
    <ToastProvider position={layout === 'centered' ? 'top-right' : 'bottom-center'}>
      <AppShell direction="inset">
        <ProductFormSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <ProductFormPage
          layout={layout}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          sidebarId={sidebarId}
        />
      </AppShell>
    </ToastProvider>
  );
}
