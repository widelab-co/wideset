import { FileItem, FileUpload } from '@wideset/react';
import { type DragEvent, useRef, useState } from 'react';

import { csvHref } from './csv-href';
import { LIMITS, sampleCsv } from './data';
import { formatCount, formatSize } from './format';
import { Section } from './section';
import { TextLink } from './text-link';

type UploadStepProps = {
  /** The file chosen so far, if any. */
  file?: File;
  onFile: (file: File) => void;
  onRemove: () => void;
};

/**
 * The first step: one drop zone with a Browse button for the file, and under it the limits and a
 * sample to start from, in one line. A chosen file takes the zone's place as a row that can be
 * removed, so the user sees what goes in before Continue, under the card, moves on. With no file
 * library to hand, the zone opens the hidden input FileUpload renders and takes drops itself.
 */
export function UploadStep({ file, onFile, onRemove }: UploadStepProps) {
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
      const dropped = event.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
  };

  return (
    <Section
      title="Choose a file"
      description="A CSV file whose first row names its columns, one customer a row after it."
    >
      <div className="gap-ws-7 flex flex-col">
        {file ? (
          <FileItem onRemove={onRemove}>
            <FileItem.Thumbnail name={file.name} />
            <FileItem.Title>{file.name}</FileItem.Title>
            <FileItem.Description>{formatSize(file.size)}</FileItem.Description>
          </FileItem>
        ) : (
          <FileUpload
            ref={upload}
            browse
            labels={{
              dropzoneBrowse: 'Drop a CSV file here, or',
              dropzoneActive: 'Drop the file here',
            }}
            isDragActive={dragging}
            zoneProps={drop}
            inputProps={{
              accept: '.csv,text/csv',
              onChange: (event) => {
                const chosen = event.target.files?.[0];
                event.target.value = '';
                if (chosen) onFile(chosen);
              },
            }}
            onBrowse={() => upload.current?.querySelector('input')?.click()}
          />
        )}
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
