// Lightweight runtime type guards to help narrow `unknown` values coming from
// external sources (like fetch/res.json()). Keep these small and focused so
// callers still perform domain-specific checks.

export function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

export function isArrayOfUnknown(x: unknown): x is unknown[] {
  return Array.isArray(x);
}

export function hasPropOfType<T extends string>(
  obj: Record<string, unknown>,
  key: string,
  type: T,
): boolean {
  return typeof obj[key] === type;
}
