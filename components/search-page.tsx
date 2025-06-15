"use client";

import SearchBar, { SearchSortBy } from "@/components/search-bar";
import { useViewStore, ViewState } from "@/lib/use-view-store";
import { useIntersectionObserver } from "@/lib/use-intersection-observer";
import { INFINITE_SCROLL_PAGE_SIZE } from "@/config";
import { useQueryParams } from "@/lib/use-query-params";
import { useState } from "react";
import { useDebounceCallback } from "@/lib/use-debounce-callback";
import useChange from "@/lib/use-change";
import {
  useQueryClient,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { trpc } from "@/lib/trpc-client";
import type { Inputs, Outputs } from "@/lib/trpc-client";
import { TRPCInfiniteData } from "@trpc/tanstack-react-query";

export const useSearchPage = <T extends "videos" | "photos">(page: T) => {
  const queryClient = useQueryClient();
  const pageView = useViewStore((state) => state[page]);

  useChange(pageView, () => {
    // Wipe cache and force a re-fetch when view changes to avoid performance issues when switching
    // views with a lot of data. Alternative would be to slowly add the cached data but this way we
    // always have fresh data and everything is local (fast) anyways.
    queryClient.resetQueries({ queryKey: trpc[page].list.infiniteQueryKey() });
  });

  const { query, updateQuery } = useQueryParams();
  // Get search query from URL.
  const search = [query.get("search") ?? ""];
  const sort = (query.get("sort") ?? "date-desc") as SearchSortBy;
  const seed = parseInt(query.get("seed") ?? "0");

  const updateSearch = (search: string[]) => {
    // Update new search query in URL.
    updateQuery({ search: search[0] });
  };

  const updateSort = (newSort: SearchSortBy) => {
    // Reset seed when sorting by random.
    const seed =
      newSort === "random"
        ? Math.floor(Math.random() * 2147483648).toString()
        : "";
    updateQuery({ sort: newSort, seed });
  };

  const {
    data,
    isPending,
    isPlaceholderData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    // Since typescript doesn't let us call a union type of different function signatures, we cast
    // the call as the specific "videos" one and then cast the result as the generic type. The
    // routes should have the same input.
    (
      trpc[page].list
        .infiniteQueryOptions as typeof trpc.videos.list.infiniteQueryOptions
    )(
      {
        direction: "forward",
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
    ),
  ) as UseInfiniteQueryResult<
    TRPCInfiniteData<Inputs[typeof page]["list"], Outputs[typeof page]["list"]>
  >;

  // The ref callback can be used on multiple elements. It will set the same entry and call the same
  // onChange handler.
  const [_tripwireRef, tripwireEntry] = useIntersectionObserver<HTMLDivElement>(
    {
      onChange: (newEntry) => {
        if (newEntry.isIntersecting) {
          fetchNextPage();
        }
      },
    },
  );
  const tripwireRef =
    hasNextPage && isFetchingNextPage ? undefined : _tripwireRef;

  return {
    pageView,
    search,
    updateSearch,
    sort,
    updateSort,
    data,
    isPending,
    isPlaceholderData,
    tripwireRef,
    tripwireEntry,
  };
};

type SearchPageProps = {
  page: keyof ViewState;
  search: string[];
  updateSearch: (search: string[]) => void;
  sort: SearchSortBy;
  updateSort: (sort: SearchSortBy) => void;
  enabledViews?: ViewState[keyof ViewState][];
  searchOptionsNode?: React.ReactNode;
  children: React.ReactNode;
};

const SearchPage = ({
  page,
  search,
  updateSearch,
  sort,
  updateSort,
  enabledViews,
  searchOptionsNode,
  children,
}: SearchPageProps) => {
  // Temporarily store search input to debounce it.
  const [tempSearch, setTempSearch] = useState(search);
  const [debounceSearch, clearDebounce] = useDebounceCallback(
    updateSearch,
    300,
  );

  return (
    <div className="mt-[134px] flex flex-col items-center gap-8 pb-4">
      <SearchBar
        className="fixed top-[74px] z-40"
        floating
        value={tempSearch}
        onChange={(newSearch) => {
          setTempSearch(newSearch);
          // Debounce search update.
          debounceSearch(newSearch);
        }}
        sortValue={sort}
        onSortChange={updateSort}
        viewToggle={
          enabledViews && {
            page,
            enabledViews,
          }
        }
        searchOptionsNode={searchOptionsNode}
      />
      {children}
    </div>
  );
};

export default SearchPage;
