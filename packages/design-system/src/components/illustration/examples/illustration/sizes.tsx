/**
 * `lg` (240px) fills an empty page or a first-run screen; `sm` (140px) sits in a card, a panel or
 * an announcement. Each size is drawn on its own, so the lines keep the same weight at both.
 */
import { Illustration } from '@wideset/react';

export default function IllustrationSizes() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-end justify-center">
      <Illustration illustration="folder" size="lg" />
      <Illustration illustration="folder" size="sm" />
    </div>
  );
}
