import { useCallback, useEffect, useState } from "react";

export const useQueryParams = () => {
  const [query, setQuery] = useState<URLSearchParams>(
    new URLSearchParams(window.location.search),
  );

  // TODO: if this hook gets used a lot, maybe put this in a zustand store instead.
  useEffect(() => {
    const syncUrlParams = () => {
      setQuery(new URLSearchParams(window.location.search));
    };

    // Listen to popstate event (browser back/forward)
    window.addEventListener("popstate", syncUrlParams);

    return () => {
      window.removeEventListener("popstate", syncUrlParams);
    };
  }, []);

  const updateQuery = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(query.toString());
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }

      // Update URL without reload
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${newParams.toString()}`,
      );

      setQuery(newParams);
    },
    [query],
  );

  return { query, updateQuery };
};
