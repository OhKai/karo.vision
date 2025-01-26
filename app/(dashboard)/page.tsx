"use client";

import SearchBar, { SearchSortBy } from "@/components/search-bar";
import { useViewStore } from "@/lib/use-view-store";
import ViewToggleGroup from "@/components/view-toggle-group";
import SortToggleGroup from "@/components/sort-toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import VideosTable from "./videos-table";
import { trpc } from "@/lib/trpc-client";
import { useIntersectionObserver } from "@/lib/use-intersection-observer";
import { INFINITE_SCROLL_PAGE_SIZE } from "@/config";
import VideoCard from "./video-card";
import VideoTile from "./video-tile";
import { useQueryParams } from "@/lib/use-query-params";
import { useState } from "react";
import { useDebounceCallback } from "@/lib/use-debounce-callback";

const Home = () => {
  const videosView = useViewStore((state) => state.videos);
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
    data: videosData,
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

  return (
    <div className="mt-[134px] flex flex-col gap-8 items-center pb-4">
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
        onSortChange={onSortChange}
        searchOptionsNode={
          <>
            <ViewToggleGroup
              viewKey="videos"
              enabledViews={["list", "cards", "tiles"]}
            />
            <SortToggleGroup
              className="flex md:hidden"
              value={sort}
              onChange={onSortChange}
            />
            <div className="flex items-center space-x-2">
              <Switch id="open-blank" />
              <Label htmlFor="open-blank" className="text-xs">
                Open In New Tab
              </Label>
            </div>
          </>
        }
      />
      {isPending ? (
        <div>Loading...</div>
      ) : (videosData?.pages?.[0].length ?? 0) === 0 ? (
        isPlaceholderData ? (
          <div>Loading</div>
        ) : (
          <div className="text-lg font-extralight text-accent-foreground mt-12">
            No videos found
          </div>
        )
      ) : videosView === "list" ? (
        <VideosTable
          videosPages={videosData?.pages}
          ref={tripwireRef}
          isPending={isPlaceholderData}
        />
      ) : videosView === "cards" ? (
        <div className="flex flex-col gap-3.5 px-3">
          {videosData?.pages?.map((page, pageIndex) =>
            page.map((video, videoIndex) => (
              <VideoCard
                key={video.fileId}
                video={video}
                ref={
                  pageIndex === videosData.pages.length - 1 &&
                  (videoIndex === page.length - 10 ||
                    videoIndex === page.length - 1)
                    ? tripwireRef
                    : undefined
                }
              />
            )),
          )}
        </div>
      ) : (
        <div className="max-w-[2808px] grid min-[2090px]:grid-cols-6 min-[1600px]:grid-cols-5 min-[1300px]:grid-cols-4 lg:grid-cols-3 min-[680px]:grid-cols-2 grid-cols-1 w-full md:px-6 px-2 gap-3">
          {videosData?.pages?.map((page, pageIndex) =>
            page.map((video, videoIndex) => (
              <VideoTile
                key={video.fileId}
                video={video}
                ref={
                  pageIndex === videosData.pages.length - 1 &&
                  (videoIndex === page.length - 13 ||
                    videoIndex === page.length - 1)
                    ? tripwireRef
                    : undefined
                }
              />
            )),
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
