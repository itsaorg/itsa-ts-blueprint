import { describe, expect, it } from 'vitest';

describe('deep import guard', () => {
  it('rejects subpath imports at runtime', async () => {
    await expect(import('@itsa/ts-blueprint/internal')).rejects.toThrow();
  });
});
