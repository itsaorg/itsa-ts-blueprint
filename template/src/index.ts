export type BlueprintHealth = {
  readonly status: 'ok';
  readonly package: '__PACKAGE_NAME__';
};

export function getBlueprintHealth(): BlueprintHealth {
  return {
    status: 'ok',
    package: '__PACKAGE_NAME__',
  };
}
