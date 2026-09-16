import { describe, expect, it } from 'vitest';
import { getBlueprintHealth } from '@itsaorg/ts-blueprint';

describe('consumer import', () => {
  it('imports the public package entrypoint', () => {
    expect(getBlueprintHealth().status).toBe('ok');
  });
});
