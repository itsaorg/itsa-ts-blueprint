#!/usr/bin/env node
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REQUIRED_PATHS = [
  'CONTRIBUTING.md',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/chore_docs.yml',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.husky/pre-commit',
  '.husky/commit-msg',
  '.husky/pre-push',
  'package.json',
  'src/index.ts',
  'types/index.d.ts',
];

const tempRoot = mkdtempSync(join(tmpdir(), 'itsa-smoke-'));
const target = join(tempRoot, 'itsa-smoke-test');

console.log(`Smoke scaffold target: ${target}`);

try {
  execFileSync(
    process.execPath,
    [
      'scripts/substitute-names.mjs',
      '--repo',
      'itsa-smoke-test',
      '--package',
      '@itsaorg/smoke-test',
      '--description',
      'Smoke test scaffold from ts-blueprint',
      '--repo-id',
      'R99',
      '--phase',
      'P0',
      '--out',
      target,
    ],
    { stdio: 'inherit' }
  );

  for (const rel of REQUIRED_PATHS) {
    const full = join(target, rel);
    if (!existsSync(full)) {
      console.error(`Missing required scaffold file: ${rel}`);
      process.exit(1);
    }
  }

  const pkg = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8'));
  if (pkg.scripts?.['smoke:scaffold']) {
    console.error('Template must not include smoke:scaffold script');
    process.exit(1);
  }

  execSync('git init', { cwd: target, stdio: 'inherit' });
  execSync('npm install', { cwd: target, stdio: 'inherit' });
  execSync('npm run format', { cwd: target, stdio: 'inherit' });
  execSync('npm run check', { cwd: target, stdio: 'inherit' });

  console.log('Smoke scaffold passed');
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
