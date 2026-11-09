'use client';

import { cn } from '@/lib/wideset/utils';

import { ScrollArea } from '../scroll-area/ScrollArea';
import { useModal } from './Modal.context';
import type { ModalBodyProps } from './Modal.types';

/** The part between header and footer that scrolls when the modal reaches the viewport's height. */
const ModalBody = ({ className, ...props }: ModalBodyProps) => {
  const { motion } = useModal();

  return (
    <ScrollArea defaultMotion={motion} className="min-h-0 grow">
      <div data-slot="modal-body" className={cn('p-ws-11', className)} {...props} />
    </ScrollArea>
  );
};

ModalBody.displayName = 'Modal.Body';

export { ModalBody };
