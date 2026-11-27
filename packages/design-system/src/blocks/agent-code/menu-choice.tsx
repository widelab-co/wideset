import { DropdownMenu } from '@wideset/react';
import type { ReactNode } from 'react';

export function MenuChoice({
  value,
  onSelect,
  children,
}: {
  value: string;
  onSelect?: () => void;
  children: ReactNode;
}) {
  return (
    <DropdownMenu.RadioItem value={value} onSelect={onSelect}>
      {children}
    </DropdownMenu.RadioItem>
  );
}
