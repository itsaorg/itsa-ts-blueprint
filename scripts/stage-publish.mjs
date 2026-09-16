#!/usr/bin/env node
import { execFileSync, execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const { name, version } = pkg;

function npmView(spec) {
  try {
    execFileSync('npm', ['view', spec, 'version'], { stdio: ['ignore', 'pipe', 'ignore'] });
    return true;
  } catch {
    return false;
  }
}

if (npmView(`${name}@${version}`)) {
  console.log(`${name}@${version} is already public on npm; skipping stage publish.`);
  process.exit(0);
}

console.log(`Staging ${name}@${version} for npm approval...`);
execSync('npm stage publish', { stdio: 'inherit' });
console.log('Staged successfully. Approve at npm → Staged Packages before the version is public.');
