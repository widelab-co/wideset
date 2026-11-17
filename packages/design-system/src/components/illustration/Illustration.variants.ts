import { cva } from 'class-variance-authority';

/**
 * Ink takes the text colour (Figma Static/Text/Strong), so a `text-*` class or dark mode recolours
 * the lines; the accent takes the primary fill (Dynamic/Fill/Primary/Default), so a rebrand
 * recolours it.
 */
export const illustrationVariants = cva('text-ws-static-strong shrink-0', {
  variants: {
    size: {
      lg: 'size-[15rem]',
      sm: 'size-[8.75rem]',
    },
  },
  defaultVariants: { size: 'lg' },
});

export const illustrationToneVariants = cva('', {
  variants: {
    tone: { ink: '', accent: '' },
    stroke: { true: '', false: '' },
  },
  compoundVariants: [
    { tone: 'ink', stroke: false, class: 'fill-current' },
    { tone: 'ink', stroke: true, class: 'stroke-current' },
    { tone: 'accent', stroke: false, class: 'fill-(--ws-dynamic-fill-primary-default)' },
    { tone: 'accent', stroke: true, class: 'stroke-(--ws-dynamic-fill-primary-default)' },
  ],
  defaultVariants: { tone: 'ink', stroke: false },
});
