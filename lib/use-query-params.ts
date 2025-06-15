"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateQuery = useCallback(
    (newParams: { [key: string]: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname],
  );

  return {
    query: searchParams,
    updateQuery,
  };
};
