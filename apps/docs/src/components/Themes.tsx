import {
  RiAddLine,
  RiArchiveLine,
  RiBarChartBoxLine,
  RiCheckLine,
  RiCodeSSlashLine,
  RiDashboardLine,
  RiFileCopyLine,
  RiInboxLine,
  RiMailLine,
  RiNotification3Line,
  RiSearchLine,
  RiSideBarLine,
} from '@remixicon/react';
import {
  Button,
  Card,
  cn,
  IconButton,
  Modal,
  ProgressBar,
  SegmentedControl,
  StatusBadge,
  Table,
  Tabs,
  TextInput,
  Tooltip,
} from '@wideset/react';
import {
  createContext,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { highlight } from '../lib/highlight';
import { LADDERS, type Radius, STEPS } from '../lib/radius';
import { isDark, loadAppearance, onAppearanceChange } from '../lib/theme';
import { useCopy } from './parts';
import { WidesetWordmark } from './Wordmark';

/**
 * The Themes page, after the website's "Customization" section: brand presets with "Get code" (the
 * CSS to export, in a dialog), a compact Customize row for manual tweaks, then cards that all take
 * the choice on (Foundation, Logo & identity, Components, Assets, and a whole product screen).
 * Every card's content is its own scope: the light
 * (`.docs-light`) or dark (`.dark`) tokens re-declared on it under the primitive overrides, so
 * nothing outside the cards changes.
 */
type Mode = 'light' | 'dark';
type Preset = {
  id: string;
  label: string;
  /** The primary colour (brand 600): a hex, or `brand` for Wideset's own ramp. */
  brand: string;
  /** Steps the design names beside the primary. */
  ramp?: Record<number, string>;
  /** In dark mode, a brand whose primary is near black turns it over. */
  darkBrand?: string;
  /** Named steps of the dark ramp, when `darkBrand` draws it. */
  darkRamp?: Record<number, string>;
  /** Text on the primary, when white does not read on it. */
  onPrimary?: { light?: string; dark?: string };
  radius: Radius;
  /** The brand's typeface as the design names it, and the family the page can load for it. */
  font: string;
  stack?: string;
  /**
   * The typeface is proprietary: the site ships no file for it. The stack names it first, so it
   * draws where the viewer has it installed, and Inter stands in everywhere else.
   */
  licensed?: boolean;
};
/** The stack's tail for a licensed font: the docs' own Inter, as the page loads it. */
const INTER = "'Inter Variable', ui-sans-serif, system-ui, sans-serif";
/**
 * The presets, as the design draws them. Fonts: Inter and Poppins are open and load; UberMove
 * and Apercu are proprietary, so the page names them and draws them only where they are
 * installed (the design itself draws their "Aa" in Inter).
 */
const PRESETS: Preset[] = [
  { id: 'wideset', label: 'Wideset', brand: 'brand', radius: 'default', font: 'Inter' },
  {
    id: 'uber',
    label: 'Uber',
    brand: '#000000',
    ramp: { 500: '#276ef1', 200: '#ffffff' },
    darkBrand: '#ffffff',
    // Dark step 200 stays the generated light one: dark mode draws primary text with it.
    darkRamp: { 500: '#276ef1' },
    onPrimary: { dark: '#000000' },
    radius: 'default',
    font: 'UberMove',
    stack: `'Uber Move', 'UberMove', ${INTER}`,
    licensed: true,
  },
  {
    id: 'lime',
    label: 'Lime',
    brand: '#00dd00',
    onPrimary: { light: '#000000', dark: '#000000' },
    radius: 'round',
    font: 'Poppins',
    stack: "'Poppins', ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: 'headspace',
    label: 'Headspace',
    brand: '#0061ef',
    radius: 'round',
    font: 'Apercu',
    stack: `'Apercu', 'Apercu Pro', ${INTER}`,
    licensed: true,
  },
];

type Theme = {
  /** The preset last picked: its font and name stay while the colour or the corners change. */
  preset: string;
  /** The brand colour: `null` for the preset's own (with the steps it names), else a system ramp or a hex. */
  brand: string | null;
  radius: Radius;
  mode: Mode;
};

const RAMP = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100];
/** Ramps the system already has, offered as brand colours; `brand` is Wideset's own. */
const SYSTEM = ['brand', 'blue', 'violet', 'teal', 'green', 'orange', 'pink'];
/** A colour as a ramp around it: lighter steps mix in white, darker ones black. */
const MIX: Record<number, string> = {
  100: 'white 90%',
  200: 'white 80%',
  300: 'white 65%',
  400: 'white 45%',
  500: 'white 22%',
  700: 'black 18%',
  800: 'black 34%',
  900: 'black 50%',
  1000: 'black 62%',
  1100: 'black 72%',
};
const rampOf = (brand: string, mode: Mode, step: number) =>
  brand.startsWith('#')
    ? step === 600
      ? brand
      : `color-mix(in oklab, ${brand}, ${MIX[step]})`
    : `var(--ws-colors-${mode}-${brand}-${step})`;
