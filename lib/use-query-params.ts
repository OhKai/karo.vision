"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage query parameters in the URL with debounced updates. This is useful for
 * search filters, pagination, and other query-based state management. The debounce mechanism can be
 * used with input changes to avoid excessive URL updates and performance issues.
 *
 * The need for this originally arose from the various issues with needing to batch simultaneous
 * query updates, a small delay between between router.push() and the updated search prop from
 * useSearchQuery() making a clearDebounce() at that point too late, and needing to clear the
 * debounce on sort change while still using the latest input value for the query.
 */
export const useQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debouncedUpdatesRef = useRef<Record<string, string>>({});
  const debounceTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  const updateQuery = useCallback(
    (updates: Record<string, string>) => {
      const current = new URLSearchParams(searchParams);

      // Merge with any debounced updates first.
      const allUpdates = { ...debouncedUpdatesRef.current, ...updates };

      if (!Object.keys(allUpdates).length) {
        // If there are no updates, do nothing.
        return;
      }

      // Apply all updates together.
      Object.entries(allUpdates).forEach(([key, value]) => {
        if (value) {
          current.set(key, value);
        } else {
          current.delete(key);
        }
      });

      // Clear debounced updates since we're applying them now.
      debouncedUpdatesRef.current = {};

      // Clear any pending timeout.
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = undefined;
      }

      router.push(`?${current.toString()}`);
    },
    [router, searchParams],
  );

  const debounceQueryUpdate = useCallback(
    (updates: Record<string, string>, delay = 300) => {
      // Merge with existing debounced updates.
      debouncedUpdatesRef.current = {
        ...debouncedUpdatesRef.current,
        ...updates,
      };

      // Clear existing timeout.
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout.
      debounceTimeoutRef.current = setTimeout(() => {
        updateQuery({});
      }, delay);
    },
    [updateQuery],
  );

  const clearDebouncedUpdates = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = undefined;
    }
    debouncedUpdatesRef.current = {};
  }, []);

  useEffect(() => {
    // Immediately apply and clear any debounced updates since last query change was triggered to
    // avoid stale input using old search params. Necessary since there is a delay between the
    // router push change and the query update hook. e.g. sort change router.push() -> input
    // debounce -> sort change URL query update -> need to clear debounce to avoid stale old sort
    // value
    updateQuery({});
  }, [updateQuery]);

  return {
    query: searchParams,
    updateQuery,
    debounceQueryUpdate,
    clearDebouncedUpdates,
  };
};
