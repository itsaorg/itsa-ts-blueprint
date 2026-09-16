export type BlueprintHealth = {
  readonly status: 'ok';
  readonly package: '@itsaorg/ts-blueprint';
};

export function getBlueprintHealth(): BlueprintHealth {
  return {
    status: 'ok',
    package: '@itsaorg/ts-blueprint',
  };
}
