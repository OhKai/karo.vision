"use client";

import Image from "next/image";
import SearchBar, { SearchSortBy } from "@/components/search-bar";
import { useViewStore } from "@/lib/use-view-store";
import Tags from "@/components/tags";
import ViewToggleGroup from "@/components/view-toggle-group";
import SortToggleGroup from "@/components/sort-toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Masonry from "@wowblvck/react-responsive-masonry";
import { trpc } from "@/lib/trpc-client";
import { useIntersectionObserver } from "@/lib/use-intersection-observer";
import { INFINITE_SCROLL_PAGE_SIZE } from "@/config";
import { useResizeStore } from "@/lib/use-resize-store";
import { useQueryParams } from "@/lib/use-query-params";
import { useState } from "react";
import { useDebounceCallback } from "@/lib/use-debounce-callback";

const PhotosPage = () => {
  const utils = trpc.useUtils();
  const photosView = useViewStore((state) => state.photos);
  const [prevView, setPrevView] = useState(photosView);
  const windowWidth = useResizeStore((state) => state.windowWidth);

  // https://react.dev/reference/react/useState#storing-information-from-previous-renders
  if (prevView !== photosView) {
    setPrevView(photosView);
    // Wipe cache and force a re-fetch when view changes to avoid performance issues when switching
    // views with a lot of data. Alternative would be to slowly add the cached data but this way we
    // always have fresh data and everything is local (fast) anyways.
    utils.photos.list.reset();
  }

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
    data: photosData,
    isPending,
    isPlaceholderData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = trpc.photos.list.useInfiniteQuery(
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
        className="fixed top-[74px]"
        floating
        searchOptionsNode={
          <>
            <ViewToggleGroup
              viewKey="photos"
              enabledViews={["list", "posters", "tiles"]}
            />
            <SortToggleGroup className="flex md:hidden" />
            <div className="flex items-center space-x-2">
              <Switch id="open-blank" />
              <Label htmlFor="open-blank" className="text-xs">
                Open In New Tab
              </Label>
            </div>
          </>
        }
      />
      {photosView === "list" ? null : photosView === "posters" ? ( //<FilesTable />
        <div className="max-w-[2808px] w-full md:px-6 px-2">
          <Masonry
            columnsCount={windowWidth < 768 ? 1 : windowWidth < 1400 ? 2 : 3}
            gutter="8px"
          >
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.2:53852/fs?path=%2Fmedia%2Fpi%2FSeagate%20B%2F_lib%2Fpics%2F1024watermarked%2FDSC_0181.jpg"
                alt=""
                className="rounded"
                width={996}
                height={1500}
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
          </Masonry>
        </div>
      ) : (
        <div className="max-w-[2808px] grid min-[2090px]:grid-cols-6 min-[1600px]:grid-cols-5 min-[1300px]:grid-cols-4 lg:grid-cols-3 min-[680px]:grid-cols-2 grid-cols-1 w-full md:px-6 px-2 gap-3"></div>
      )}
    </div>
  );
};

export default PhotosPage;
