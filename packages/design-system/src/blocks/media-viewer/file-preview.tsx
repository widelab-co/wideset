// TODO(custom): a file drawn at its real size (a proposal's first page, a deck's title slide, a chart image), scaled for zoom; Wideset has no file viewer, and blocks ship no images.
import { cn } from '@wideset/react';

import { CHARTS, type FileItem, type Kind, KIND_LABEL, PEOPLE } from './data';
import { formatChartValue } from './format';

/** Each kind's size at 100%: a US Letter page at 96 dpi, a 16:9 slide, a chart export. */
export const NATURAL: Record<Kind, { width: number; height: number }> = {
  pdf: { width: 816, height: 1056 },
  deck: { width: 1280, height: 720 },
  image: { width: 1200, height: 800 },
};

/*
  The viewer is always dark, so inside it the inverse tokens are always the light ones: the paper
  is `inverse-background` and its text `inverse-*`, white paper with dark type in both themes,
  as a document is.
*/
const PAPER = 'bg-ws-static-inverse-background text-ws-static-inverse-strong h-full w-full';

const PRICING = [
  { item: 'Discovery, two weeks', amount: '$18,000.00' },
  { item: 'Design and delivery, six months', amount: '$96,000.00' },
  { item: 'Support after launch, six months', amount: '$24,000.00' },
];

/** A proposal's first page: who it is for, the summary, the scope and the price. */
function ProposalPage({ file }: { file: FileItem }) {
  return (
    <div className={cn(PAPER, 'p-ws-20 gap-ws-14 flex flex-col')}>
      <div className="typography-label-sm text-ws-static-inverse-subtle flex justify-between">
        <span className="typography-label-strong-sm text-ws-static-inverse-strong">
          Lumen Studio
        </span>
        <span>Proposal · November 2026</span>
      </div>
      <div className="gap-ws-3 flex flex-col">
        <h3 className="typography-subtitle-md">A proposal for {file.subject}</h3>
        <p className="typography-body-md text-ws-static-inverse-subtle">
          Prepared by {PEOPLE[file.owner].name}, Lumen Studio
        </p>
      </div>
      <section className="gap-ws-5 flex flex-col">
        <h4 className="typography-label-strong-md">Summary</h4>
        <p className="typography-body-md text-ws-static-inverse-base">
          {file.subject} asked for a partner to redesign the tools its teams use with customers
          every day. This proposal covers a six-month engagement: two weeks of discovery with your
          teams, then design and delivery in fortnightly releases, and six months of support after
          launch.
        </p>
      </section>
      <section className="gap-ws-5 flex flex-col">
        <h4 className="typography-label-strong-md">Scope</h4>
        <ul className="typography-body-md text-ws-static-inverse-base gap-ws-3 pl-ws-9 flex list-disc flex-col">
          <li>
            Discovery: interviews with the people who use the tools, and a map of what slows them.
          </li>
          <li>Design: the flows that matter most, tested with real users every two weeks.</li>
          <li>Delivery: production-ready screens and components, built with your engineers.</li>
        </ul>
      </section>
      <section className="gap-ws-5 flex flex-col">
        <h4 className="typography-label-strong-md">Pricing</h4>
        <table className="typography-body-md w-full">
          <tbody>
            {PRICING.map((row) => (
              <tr key={row.item} className="border-ws-static-inverse-subtle border-b">
                <td className="py-ws-5 text-ws-static-inverse-base">{row.item}</td>
                <td className="py-ws-5 text-right tabular-nums">{row.amount}</td>
              </tr>
            ))}
            <tr className="typography-label-strong-md">
              <td className="py-ws-5">Total</td>
              <td className="py-ws-5 text-right tabular-nums">$138,000.00</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="gap-ws-5 flex flex-col">
        <h4 className="typography-label-strong-md">Timeline</h4>
        <p className="typography-body-md text-ws-static-inverse-base">
          Discovery starts the week this proposal is signed. The first release follows four weeks
          later, then one every two weeks until the engagement ends.
        </p>
      </section>
      <p className="typography-caption-md text-ws-static-inverse-subtle mt-auto text-right">
        Page 1 of 4
      </p>
    </div>
  );
}

/** A pitch deck's title slide: the customer, the deck's name, who presents it. */
function TitleSlide({ file }: { file: FileItem }) {
  return (
    <div className={cn(PAPER, 'p-ws-24 flex flex-col justify-between')}>
      <span className="typography-label-strong-md">Lumen Studio</span>
      <div className="gap-ws-9 flex flex-col">
        <p className="typography-label-md text-ws-static-inverse-subtle">Q4 2026 · Pitch</p>
        {/* A slide's own type: drawn at the slide's size, then scaled with it. */}
        <h3 className="typography-title-lg max-w-[48rem]">Working with {file.subject}</h3>
        <p className="typography-body-lg text-ws-static-inverse-base">
          {PEOPLE[file.owner].name}, Lumen Studio
        </p>
      </div>
      <p className="typography-label-sm text-ws-static-inverse-subtle text-right tabular-nums">
        1 / 18
      </p>
    </div>
  );
}

/** A chart image: its title and note, then one bar per row in the one series colour. */
function ChartImage({ file }: { file: FileItem }) {
  const chart = CHARTS[file.subject];
  const max = Math.max(...chart.bars.map((bar) => bar.value));
  return (
    <div className={cn(PAPER, 'p-ws-20 gap-ws-16 flex flex-col')}>
      <div className="gap-ws-3 flex flex-col">
        <h3 className="typography-subtitle-md">{file.subject}</h3>
        <p className="typography-body-md text-ws-static-inverse-subtle">{chart.note}</p>
      </div>
      <svg viewBox="0 0 1040 520" className="w-full flex-1" aria-hidden="true">
        {chart.bars.map((bar, row) => {
          const y = row * (520 / chart.bars.length);
          const width = (bar.value / max) * 760;
          return (
            <g key={bar.label}>
              <text x="0" y={y + 34} className="typography-body-lg fill-ws-static-inverse-base">
                {bar.label}
              </text>
              <rect
                x="160"
                y={y + 12}
                width={width}
                height="36"
                rx="4"
                className="fill-(--ws-non-semantic-fill-blue-strong)"
              />
              <text
                x={160 + width + 16}
                y={y + 36}
                className="typography-label-strong-lg fill-ws-static-inverse-strong tabular-nums"
              >
                {formatChartValue(bar.value, chart.unit)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * A file at its real size times `scale`: an SVG whose width and height carry the zoom, with the
 * file drawn inside at 100% (HTML in a foreignObject), so zooming scales it as one picture and
 * the page needs no inline style. Its name and kind are its accessible name.
 */
export function FilePreview({ file, scale }: { file: FileItem; scale: number }) {
  const { width, height } = NATURAL[file.kind];
  return (
    <svg
      role="img"
      aria-label={`${KIND_LABEL[file.kind]}: ${file.name}`}
      viewBox={`0 0 ${width} ${height}`}
      width={Math.round(width * scale)}
      height={Math.round(height * scale)}
      className="rounded-ws-control-sm shrink-0"
    >
      <foreignObject width={width} height={height}>
        {file.kind === 'pdf' && <ProposalPage file={file} />}
        {file.kind === 'deck' && <TitleSlide file={file} />}
        {file.kind === 'image' && <ChartImage file={file} />}
      </foreignObject>
    </svg>
  );
}
