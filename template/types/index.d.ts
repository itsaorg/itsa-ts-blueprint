export type BlueprintHealth = {
  readonly status: 'ok';
  readonly package: '__PACKAGE_NAME__';
};

export declare function getBlueprintHealth(): BlueprintHealth;
