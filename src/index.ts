export type BlueprintHealth = {
  readonly status: 'ok';
  readonly package: '@itsa/ts-blueprint';
};

export function getBlueprintHealth(): BlueprintHealth {
  return {
    status: 'ok',
    package: '@itsa/ts-blueprint',
  };
}
