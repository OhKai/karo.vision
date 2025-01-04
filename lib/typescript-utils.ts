export type Result<T, E = any> =
  | { ok: true; value: T }
  | { ok: false; error: E };
