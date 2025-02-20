import { SearchSortBy } from "@/components/search-bar";
import { useQueryParams } from "./use-query-params";
import { useState } from "react";
import { useDebounceCallback } from "./use-debounce-callback";
import { trpc } from "./trpc-client";
import { INFINITE_SCROLL_PAGE_SIZE } from "@/config";
import { useIntersectionObserver } from "./use-intersection-observer";
import { useTRPCInfiniteQuery } from "@trpc/react-query";

const useSearchQuery = (useInfiniteQuery: useTRPCInfiniteQuery) => {
  const { query, updateQuery } = useQueryParams();
  // Get search query from URL.
  const search = [query.get("search") ?? ""];
  const sort = (query.get("sort") ?? "date-desc") as SearchSortBy;
  const seed = parseInt(query.get("seed") ?? "0");
  // Temporarily store search input to debounce it.
  const [tempSearch, setTempSearch] = useState(search);
  const [updateSearch, clearDebounce] = useDebounceCallback(
    (search: string[]) => {
      // Update new search query in URL.
      updateQuery("search", search[0]);
    },
    300,
  );

  const {
    data,
    isPending,
    isPlaceholderData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = trpc.videos.list.useInfiniteQuery(
    {
      search: search.filter((q) => q.length > 0),
      seed: sort === "random" ? seed : undefined,
      sort,
    },
    {
      // TODO: I plan to have SSE updates for server-side changes so we should not need revalidations?
      staleTime: Infinity,
      getNextPageParam: (lastPage, pages) =>
        // TODO: This fetches one more empty page if the cutoff is exactly the page size.
        lastPage.length === INFINITE_SCROLL_PAGE_SIZE
          ? pages.length * INFINITE_SCROLL_PAGE_SIZE
          : undefined,
      placeholderData: (prev) => prev,
    },
  );

  // The ref callback can be used on multiple elements. It will set the same entry and call the same
  // onChange handler.
  const [_tripwireRef, entry] = useIntersectionObserver<HTMLDivElement>({
    onChange: (newEntry) => {
      if (newEntry.isIntersecting) {
        fetchNextPage();
      }
    },
  });
  const tripwireRef =
    hasNextPage && isFetchingNextPage ? undefined : _tripwireRef;
  const onSortChange = (newSort: SearchSortBy) => {
    updateQuery("sort", newSort);
    if (newSort === "random") {
      // Reset search when sorting by random.
      updateQuery("seed", Math.floor(Math.random() * 2147483648).toString());
    } else {
      updateQuery("seed", "");
    }
  };

  return {
    tripwireRef,
    onSortChange,
    data,
    isPending,
    isPlaceholderData,
    tempSearch,
    setTempSearch,
    updateSearch,
    clearDebounce,
  };
};

export default useSearchQuery;
