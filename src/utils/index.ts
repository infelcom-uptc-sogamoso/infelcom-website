export * from './formating';
export * as validations from './validations';

/** Copies only the listed keys that are present: keeps request bodies from writing other fields. */
export const pick = (obj: Record<string, unknown> | undefined, keys: readonly string[]) =>
  Object.fromEntries(keys.filter((k) => obj?.[k] !== undefined).map((k) => [k, obj![k]]));
