/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const tokens = readFileSync(resolve(process.cwd(), 'src/foundation/tokens.css'), 'utf8');

describe('foundation color schemes', () => {
  it('provides native light, dark and system modes through semantic tokens', () => {
    expect(tokens).toContain('light-dark(');
    expect(tokens).toContain(':root:where([data-kui-scheme="light"])');
    expect(tokens).toContain(':root:where([data-kui-scheme="dark"])');
    expect(tokens).toContain(':root:where([data-kui-scheme="system"])');
    expect(tokens).toContain('color-scheme: light dark');
  });
});
