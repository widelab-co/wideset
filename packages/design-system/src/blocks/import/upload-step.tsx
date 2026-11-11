import { FileUpload } from '@wideset/react';
import { type DragEvent, useRef, useState } from 'react';

import { csvHref } from './csv-href';
import { LIMITS, sampleCsv } from './data';
import { formatCount } from './format';
import { Section } from './section';
import { TextLink } from './text-link';

/**
 * The first step: one drop zone for the file, and under it the limits and a sample to start
 * from, in one line. Choosing or dropping a file moves on by itself; there is nothing else to
 * decide here. With no file library to hand, the zone opens the hidden input FileUpload renders
 * and takes drops itself.
 */
export function UploadStep({ onFile }: { onFile: (file: File) => void }) {
  const upload = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const drop = {
    onDragOver: (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop: (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) onFile(file);
    },
  };

  return (
    <Section
      title="Choose a file"
      description="A CSV file whose first row names its columns, one customer a row after it."
    >
      <div className="gap-ws-7 flex flex-col">
        <FileUpload
          ref={upload}
          labels={{ dropzone: 'Click or drop a CSV file', dropzoneActive: 'Drop the file here' }}
          isDragActive={dragging}
          zoneProps={drop}
          inputProps={{
            accept: '.csv,text/csv',
            onChange: (event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) onFile(file);
            },
          }}
          onBrowse={() => upload.current?.querySelector('input')?.click()}
        />
        <p className="typography-body-md text-ws-static-subtle tabular-nums">
          One file, up to {formatCount(LIMITS.rows)} rows and {LIMITS.megabytes} MB.{' '}
          <TextLink href={csvHref(sampleCsv)} download="customers-sample.csv">
            Download a sample CSV
          </TextLink>
        </p>
      </div>
    </Section>
  );
}
