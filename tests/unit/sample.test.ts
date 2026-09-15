import { describe, expect, it } from 'vitest';
import { getBlueprintHealth } from '../../src/index.js';

describe('getBlueprintHealth', () => {
  it('returns ok status', () => {
    expect(getBlueprintHealth()).toEqual({
      status: 'ok',
      package: '@itsa/ts-blueprint',
    });
  });
});
