import { useMemo, useRef } from "react";

export function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): [T, () => void] {
  const timeoutRef = useRef<number>(0);

  const cb = useMemo(() => {
    // Clear existing timeout when callback changes.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const debouncedFn = ((...args: Parameters<T>) => {
      // Clear existing timeout when callback is called.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay) as unknown as number;
    }) as T;

    return debouncedFn;
  }, [callback.toString(), delay]);

  return [cb, () => clearTimeout(timeoutRef.current)];
}
