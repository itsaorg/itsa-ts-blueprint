import { existsSync, readFileSync } from 'node:fs';

const typesFile = 'types/index.d.ts';
const jsFile = 'dist/index.js';

for (const file of [typesFile, jsFile]) {
  if (!existsSync(file)) {
    console.error(`Missing ${file}; run npm run build first`);
    process.exit(1);
  }
}

const types = readFileSync(typesFile, 'utf8');
const required = ['BlueprintHealth', 'getBlueprintHealth'];
const missing = required.filter((symbol) => !types.includes(symbol));
if (missing.length > 0) {
  console.error('types/index.d.ts missing symbols:', missing.join(', '));
  process.exit(1);
}
console.log('Types mirror check passed');
