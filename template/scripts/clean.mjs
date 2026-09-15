import { rmSync } from 'node:fs';

for (const path of ['dist', 'coverage', 'docs/api']) {
  rmSync(path, { recursive: true, force: true });
}
