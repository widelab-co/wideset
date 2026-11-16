import type { SnapshotSerializer } from 'vitest';

// React 18 uses :r0:, and React 19 uses «r0» or _r_0_. Keep Radix prefixes and
// component-specific suffixes intact; only the generated React identity is noise.
const generatedId =
  /:[rR][\da-v]+(?:H[\da-v]+)*:|«[rR][\da-v]+(?:H[\da-v]+)*»|_[rR]_[\da-v]+(?:H[\da-v]+)*_/g;
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
]);

function elements(node: Element | DocumentFragment): Element[] {
  return node instanceof Element
    ? [node, ...node.querySelectorAll('*')]
    : [...node.querySelectorAll('*')];
}

export function normalizeSnapshotIds<T extends Element | DocumentFragment>(node: T): T {
  const clone = node.cloneNode(true) as T;
  const ids = new Map<string, string>();

  for (const element of elements(clone)) {
    for (const attribute of element.attributes) {
      if (!idAttributes.has(attribute.name)) continue;
      attribute.value = attribute.value.replace(generatedId, (id) => {
        if (!ids.has(id)) ids.set(id, `:id-${ids.size + 1}:`);
        return ids.get(id)!;
      });
    }
  }

  return clone;
}

export const stableIdSerializer = {
  test(value) {
    return (
      (value instanceof Element || value instanceof DocumentFragment) &&
      elements(value).some((element) =>
        [...element.attributes].some(
          (attribute) => idAttributes.has(attribute.name) && attribute.value.match(generatedId),
        ),
      )
    );
  },
  serialize(value, config, indentation, depth, refs, printer) {
    // The clone no longer matches test(), so printer uses the normal DOM serializer.
    return printer(normalizeSnapshotIds(value), config, indentation, depth, refs);
  },
} satisfies SnapshotSerializer;
