import { cva } from 'class-variance-authority';

export const cellVariants = cva(
  `border-ws-static-base text-ws-static-base border-b [tfoot_&]:border-b-0 [tfoot>tr:first-child>&]:border-t`,
  {
    variants: {
      size: {
        sm: 'h-ws-16 px-ws-9 py-ws-3',
        md: 'h-ws-18 px-ws-9 py-ws-5',
        lg: 'h-ws-20 px-ws-9 py-ws-7',
      },
      header: {
        true: '',
        false: '',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
      placement: {
        top: 'align-top',
        middle: 'align-middle',
        bottom: 'align-bottom',
      },
      flushMargin: {
        true: 'px-0',
      },
      hasBackground: {
        true: 'bg-ws-static-container',
      },
      stickyColumn: {
        true: 'first-of-type:shadow-ws-table-freeze first-of-type:z-ws-mask [thead_&]:first-of-type:z-ws-sticky first-of-type:sticky first-of-type:left-0 first-of-type:border-r',
      },
      separated: {
        true: 'border-r last:border-r-0',
      },
      interactive: {
        true: 'group-hover/row:bg-ws-dynamic-secondary-alpha-hover group-active/row:bg-ws-dynamic-secondary-alpha-pressed',
      },
      selected: {
        true: '',
      },
      truncate: {
        true: 'truncate',
      },
    },
    compoundVariants: [
      { header: false, size: 'sm', class: 'typography-label-sm' },
      { header: false, size: 'md', class: 'typography-label-sm' },
      { header: false, size: 'lg', class: 'typography-label-md' },
      { header: true, size: 'sm', class: 'typography-label-strong-sm' },
      { header: true, size: 'md', class: 'typography-label-strong-sm' },
      { header: true, size: 'lg', class: 'typography-label-strong-md' },
      {
        interactive: true,
        selected: true,
        class:
          'bg-ws-dynamic-primary-alpha-strong-default group-hover/row:bg-ws-dynamic-primary-alpha-strong-hover group-active/row:bg-ws-dynamic-primary-alpha-strong-pressed',
      },
    ],
    defaultVariants: {
      align: 'left',
      flushMargin: false,
      header: false,
      separated: false,
      size: 'sm',
    },
  },
);
