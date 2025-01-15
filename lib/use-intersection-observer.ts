// Adapted from https://github.com/uidotdev/usehooks/blob/90fbbb4cc085e74e50c36a62a5759a40c62bb98e/index.js#L512
// usehooks-ts used useEffect instead of ref callback.

import { useCallback, useState } from "react";

export const useIntersectionObserver = <T extends Element>(
  options: IntersectionObserverInit & {
    onChange?: (newEntry: IntersectionObserverEntry) => void;
  } = {},
) => {
  const { threshold = 0, root = null, rootMargin = "0px" } = options;
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const customRef = useCallback<React.RefCallback<T>>(
    (node) => {
      if (node?.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          options.onChange?.(entry);
          setEntry(entry);
        },
        { threshold, root, rootMargin },
      );

      observer.observe(node);

      // Cleanup.
      return () => {
        observer.disconnect();
      };
    },
    [threshold, root, rootMargin],
  );

  return [customRef, entry] as const;
};
