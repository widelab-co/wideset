'use client';

import { cn } from '@/lib/wideset/utils';

import type { ModalBodyProps } from './Modal.types';

const ModalBody = ({ className, ...props }: ModalBodyProps) => (
  <div
    data-slot="modal-body"
    className={cn('p-ws-11 ws-scrollbar grow overflow-y-auto', className)}
    {...props}
  />
);

ModalBody.displayName = 'Modal.Body';

export { ModalBody };
