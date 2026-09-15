import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageName = '@itsa/ts-blueprint' as const;

export default defineConfig({
  resolve: {
    alias: {
      [packageName]: path.join(repoRoot, 'dist/index.js'),
    },
  },
  test: {
    include: ['tests/consumer/**/*.test.ts'],
    pool: 'forks',
  },
});
