#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const MAX_STAGED_FILES = 5;

if (existsSync('.git/MERGE_HEAD')) {
  process.exit(0);
}

const output = execSync('git diff --cached --name-only --diff-filter=ACMR', {
  encoding: 'utf8',
});
const files = output
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

if (files.length > MAX_STAGED_FILES) {
  console.error(
    `Commit blocked: ${files.length} staged files exceeds the limit of ${MAX_STAGED_FILES}.`
  );
  console.error('Stage at most 5 files per commit (merge commits are exempt).');
  console.error('Staged files:');
  for (const file of files) {
    console.error(`  - ${file}`);
  }
  process.exit(1);
}
