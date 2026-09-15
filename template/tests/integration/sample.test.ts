import { describe, expect, it } from 'vitest';
import { getBlueprintHealth } from '../../src/index.js';

describe('integration sample', () => {
  it('exports stable health payload', () => {
    const health = getBlueprintHealth();
    expect(health.status).toBe('ok');
    expect(health.package).toContain('__PACKAGE_NAME_UNSCOPED__');
  });
});
