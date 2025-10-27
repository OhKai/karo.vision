"use client";

import SearchBar, { SearchSortBy } from "@/components/search-bar";
import {
  useSearchOptionsStore,
  SearchOptionsState,
} from "@/lib/use-search-options-store";
import { useIntersectionObserver } from "@/lib/use-intersection-observer";
import { INFINITE_SCROLL_PAGE_SIZE } from "@karo-vision/home-cloud-config";
import { useQueryParams } from "@/lib/use-query-params";
import { useState, useMemo } from "react";
import useChange from "@/lib/use-change";
import {
  useQueryClient,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { trpc } from "@/lib/trpc-client";
import type { Inputs, Outputs } from "@/lib/trpc-client";
import { TRPCInfiniteData } from "@trpc/tanstack-react-query";
import { UnionFromGeneric } from "@/lib/typescript-utils";
import { MouseEvent } from "react";

export const parseSearchQuery = (query: URLSearchParams) => {
  const search = [query.get("search") ?? ""];
  const sort = (query.get("sort") ?? "date-desc") as SearchSortBy;
  const seed = parseInt(query.get("seed") ?? "0");

  return { search, sort, seed };
};

export const useSearchPage = <T extends "videos" | "photos" | "music">(
  page: T,
) => {
  const queryClient = useQueryClient();
  const { view: pageView, openInNewTab } = useSearchOptionsStore(
    (state) => state[page],
  );

  useChange(pageView, () => {
    // Wipe cache and force a re-fetch when view changes to avoid performance issues when switching
    // views with a lot of data. Alternative would be to slowly add the cached data but this way we
    // always have fresh data and everything is local (fast) anyways.
    queryClient.resetQueries({ queryKey: trpc[page].list.infiniteQueryKey() });
  });

  const { query, updateQuery, debounceQueryUpdate, isExternalChange } =
    useQueryParams();
  // Get search query from URL.
  const { search, sort, seed } = parseSearchQuery(query);

  const updateSearch = (search: string[]) => {
    // Update new search query in URL with debounce.
    debounceQueryUpdate({ search: search[0] });
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
    (trpc[page] as typeof trpc.videos).list.infiniteQueryOptions(
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
    TRPCInfiniteData<
      UnionFromGeneric<T, Inputs>["list"],
      UnionFromGeneric<T, Outputs>["list"]
    >
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

  // Flatten all entries into a single array for navigation.
  const allEntries = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flat();
  }, [data]);

  // Selected id for modal view.
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const prefetchSiblingEntries = (index: number) => {
    // Prefetch the next and previous entries if they exist so we don't have a short loading state
    // flash when navigating. We could also set the query data from the list we already have, but
    // the data might diverge in the future (e.g. description).
    let newIndex = Math.min(index + 1, allEntries.length - 1);
    queryClient.prefetchQuery(
      (trpc[page] as typeof trpc.videos).byId.queryOptions(
        allEntries[newIndex].fileId,
      ),
    );
    newIndex = Math.max(index - 1, 0);
    queryClient.prefetchQuery(
      (trpc[page] as typeof trpc.videos).byId.queryOptions(
        allEntries[newIndex].fileId,
      ),
    );
  };

  const currentEntryIndex = useMemo(() => {
    return allEntries.findIndex((entry) => entry.fileId === selectedId);
  }, [allEntries, selectedId]);

  /**
   * Handle opening an entry in a modal instead of opening it in a new tab, if the option is
   * selected.
   */
  const onClick = (e: MouseEvent, fileId: number) => {
    if (openInNewTab) {
      return;
    }

    e.preventDefault();
    setSelectedId(fileId);
    prefetchSiblingEntries(
      allEntries.findIndex((entry) => entry.fileId === fileId),
    );
  };

  /**
   * Navigate to the next or previous entry in the list in modal view.
   */
  const onNavigate = (direction: "next" | "prev") => {
    if (!allEntries.length) return;

    // TODO: getting close to the end of the list should trigger a fetch for more entries.
    const newIndex =
      direction === "next"
        ? Math.min(currentEntryIndex + 1, allEntries.length - 1)
        : Math.max(currentEntryIndex - 1, 0);

    if (newIndex !== currentEntryIndex && allEntries[newIndex]) {
      setSelectedId(allEntries[newIndex].fileId);
      prefetchSiblingEntries(newIndex);
    }
  };

  const onModalClose = () => {
    setSelectedId(null);
  };

  const hasNext = currentEntryIndex < allEntries.length - 1;
  const hasPrev = currentEntryIndex > 0;

  return {
    pageView,
    search,
    updateSearch,
    sort,
    updateSort,
    data: allEntries,
    isPending,
    isPlaceholderData,
    tripwireRef,
    tripwireEntry,
    isExternalChange,
    selectedId,
    onClick,
    onNavigate,
    onModalClose,
    hasNext,
    hasPrev,
  };
};

type SearchPageProps = {
  page: keyof SearchOptionsState;
  search: string[];
  updateSearch: (search: string[]) => void;
  sort: SearchSortBy;
  updateSort: (sort: SearchSortBy) => void;
  enabledViews?: SearchOptionsState[keyof SearchOptionsState]["view"][];
  searchOptionsNode?: React.ReactNode;
  children: React.ReactNode;
  isExternalChange?: boolean;
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
  isExternalChange,
}: SearchPageProps) => {
  // Temporarily store search input to debounce it.
  const [tempSearch, setTempSearch] = useState(search);

  console.log("SearchPage render", {
    search,
    isExternalChange,
  });

  // Sync tempSearch with URL search only on external changes (browser navigation)
  useChange(search, () => {
    if (isExternalChange) {
      setTempSearch(search);
    }
  });

  return (
    <div className="mt-[134px] flex flex-col items-center gap-8 pb-4">
      <SearchBar
        className="fixed top-[74px] z-40"
        floating
        value={tempSearch}
        onChange={(newSearch) => {
          setTempSearch(newSearch);
          // Debounce search update.
          updateSearch(newSearch);
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