const KINDS = ['control', 'container'] as const;
const RADII: { value: Radius; label: string }[] = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'default', label: 'Default' },
  { value: 'round', label: 'Round' },
];

/** A `#rrggbb` colour as linear sRGB. */
const linearOf = (hex: string) =>
  [1, 3, 5]
    .map((at) => parseInt(hex.slice(at, at + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
/** Relative luminance (WCAG) of linear sRGB. */
const luminanceOf = ([r, g, b]: number[]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
/** The WCAG contrast ratio of two luminances. */
const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
/** White text on a `#rrggbb` ground: the WCAG contrast ratio. */
const contrastWithWhite = (hex: string) => contrast(luminanceOf(linearOf(hex)), 1);

/** Linear sRGB to Oklab and back (Björn Ottosson's matrices), to work out a `color-mix(in oklab)`. */
const toOklab = ([r, g, b]: number[]) => {
  const [l, m, s] = [
    0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b,
    0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
    0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b,
  ].map(Math.cbrt);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const fromOklab = ([L, a, b]: number[]) => {
  const [l, m, s] = [
    L + 0.3963377774 * a + 0.2158037573 * b,
    L - 0.1055613458 * a - 0.0638541728 * b,
    L - 0.0894841775 * a - 1.291485548 * b,
  ].map((value) => value ** 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0004196086 * l - 0.7034186147 * m + 1.707628274 * s,
  ].map((value) => Math.min(1, Math.max(0, value)));
};
/** A step of a hex colour's generated ramp (`rampOf`) as linear sRGB, as the browser mixes it. */
const stepOf = (hex: string, step: number) => {
  const base = linearOf(hex);
  if (step === 600) return base;
  const [ink, percent] = MIX[step].split(' ');
  const amount = parseFloat(percent) / 100;
  const [from, to] = [toOklab(base), toOklab(ink === 'white' ? [1, 1, 1] : [0, 0, 0])];
  return fromOklab(from.map((value, index) => value * (1 - amount) + to[index] * amount));
};
/**
 * How many steps darker a system ramp is taken in light mode, so the primary button (step 600,
 * white text) keeps 4.5:1: Wideset's green, teal and orange are lighter at 600 than its brand.
 */
const shiftOf = (brand: string, resolved: Record<string, string>) => {
  if (brand === 'brand' || brand.startsWith('#')) return 0;
  for (let shift = 0; shift < 3; shift++) {
    const value = resolved[`--ws-colors-light-${brand}-${600 + shift * 100}`];
    if (!/^#[0-9a-f]{6}$/i.test(value ?? '') || contrastWithWhite(value) >= 4.5) return shift;
  }
  return 3;
};

type State = 'default' | 'hover' | 'pressed';
const STATES: State[] = ['default', 'hover', 'pressed'];
/** Text on the primary, per state: the colour each `--ws-dynamic-text-on-primary-*` takes. */
type OnPrimary = Partial<Record<State, string>>;
const onPrimaryVar = (state: State) => `--ws-dynamic-text-on-primary-${state}`;
/** The ramp step each primary fill reads (`--ws-dynamic-fill-primary-*` in the library's tokens). */
const FILL_STEP: Record<Mode, Record<State, number>> = {
  light: { default: 600, hover: 800, pressed: 900 },
  dark: { default: 600, hover: 500, pressed: 700 },
};
/** The library's text on the primary (`neutral-0` of each mode). */
const INK: Record<Mode, string> = { light: '#ffffff', dark: '#f5f5f5' };
/**
 * A custom colour's text on the primary: black on every fill (the colour, its hover and pressed
 * steps) where the library's light text falls under 4.5:1, so each state reads on its own fill.
 */
const customOnOf = (hex: string, mode: Mode): OnPrimary => {
  const ink = luminanceOf(linearOf(INK[mode]));
  return Object.fromEntries(
    STATES.filter(
      (state) => contrast(luminanceOf(stepOf(hex, FILL_STEP[mode][state])), ink) < 4.5,
    ).map((state) => [state, '#000000']),
  );
};

/**
 * The brand's translucent steps (the primary's ghost and alpha fills), which the library writes as
 * hex: a theme mixes its own from its ramp, or they stay Wideset's purple.
 */
const OPACITY: Record<Mode, [number, number[]][]> = {
  light: [
    [400, [0, 4, 8, 12, 16, 24]],
    [600, [0, 4, 8, 12, 16]],
  ],
  dark: [
    [400, [0, 4, 8, 12, 16, 24]],
    [500, [0, 4, 8, 12, 16, 24, 32, 40, 48]],
  ],
};

/**
 * The primitive overrides a theme makes: the brand ramp (both modes) and the corner ladders. `own`
 * is the preset whose own colour is in use, with the steps it names; a hand-picked colour has none.
 */
const overrides = (brand: string, radius: Radius, own: Preset | undefined, shift: number) => {
  const vars: Record<string, string> = {};
  if (brand !== 'brand')
    for (const mode of ['light', 'dark'] as const) {
      const base = mode === 'dark' ? (own?.darkBrand ?? brand) : brand;
      RAMP.forEach((step, index) => {
        const from = mode === 'light' ? RAMP[Math.min(index + shift, RAMP.length - 1)] : step;
        const named = (base === brand ? own?.ramp : own?.darkRamp)?.[step];
        vars[`--ws-colors-${mode}-brand-${step}`] = named ?? rampOf(base, mode, from);
      });
      for (const [step, alphas] of OPACITY[mode])
        for (const alpha of alphas)
          vars[`--ws-colors-${mode}-brand-opacity-${step}-${alpha}`] =
            `color-mix(in srgb, var(--ws-colors-${mode}-brand-${step}) ${alpha}%, transparent)`;
    }
  if (radius !== 'default')
    STEPS.forEach((step, index) => {
      for (const kind of KINDS)
        vars[`--ws-corner-radius-${kind}-${step}`] = LADDERS[radius][kind][index];
    });
  return vars;
};

/** What every card needs to draw itself in the current theme. */
const Scope = createContext<{
  mode: Mode;
  pageDark: boolean;
  style: CSSProperties;
  font: CSSProperties;
  /** The preset last picked, whose font and name the cards draw. */
  preset: Preset;
}>({ mode: 'light', pageDark: false, style: {}, font: {}, preset: PRESETS[0] });

/**
 * One card: the page's soft stage with its title, the content in the theme's scope. The corners
 * are the page's, outside the scope whose corner tokens the theme changes; a card in the other
 * mode than the page takes that mode's own ground, so a dark preview reads on a light page.
 */
const ThemeCard = ({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) => {
  const { mode, pageDark, style, font } = useContext(Scope);
  return (
    <section className={cn('overflow-hidden rounded-ws-container-md', className)}>
      <div
        className={cn(
          'flex h-full flex-col gap-ws-9 p-ws-11',
          (mode === 'dark') === pageDark ? 'bg-ws-static-alpha-subtle' : 'bg-ws-static-background',
          mode === 'dark' ? 'dark' : 'docs-light',
        )}
        style={style}
      >
        <h2 className="typography-subtitle-xs text-ws-static-strong">{title}</h2>
        <div data-stage className="flex min-h-0 flex-1 flex-col" style={font}>
          {children}
        </div>
      </div>
    </section>
  );
};

/** A computed CSS colour as `#RRGGBB` (the ramps are `color-mix()` or variables; a canvas resolves them). */
const toHex = (css: string) => {
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return '';
  context.fillStyle = css;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
};

/** A colour tile: its name and step at the top, its HEX (read from what it draws) at the foot. */
const Tile = ({
  name,
  step,
  className,
  style,
}: {
  name: string;
  step?: string;
  className?: string;
  style?: CSSProperties;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hex, setHex] = useState('');
  const theme = useContext(Scope);
  useEffect(() => {
    if (ref.current) setHex(toHex(getComputedStyle(ref.current).backgroundColor));
  }, [theme]);
  // Without its own text token, the tile's text is the ink that reads on its colour.
  const light = hex ? contrastWithWhite(hex) < 3 : false;
  return (
    <div
      ref={ref}
      className={cn(
        'flex min-h-[8.5rem] flex-1 flex-col justify-between rounded-ws-container-md p-ws-9',
        className,
      )}
      style={{
        ...style,
        ...(className
          ? {}
          : {
              color: light
                ? 'var(--ws-colors-light-neutral-1100)'
                : 'var(--ws-colors-light-neutral-0)',
            }),
      }}
    >
      <p className="typography-label-sm">
        {name}
        {step && <span className="block tabular-nums">{step}</span>}
      </p>
      <p className="typography-caption-md tabular-nums">
        HEX
        <span className="block">{hex}</span>
      </p>
    </div>
  );
};

/** A type style drawn in itself, with its size and line height read from what it draws. */
const TypeStyle = ({ label, className }: { label: string; className: string }) => {
  const ref = useRef<HTMLElement>(null);
  const [measure, setMeasure] = useState('');
  useEffect(() => {
    if (!ref.current) return;
    const { fontSize, lineHeight } = getComputedStyle(ref.current);
    setMeasure(`Size: ${parseFloat(fontSize)} · Line-height: ${lineHeight}`);
  }, []);
  return (
    <div className="flex flex-col gap-ws-2">
      <dt ref={ref} className={cn(className, 'text-ws-static-strong')}>
        {label}
      </dt>
      <dd className="typography-caption-md text-ws-static-subtle tabular-nums">
        {/* A no-break space holds the line until the measure is read. */}
        {measure || String.fromCharCode(0xa0)}
      </dd>
    </div>
  );
};

const Foundation = () => {
  const { mode, preset } = useContext(Scope);
  const ramp = (step: number) => ({ background: `var(--ws-colors-${mode}-brand-${step})` });
  return (
    <div className="grid flex-1 gap-ws-9 lg:grid-cols-2">
      <div className="grid grid-cols-2 items-center gap-ws-11 rounded-ws-container-md border border-ws-static-subtle bg-ws-static-foreground p-ws-11">
        <div className="flex flex-col gap-ws-5">
          <span className="text-ws-1800 leading-ws-1800 text-ws-static-strong">Aa</span>
          <span className="border-t border-ws-static-subtle pt-ws-5 typography-body-md text-ws-static-subtle">
            {preset.font}
          </span>
        </div>
        <dl className="flex flex-col gap-ws-9">
          <TypeStyle label="Heading" className="typography-subtitle-xs" />
          <TypeStyle label="Body text" className="typography-body-md" />
        </dl>
      </div>
      <div className="flex gap-ws-3">
        <Tile
          name="Primary"
          className="flex-[2] bg-ws-dynamic-primary-default text-ws-dynamic-on-primary-default"
        />
        <Tile name="Brand" step="500" style={ramp(500)} />
        <Tile name="Brand" step="200" style={ramp(200)} />
      </div>
    </div>
  );
};

/** The brand's mark on a construction grid: hatched margins, dashed guides, the mark between. */
const Identity = () => {
  const { preset } = useContext(Scope);
  const hatch =
    'bg-[repeating-linear-gradient(135deg,transparent_0_6px,var(--border-color-ws-static-subtle)_6px_7px)]';
  return (
    <div className="grid min-h-ws-28 flex-1 grid-cols-[var(--spacing-ws-16)_minmax(0,1fr)_var(--spacing-ws-16)] overflow-hidden rounded-ws-container-sm border border-dashed border-ws-static-base">
      <div className={hatch} />
      <div className="flex flex-col items-center justify-center gap-ws-7 border-x border-dashed border-ws-static-base text-ws-static-strong">
        {preset.id !== 'wideset' ? (
          // A third-party brand shows as its name in the specimen font, not as its logo.
          <span className="text-ws-800 leading-ws-1000 font-ws-semibold tracking-ws-tight-100">
            {preset.label}
          </span>
        ) : (
          <WidesetWordmark width={120} />
        )}
        <span className="typography-caption-md tracking-ws-wide-300 text-ws-static-subtle uppercase">
          Logo
        </span>
      </div>
      <div className={hatch} />
    </div>
  );
};

const Components = () => (
  <div className="flex flex-1 flex-col justify-center gap-ws-7">
    <TextInput>
      <TextInput.Prefix>
        <TextInput.Icon icon={RiMailLine} />
      </TextInput.Prefix>
      <TextInput.Input type="email" placeholder="you@example.com" aria-label="Email" />
    </TextInput>
    <div className="grid grid-cols-2 gap-ws-7">
      <Button className="w-full">Button</Button>
      <Button className="w-full" variant="secondary" preset="border">
        Button
      </Button>
    </div>
  </div>
);

const SHELL_ICONS = [
  RiInboxLine,
  RiNotification3Line,
  RiDashboardLine,
  RiBarChartBoxLine,
  RiArchiveLine,
];

/** A product preview: an app shell with the brand's mark, a rail of icons and a card to act on. */
const Assets = () => {
  const { preset } = useContext(Scope);
  return (
    <div className="flex flex-1 flex-col rounded-ws-container-lg border border-ws-static-subtle bg-ws-static-foreground">
      <div className="flex items-center justify-between gap-ws-7 border-b border-ws-static-subtle px-ws-9 py-ws-7 text-ws-static-strong">
        {preset.id !== 'wideset' ? (
          <span className="typography-subtitle-xs">{preset.label}</span>
        ) : (
          <WidesetWordmark width={84} />
        )}
        <IconButton
          icon={RiSideBarLine}
          size="sm"
          preset="ghost"
          variant="secondary"
          aria-label="Toggle sidebar"
        />
      </div>
      <div className="flex flex-1 gap-ws-7 p-ws-7">
        <div className="flex flex-col gap-ws-3">
          {SHELL_ICONS.map((icon, index) => (
            <IconButton
              key={index}
              icon={icon}
              size="sm"
              preset={index === 2 ? 'filled' : 'ghost'}
              variant="secondary"
              aria-label={`Section ${index + 1}`}
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-ws-9 rounded-ws-container-md border border-ws-static-subtle p-ws-9">
          {/* The design's illustration is a brand picture; a quiet tile stands in for it. */}
          <div className="grid min-h-ws-25 flex-1 place-items-center rounded-ws-container-sm bg-ws-static-alpha-subtle text-ws-dynamic-primary-default">
            <RiDashboardLine className="size-ws-14" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-ws-3 text-center">
            <p className="typography-subtitle-xs text-ws-static-strong">
              Everything you need, in one place
            </p>
            <p className="typography-body-md text-ws-static-subtle">
              Simple, fast and always available
            </p>
          </div>
          <Button className="w-full">Get started</Button>
        </div>
      </div>
    </div>
  );
};

const INVOICES = [
  {
    id: 'ORB-2026-0118',
    date: 'Nov 1, 2026',
    what: 'Growth, 40 seats',
    amount: '$1,560.00',
    paid: false,
  },
  {
    id: 'ORB-2026-0104',
    date: 'Oct 14, 2026',
    what: '4 seats added',
    amount: '$90.58',
    paid: true,
  },
  {
    id: 'ORB-2026-0097',
    date: 'Oct 1, 2026',
    what: 'Growth, 36 seats',
    amount: '$1,404.00',
    paid: true,
  },
  {
    id: 'ORB-2026-0081',
    date: 'Sep 1, 2026',
    what: 'Growth, 36 seats',
    amount: '$1,404.00',
    paid: true,
  },
];
const USAGE = [
  { label: 'Seats', used: 38, limit: 40, usedText: '38', limitText: '40', note: '2 seats left' },
  {
    label: 'Contacts',
    used: 41.3,
    limit: 50,
    usedText: '41.3K',
    limitText: '50K',
    note: '8,720 left',
  },
  {
    label: 'Storage',
    used: 63.4,
    limit: 100,
    usedText: '63.4 GB',
    limitText: '100 GB',
    note: '36.6 GB left',
  },
];

/**
 * The preview's screen: the Billing block,
 * cut down to its page: the header with its tabs, the plan with this period's usage, and the
 * invoices. One primary action; everything else is quiet. It shows the brand colour (the primary
 * button, the active tab, the bars) and the corners (the page, cards, controls, badges).
 */
const BillingScreen = () => {
  const [query, setQuery] = useState('');
  const rows = INVOICES.filter((invoice) =>
    `${invoice.id} ${invoice.what}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className="flex flex-col gap-ws-12 rounded-ws-container-lg bg-ws-static-foreground p-ws-12 shadow-ws-low">
      <header className="flex flex-col gap-ws-9">
        <div className="flex flex-col gap-ws-3">
          <h3 className="typography-subtitle-md text-ws-static-strong">Billing</h3>
          <p className="typography-body-md text-ws-static-base">
            Lumen Studio is on Growth with 40 seats, billed monthly to Mastercard ending 8812.
          </p>
        </div>
        <Tabs defaultValue="plan">
          <Tabs.List aria-label="Billing">
            <Tabs.Item value="plan">
              <Tabs.Label>Plan</Tabs.Label>
            </Tabs.Item>
            <Tabs.Item value="invoices">
              <Tabs.Label>Invoices</Tabs.Label>
              <Tabs.Count>{INVOICES.length}</Tabs.Count>
            </Tabs.Item>
            <Tabs.Item value="payment">
              <Tabs.Label>Payment method</Tabs.Label>
            </Tabs.Item>
          </Tabs.List>
        </Tabs>
      </header>

      <Card>
        <Card.Header>
          <div className="flex flex-wrap items-center justify-between gap-ws-9">
            <div className="flex min-w-0 flex-1 items-center gap-ws-5">
              <h4 className="typography-subtitle-xs text-ws-static-strong">Growth plan</h4>
              <StatusBadge color="positive" size="sm">
                Active
              </StatusBadge>
            </div>
            <Card.Action className="gap-ws-5">
              <Button size="sm" variant="secondary" preset="ghost">
                Cancel plan
              </Button>
              <Button size="sm">Change plan</Button>
            </Card.Action>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-col gap-ws-14">
            <div className="flex flex-col gap-ws-3">
              <p className="flex items-baseline gap-ws-5">
                <span className="typography-subtitle-lg text-ws-static-strong tabular-nums">
                  $1,560.00
                </span>
                <span className="typography-body-md text-ws-static-subtle">per month</span>
              </p>
              <p className="typography-body-md text-ws-static-base tabular-nums">
                40 seats × $39.00, billed monthly, renews on Dec 1, 2026
              </p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-x-ws-12 gap-y-ws-11">
              {USAGE.map((meter) => (
                <div key={meter.label} className="flex min-w-0 flex-col gap-ws-5">
                  <div className="flex flex-col gap-ws-3">
                    <span className="typography-label-sm text-ws-static-subtle">{meter.label}</span>
                    <p className="flex items-baseline gap-ws-3 tabular-nums">
                      <span className="typography-subtitle-sm text-ws-static-strong">
                        {meter.usedText}
                      </span>
                      <span className="typography-body-md text-ws-static-subtle">
                        / {meter.limitText}
                      </span>
                    </p>
                  </div>
                  <ProgressBar
                    value={meter.used}
                    max={meter.limit}
                    aria-label={`${meter.label}: ${meter.usedText} of ${meter.limitText}`}
                  />
                  <p className="typography-caption-md text-ws-static-subtle">{meter.note}</p>
                </div>
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <div className="flex flex-wrap items-center justify-between gap-ws-9">
            <div className="flex min-w-0 flex-1 flex-col gap-ws-3">
              <h4 className="typography-subtitle-xs text-ws-static-strong">Invoices</h4>
              <p className="typography-body-md text-ws-static-subtle">
                Sent to finance@lumenstudio.co when they are issued.
              </p>
            </div>
            <Card.Action className="gap-ws-5">
              <TextInput
                size="sm"
                className="w-[14rem]"
                value={query}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(event.target.value)
                }
              >
                <TextInput.Prefix inner>
                  <TextInput.Icon icon={RiSearchLine} />
                </TextInput.Prefix>
                <TextInput.Input placeholder="Search invoices" aria-label="Search invoices" />
              </TextInput>
              <Button size="sm" variant="secondary" preset="border">
                Export
              </Button>
            </Card.Action>
          </div>
        </Card.Header>
        {/* A narrow window scrolls the table instead of the card clipping its last columns. */}
        <div className="overflow-x-auto">
          <Table className="w-full whitespace-nowrap">
            <Table.Head>
              <Table.Row>
                <Table.Header className="pl-ws-11">Invoice</Table.Header>
                <Table.Header>Date</Table.Header>
                <Table.Header className="w-full">Description</Table.Header>
                <Table.Header align="right">Amount</Table.Header>
                <Table.Header className="pr-ws-11">Status</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body className="[&>tr:last-child>td]:border-b-0">
              {rows.map((invoice) => (
                <Table.Row key={invoice.id}>
                  <Table.Cell className="pl-ws-11 text-ws-static-strong tabular-nums">
                    {invoice.id}
                  </Table.Cell>
                  <Table.Cell className="tabular-nums">{invoice.date}</Table.Cell>
                  <Table.Cell>{invoice.what}</Table.Cell>
                  <Table.Cell align="right" className="tabular-nums">
                    {invoice.amount}
                  </Table.Cell>
                  <Table.Cell className="pr-ws-11">
                    <StatusBadge color={invoice.paid ? 'positive' : 'negative'} size="sm">
                      {invoice.paid ? 'Paid' : 'Failed'}
                    </StatusBadge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  );
};

const SWATCH =
  'size-ws-13 rounded-ws-control-full outline-offset-2 outline-ws-static-strong focus-visible:outline-2';
const FIELD = 'flex items-center gap-ws-5';
const FIELD_LABEL = 'typography-label-sm text-ws-static-subtle';
const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

/**
 * The theme's CSS, after the "Get code" dialog of shadcn/ui's theme builder: a button at the top of
 * the page opens it; the code is the dialog's body itself, on a soft grey ground that scrolls both
 * ways in one place, with a copy button in its top-right corner, and the footer copies it too.
 */
const GetCode = ({ css }: { css: string }) => {
  const { copied, copy } = useCopy();
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    highlight(css, 'css').then((result) => live && setHtml(result));
    return () => {
      live = false;
    };
  }, [css]);
  return (
    <Modal>
      <Modal.Trigger asChild>
        <Button>
          <Button.Icon icon={RiCodeSSlashLine} />
          Get code
        </Button>
      </Modal.Trigger>
      {/* At most 40rem tall (the code scrolls in the body), and the Modal's own inset below that. */}
      <Modal.Content className="max-h-[min(40rem,calc(100%-2*var(--spacing-ws-5)))] max-w-[54rem]">
        <Modal.Header>
          <Modal.Title>Your theme</Modal.Title>
          <Modal.Description>
            Paste it after the Wideset stylesheet: the brand ramp, the corners and, where the preset
            sets them, the font and the text on the primary.
          </Modal.Description>
        </Modal.Header>
        {/* The body is the code's frame: the copy button pinned to its top-right corner, the code
            in the one area that scrolls both ways. `docs-snippet` for the site's code colours; its
            <pre> neither scrolls nor pads itself here (the site's rule sets both). */}
        <Modal.Body className="docs-snippet relative flex min-h-0 flex-col overflow-hidden bg-ws-static-alpha-subtle p-0">
          <div className="min-h-0 flex-1 overflow-auto [&_pre]:w-max [&_pre]:min-w-full [&_pre]:overflow-visible! [&_pre]:p-ws-11!">
            {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <pre>{css}</pre>}
          </div>
          <IconButton
            icon={copied ? RiCheckLine : RiFileCopyLine}
            size="sm"
            variant="secondary"
            preset="border"
            aria-label={copied ? 'Copied' : 'Copy CSS'}
            onClick={() => copy(css)}
            className="absolute top-ws-7 right-ws-9"
          />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="secondary" preset="border">
              Close
            </Button>
          </Modal.Close>
          <Button onClick={() => copy(css)}>
            <Button.Icon icon={copied ? RiCheckLine : RiFileCopyLine} />
            {copied ? 'Copied' : 'Copy CSS'}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

/** The Themes page under its head: presets and the theme's code, Customize, the cards. */
const Themes = () => {
  const [theme, setTheme] = useState<Theme>({
    preset: 'wideset',
    brand: null,
    radius: 'default',
    mode: 'light',
  });
  const [pageDark, setPageDark] = useState(false);
  const [resolved, setResolved] = useState<Record<string, string>>({});
  useEffect(() => {
    // The preview opens in the page's own mode, and follows the page's toggle.
    const follow = (dark: boolean) => {
      setPageDark(dark);
      setTheme((current) => ({ ...current, mode: dark ? 'dark' : 'light' }));
    };
    follow(isDark(loadAppearance()));
    // The export names the values, not the ramp they came from: read each system step once.
    const style = getComputedStyle(document.documentElement);
    const values: Record<string, string> = {};
    for (const name of SYSTEM)
      for (const mode of ['light', 'dark'])
        for (const step of RAMP) {
          const key = `--ws-colors-${mode}-${name}-${step}`;
          values[key] = style.getPropertyValue(key).trim();
        }
    setResolved(values);
    return onAppearanceChange((value) => follow(isDark(value)));
  }, []);

  const preset = PRESETS.find((item) => item.id === theme.preset) ?? PRESETS[0];
  // The preset's own colour, with the steps and the text it names; a colour picked by hand has neither.
  const own = theme.brand === null ? preset : undefined;
  const brand = theme.brand ?? preset.brand;
  // One rule for the preset marker: it stays while the theme is still the preset, and a colour
  // or corners set by hand clear it. The font and the name stay the preset's either way.
  const selected = own && theme.radius === preset.radius ? preset.id : '';
  const custom = !own && brand.startsWith('#');
  const vars = overrides(brand, theme.radius, own, shiftOf(brand, resolved));
  /** Text on the primary in a mode: the preset's, or black where a custom colour's fills need it. */
  const onPrimaryOf = (mode: Mode): OnPrimary => {
    const named = own?.onPrimary?.[mode];
    if (named) return Object.fromEntries(STATES.map((state) => [state, named]));
    return custom ? customOnOf(brand, mode) : {};
  };
  const onPrimary = onPrimaryOf(theme.mode);

  // The semantic corners read the primitives at the root; restate them in each scope so its own
  // overrides reach them. Text on the primary is this mode's.
  const style: Record<string, string> = { ...vars };
  for (const kind of KINDS)
    for (const [short, step] of [
      ['none', 'none'],
      ['sm', 'small'],
      ['md', 'medium'],
      ['lg', 'large'],
      ['xl', 'xlarge'],
    ])
      style[`--radius-ws-${kind}-${short}`] = `var(--ws-corner-radius-${kind}-${step})`;
  for (const state of STATES) {
    const colour = onPrimary[state];
    if (colour) style[onPrimaryVar(state)] = colour;
  }
  const font: Record<string, string> = preset.stack
    ? { fontFamily: preset.stack, '--font-ws-sans': preset.stack }
    : {};

  const lines = Object.entries(vars).map(([name, value]) => {
    const system = value.match(/^var\((--[^)]+)\)$/)?.[1];
    return `  ${name}: ${(system && resolved[system]) || value};`;
  });
  if (preset.stack) lines.push(`  --font-ws-sans: ${preset.stack};`);
  const lightOn = onPrimaryOf('light');
  const darkOn = onPrimaryOf('dark');
  for (const state of STATES) {
    const colour = lightOn[state];
    if (colour) lines.push(`  ${onPrimaryVar(state)}: ${colour};`);
  }
  // Wideset re-declares the text on the primary under `.dark`, which wins over `:root` wherever
  // the class sits below the root: dark mode restates every state either mode sets, as the cards
  // do, and keeps the library's own text where only light mode needs another.
  const darkLines = STATES.filter((state) => lightOn[state] || darkOn[state]).map(
    (state) => `  ${onPrimaryVar(state)}: ${darkOn[state] ?? 'var(--ws-colors-dark-neutral-0)'};`,
  );
  const dark = darkLines.length ? `\n.dark {\n${darkLines.join('\n')}\n}` : '';
  // The stack names the brand's font; the app loads it (Wideset loads none). A licensed font comes
  // from the brand's own licence, so the note says that instead of where to get it.
  const fontNote = !preset.stack
    ? ''
    : preset.licensed
      ? `/* ${preset.font} is the brand's licensed font: serve it under your own licence (400, 500 and 600); without it, Inter stands in. */\n`
      : `/* Load ${preset.font} in your app first (400, 500 and 600), e.g. from Google Fonts. */\n`;
  const css = lines.length
    ? `${fontNote}:root {\n${lines.join('\n')}\n}${dark}`
    : '/* Wideset as it ships: nothing to override. */';

  const pick = (item: Preset) =>
    setTheme((current) => ({
      ...current,
      preset: item.id,
      brand: null,
      radius: item.radius,
    }));

  const checkedSwatch = theme.brand ?? '';
  // A colour by hand keeps the preset's font and name; only the colour changes.
  const pickSwatch = (name: string) => setTheme((current) => ({ ...current, brand: name }));
  /** The radio group's arrow keys: move to the next or previous swatch and pick it. */
  const moveSwatch = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    const from = (event.target as HTMLElement).dataset.swatch;
    if (!step || !from) return;
    event.preventDefault();
    const next = SYSTEM[(SYSTEM.indexOf(from) + step + SYSTEM.length) % SYSTEM.length];
    pickSwatch(next);
    event.currentTarget.querySelector<HTMLElement>(`[data-swatch="${next}"]`)?.focus();
  };

  return (
    <Scope.Provider
      value={{
        mode: theme.mode,
        pageDark,
        style: style as CSSProperties,
        font: font as CSSProperties,
        preset,
      }}
    >
      <div className="flex flex-col gap-ws-12">
        <div className="flex flex-col gap-ws-9">
          {/* The presets, and the theme's code at the other end of the row. */}
          <div className="flex flex-wrap items-center justify-between gap-ws-7">
            <SegmentedControl
              value={selected}
              onValueChange={(next) => {
                const item = PRESETS.find((candidate) => candidate.id === next);
                if (item) pick(item);
              }}
              aria-label="Brand preset"
            >
              {PRESETS.map((item) => (
                <SegmentedControl.Item key={item.id} value={item.id}>
                  {item.label}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl>
            <GetCode css={css} />
          </div>

          {/* Customize: the presets set these; here they are set by hand. */}
          <div className="flex flex-wrap items-center gap-x-ws-14 gap-y-ws-7">
            <div className={FIELD}>
              <span id="theme-brand" className={FIELD_LABEL}>
                Brand colour
              </span>
              {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- the focus is on the checked radio; the group only hears its arrow keys */}
              <div
                role="radiogroup"
                aria-labelledby="theme-brand"
                className="flex gap-ws-4"
                onKeyDown={moveSwatch}
              >
                {SYSTEM.map((name) => {
                  const checked = theme.brand === name;
                  // One tab stop for the group: the checked swatch, or the first when none is.
                  const tabbable =
                    checked || (!SYSTEM.includes(checkedSwatch) && name === SYSTEM[0]);
                  return (
                    // ds-exempt: a colour swatch is its own colour; no library control draws one.
                    <button
                      key={name}
                      type="button"
                      role="radio"
                      data-swatch={name}
                      aria-checked={checked}
                      aria-label={name === 'brand' ? 'Wideset' : capitalize(name)}
                      tabIndex={tabbable ? 0 : -1}
                      onClick={() => pickSwatch(name)}
                      className={cn(SWATCH, checked && 'outline-2')}
                      // The step the primary takes (see `shiftOf`), so the swatch is the colour you get.
                      style={{
                        background: `var(--ws-colors-light-${name}-${600 + shiftOf(name, resolved) * 100})`,
                      }}
                    />
                  );
                })}
                <Tooltip>
                  <Tooltip.Trigger asChild>
                    {/* One more swatch: any colour, from the system's picker. */}
                    <label
                      className={cn(
                        SWATCH,
                        'relative grid cursor-pointer place-items-center text-ws-static-subtle hover:text-ws-static-strong has-focus-visible:outline-2',
                        custom ? 'outline-2' : 'border border-dashed border-ws-static-base',
                      )}
                      style={custom ? { background: brand } : undefined}
                    >
                      {!custom && <RiAddLine className="size-ws-9" aria-hidden="true" />}
                      <input
                        type="color"
                        aria-label="Custom brand colour"
                        value={custom ? brand : '#4e3ee0'}
                        onChange={(event) =>
                          setTheme((current) => ({ ...current, brand: event.target.value }))
                        }
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                  </Tooltip.Trigger>
                  <Tooltip.Content>
                    <Tooltip.Label>Custom colour</Tooltip.Label>
                  </Tooltip.Content>
                </Tooltip>
              </div>
            </div>
            <div className={FIELD}>
              <span id="theme-radius" className={FIELD_LABEL}>
                Radius
              </span>
              <SegmentedControl
                size="sm"
                value={theme.radius}
                onValueChange={(next) =>
                  next && setTheme((current) => ({ ...current, radius: next as Radius }))
                }
                aria-labelledby="theme-radius"
              >
                {RADII.map((item) => (
                  <SegmentedControl.Item key={item.value} value={item.value}>
                    {item.label}
                  </SegmentedControl.Item>
                ))}
              </SegmentedControl>
            </div>
            <div className={FIELD}>
              <span id="theme-mode" className={FIELD_LABEL}>
                Mode
              </span>
              <SegmentedControl
                size="sm"
                value={theme.mode}
                onValueChange={(next) =>
                  next && setTheme((current) => ({ ...current, mode: next as Mode }))
                }
                aria-labelledby="theme-mode"
              >
                <SegmentedControl.Item value="light">Light</SegmentedControl.Item>
                <SegmentedControl.Item value="dark">Dark</SegmentedControl.Item>
              </SegmentedControl>
            </div>
          </div>
        </div>

        <div className="grid gap-ws-9 lg:grid-cols-3">
          <ThemeCard title="Foundation" className="lg:col-span-2">
            <Foundation />
          </ThemeCard>
          <ThemeCard title="Assets" className="lg:row-span-2">
            <Assets />
          </ThemeCard>
          <ThemeCard title="Logo & identity">
            <Identity />
          </ThemeCard>
          <ThemeCard title="Components">
            <Components />
          </ThemeCard>
          <ThemeCard title="In a product" className="lg:col-span-3">
            <BillingScreen />
          </ThemeCard>
        </div>
      </div>
    </Scope.Provider>
  );
};

export default Themes;
