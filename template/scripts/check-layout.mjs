import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'src';
const PRINCIPAL_PATTERN =
  /export\s+(?:default\s+)?(?:async\s+)?(?:function|class|enum)\s+[A-Za-z_$]/g;

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) entries.push(...walk(full));
    else if (name.endsWith('.ts')) entries.push(full);
  }
  return entries;
}

let failed = false;
for (const file of walk(SRC)) {
  const content = readFileSync(file, 'utf8');
  const matches = content.match(PRINCIPAL_PATTERN) ?? [];
  if (matches.length > 1) {
    console.error(`Layout violation: ${file} exports ${matches.length} principals`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('Layout check passed');
