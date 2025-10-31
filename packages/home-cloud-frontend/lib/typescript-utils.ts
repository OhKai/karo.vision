export type ValueResult<T> = { ok: true; value: T };
export type ErrorResult<E> = { ok: false; error: E };
export type Result<T, E = unknown> = ValueResult<T> | ErrorResult<E>;

/**
 * Converts a generic indexed access type into a union of all possible values using distributive
 * conditional types.
 *
 * When using `O[T]` with generic `T extends keyof O`, TypeScript preserves it as an unresolved
 * indexed access type, preventing access to properties common across all possible values.
 *
 * This utility forces TypeScript to evaluate all possible values by leveraging distribution:
 * - The `T extends T` condition (always true) triggers distribution over union types
 * - For `T = "a" | "b"`, TypeScript transforms: `T extends T ? O[T] : never`
 * - Into: `(O["a"] | O["b"])` - a concrete union type
 * - This allows TypeScript to recognize properties shared across all union members
 *
 * @template T - Keys to extract from object O
 * @template O - The object type containing the values
 *
 * @example
 * ```ts
 * interface API {
 *   users: { id: string; name: string; email: string };
 *   posts: { id: string; title: string; author: string };
 * }
 *
 * // Without distribution: API[T] - no common properties visible
 * // With distribution: API["users"] | API["posts"] - id property accessible
 *
 * function fetchData<T extends keyof API>(endpoint: T): UnionFromGeneric<T, API> {
 *   // Return type allows access to common properties like 'id'
 * }
 * ```
 */
export type UnionFromGeneric<T extends keyof O, O> = T extends T ? O[T] : never;
