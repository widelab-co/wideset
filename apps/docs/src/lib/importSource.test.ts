import { describe, expect, it } from 'vitest';

import { withImportSource } from './importSource';

const paths = {
  Toast: '@/components/ui/wideset/toast/Toast',
  ToastStatus: '@/components/ui/wideset/toast/Toast.types',
};

describe('withImportSource', () => {
  it('leaves the package import as it is for npm', () => {
    const code = "import { Toast, type ToastStatus } from '@wideset/react';";
    expect(withImportSource(code, 'package', paths)).toBe(code);
  });

  it('moves a type specifier to its scaffolded file and keeps `type`', () => {
    expect(
      withImportSource(
        "import { Toast, type ToastStatus } from '@wideset/react';",
        'project',
        paths,
      ),
    ).toBe(
      [
        "import { Toast } from '@/components/ui/wideset/toast/Toast';",
        "import { type ToastStatus } from '@/components/ui/wideset/toast/Toast.types';",
      ].join('\n'),
    );
  });

  it('keeps `import type` on a type-only import', () => {
    expect(
      withImportSource("import type { ToastStatus } from '@wideset/react';", 'project', paths),
    ).toBe("import type { ToastStatus } from '@/components/ui/wideset/toast/Toast.types';");
  });

  it('keeps a name it cannot place on the package', () => {
    expect(
      withImportSource("import { type Unknown } from '@wideset/react';", 'project', paths),
    ).toBe("import { type Unknown } from '@wideset/react';");
  });
});
