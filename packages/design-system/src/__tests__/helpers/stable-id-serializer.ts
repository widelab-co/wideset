import type { SnapshotSerializer } from 'vitest';

// React 18 uses :r0:, and React 19 uses «r0» or _r_0_. Keep Radix prefixes and
// component-specific suffixes intact; only the generated React identity is noise.
// Match at the start of an ID token, not inside an explicit consumer ID.
const generatedId =
  /(^|\s)(radix-)?(:[rR][\da-v]+(?:H[\da-v]+)*:|«[rR][\da-v]+(?:H[\da-v]+)*»|_[rR]_[\da-v]+(?:H[\da-v]+)*_)/g;
const idAttributes = new Set([
  'id',
  'for',
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-errormessage',
  'aria-flowto',
  'aria-labelledby',
  'aria-owns',
  'headers',
  'list',
  'form',
  // Spreadsheet stores its generated cell identity in this custom attribute.
  'data-spreadsheet-cell',
]);

function elements(node: Element | DocumentFragment): Element[] {
  return node instanceof Element
    ? [node, ...node.querySelectorAll('*')]
    : [...node.querySelectorAll('*')];
}

function idValue(attribute: Attr): string | null {
  if (idAttributes.has(attribute.name)) return attribute.value;
  // A local fragment refers to one ID. Exclude the # from normalization and
  // restore it below; links to other pages must remain untouched.
  if (attribute.name === 'href' && attribute.value.startsWith('#')) {
    return attribute.value.slice(1);
  }
  return null;
}

export function normalizeSnapshotIds<T extends Element | DocumentFragment>(node: T): T {
  const clone = node.cloneNode(true) as T;
  const ids = new Map<string, string>();

  for (const element of elements(clone)) {
    for (const attribute of element.attributes) {
      const value = idValue(attribute);
      if (value === null) continue;
      const normalized = value.replace(
        generatedId,
        (_match, separator: string, prefix: string | undefined, id: string) => {
          if (!ids.has(id)) ids.set(id, `:id-${ids.size + 1}:`);
          return `${separator}${prefix ?? ''}${ids.get(id)!}`;
        },
      );
      attribute.value = attribute.name === 'href' ? `#${normalized}` : normalized;
    }
  }

  return clone;
}

export const stableIdSerializer = {
  test(value) {
    return (
      (value instanceof Element || value instanceof DocumentFragment) &&
      elements(value).some((element) =>
        [...element.attributes].some((attribute) => idValue(attribute)?.match(generatedId)),
      )
    );
  },
  serialize(value, config, indentation, depth, refs, printer) {
    // The clone no longer matches test(), so printer uses the normal DOM serializer.
    return printer(normalizeSnapshotIds(value), config, indentation, depth, refs);
  },
} satisfies SnapshotSerializer;
