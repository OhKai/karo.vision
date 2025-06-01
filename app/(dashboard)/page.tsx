"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import VideosTable from "./videos-table";
import VideoCard from "./video-card";
import VideoTile from "./video-tile";
import SearchPage, { useSearchPage } from "@/components/search-page";

const Home = () => {
  const searchPage = useSearchPage("videos");

  return (
    <SearchPage
      page="videos"
      enabledViews={["list", "cards", "tiles"]}
      searchOptionsNode={
        <div className="flex items-center space-x-2">
          <Switch id="open-blank" />
          <Label htmlFor="open-blank" className="text-sm">
            Open in new tab
          </Label>
        </div>
      }
      {...searchPage}
    >
      {searchPage.isPending ? (
        <div>Loading...</div>
      ) : (searchPage.data?.pages?.[0].length ?? 0) === 0 ? (
        searchPage.isPlaceholderData ? (
          <div>Loading</div>
        ) : (
          <div className="text-lg font-extralight text-accent-foreground mt-12">
            No videos found
          </div>
        )
      ) : searchPage.pageView === "list" ? (
        <VideosTable
          videosPages={searchPage.data?.pages}
          ref={searchPage.tripwireRef}
          isPending={searchPage.isPlaceholderData}
        />
      ) : searchPage.pageView === "cards" ? (
        <div className="flex flex-col gap-3.5 px-3">
          {searchPage.data?.pages?.map((page, pageIndex) =>
            page.map((video, videoIndex) => (
              <VideoCard
                key={video.fileId}
                video={video}
                ref={
                  pageIndex === searchPage.data!.pages.length - 1 &&
                  (videoIndex === page.length - 10 ||
                    videoIndex === page.length - 1)
                    ? searchPage.tripwireRef
                    : undefined
                }
              />
            )),
          )}
        </div>
      ) : (
        <div className="max-w-[2808px] grid min-[2090px]:grid-cols-6 min-[1600px]:grid-cols-5 min-[1300px]:grid-cols-4 lg:grid-cols-3 min-[680px]:grid-cols-2 grid-cols-1 w-full md:px-6 px-2 gap-3">
          {searchPage.data?.pages?.map((page, pageIndex) =>
            page.map((video, videoIndex) => (
              <VideoTile
                key={video.fileId}
                video={video}
                ref={
                  pageIndex === searchPage.data!.pages.length - 1 &&
                  (videoIndex === page.length - 13 ||
                    videoIndex === page.length - 1)
                    ? searchPage.tripwireRef
                    : undefined
                }
              />
            )),
          )}
        </div>
      )}
    </SearchPage>
  );
};

export default Home;
