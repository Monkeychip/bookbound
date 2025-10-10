// Shared lightweight type helpers
// LooseObject is a small alias for objects with unknown property values.
// Prefer narrowing `unknown` with type guards at the use-site rather than
// widening to `any` globally.
export type LooseObject = Record<string, unknown>;
