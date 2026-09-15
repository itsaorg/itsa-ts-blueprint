import path from 'node:path';
import { fileURLToPath } from 'node:url';
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const nodeGlobals = {
  console: 'readonly',
  process: 'readonly',
};

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'docs/api/**',
      'node_modules/**',
      'template/**',
      'types/**',
      'tests/consumer/fixture/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './config/tsconfig.eslint.json',
        tsconfigRootDir: repoRoot,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs', 'config/eslint.config.js', 'config/commitlint.config.js'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: nodeGlobals,
    },
    rules: {
      'no-console': 'off',
    },
  }
);
