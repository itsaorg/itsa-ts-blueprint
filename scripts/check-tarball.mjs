import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';

const output = execSync('npm pack --silent --ignore-scripts', { encoding: 'utf8' });
const tarball = output
  .trim()
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line.endsWith('.tgz'))
  .pop();

if (!tarball) {
  console.error('npm pack did not produce a tarball');
  process.exit(1);
}

const forbidden = [
  'package/tests/',
  'package/scripts/',
  'package/.github/',
  'package/template/',
  'package/config/',
];
const required = ['package/CHANGELOG.md'];
const listing = execSync(`tar -tzf "${tarball}"`, { encoding: 'utf8' });
const hits = forbidden.filter((entry) => listing.includes(entry));
const missing = required.filter((entry) => !listing.includes(entry));
rmSync(tarball, { force: true });

if (hits.length > 0) {
  console.error('Forbidden paths in tarball:', hits.join(', '));
  process.exit(1);
}
if (missing.length > 0) {
  console.error('Missing required paths in tarball:', missing.join(', '));
  process.exit(1);
}
console.log('Tarball inspection passed');
