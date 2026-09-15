import { describe, expect, it } from 'vitest';
import { getBlueprintHealth } from '__PACKAGE_NAME__';

describe('consumer import', () => {
  it('imports the public package entrypoint', () => {
    expect(getBlueprintHealth().status).toBe('ok');
  });
});
