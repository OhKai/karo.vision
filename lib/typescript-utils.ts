export type ValueResult<T> = { ok: true; value: T };
export type ErrorResult<E> = { ok: false; error: E };
export type Result<T, E = any> = ValueResult<T> | ErrorResult<E>;
