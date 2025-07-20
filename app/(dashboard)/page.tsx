"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import VideoCard from "./video-card";
import VideoTile from "./video-tile";
import SearchPage, { useSearchPage } from "@/components/search-page";
import FilesTable from "@/components/files-table";
import { TableCell, TableHead } from "@/components/ui/table";
import { convertSecondsToRoundedString } from "@/lib/utils";
import VideoModal from "@/components/video-modal";
import { useState, useMemo } from "react";

const Home = () => {
  const searchPage = useSearchPage("videos");
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Flatten all videos into a single array for navigation
  const allVideos = useMemo(() => {
    if (!searchPage.data?.pages) return [];
    return searchPage.data.pages.flat();
  }, [searchPage.data]);

  const currentVideoIndex = useMemo(() => {
    if (!selectedVideoId || !allVideos.length) return -1;
    return allVideos.findIndex((video) => video.fileId === selectedVideoId);
  }, [selectedVideoId, allVideos]);

  const handleOpenVideo = (videoId: number) => {
    setSelectedVideoId(videoId);
    setIsModalOpen(true);
  };

  const handleNavigate = (direction: "next" | "prev") => {
    if (!allVideos.length) return;

    // TODO: getting close to the end of the list should trigger a fetch for more videos.
    const newIndex =
      direction === "next"
        ? Math.min(currentVideoIndex + 1, allVideos.length - 1)
        : Math.max(currentVideoIndex - 1, 0);

    if (newIndex !== currentVideoIndex && allVideos[newIndex]) {
      setSelectedVideoId(allVideos[newIndex].fileId);
    }
  };

  const hasNext = currentVideoIndex < allVideos.length - 1;
  const hasPrev = currentVideoIndex > 0;

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
          <div className="text-accent-foreground mt-12 text-lg font-extralight">
            No videos found
          </div>
        )
      ) : searchPage.pageView === "list" ? (
        <FilesTable
          tableHeadNode={
            <>
              <TableHead className="px-0"></TableHead>
              <TableHead className="max-md:px-2">Duration</TableHead>
            </>
          }
        >
          {searchPage.data?.pages?.map((page, pageIndex) =>
            page.map((video, videoIndex) => (
              <FilesTable.Row
                key={video.fileId}
                file={video.file}
                isPending={searchPage.isPlaceholderData}
                ref={
                  pageIndex === searchPage.data!.pages.length - 1 &&
                  (videoIndex === page.length - 25 ||
                    videoIndex === page.length - 1)
                    ? searchPage.tripwireRef
                    : undefined
                }
                onClick={() => handleOpenVideo(video.fileId)}
              >
                <FilesTable.ThumbnailCell fileId={video.fileId} />
                <TableCell className="max-w-[65px] truncate max-md:px-2 md:w-[100px] md:max-w-[100px]">
                  {convertSecondsToRoundedString(video.duration)}
                </TableCell>
              </FilesTable.Row>
            )),
          )}
        </FilesTable>
      ) : searchPage.pageView === "cards" ? (
        <div className="flex flex-col gap-3.5 px-3">
          {searchPage.data?.pages?.map((page, pageIndex) =>
            page.map((video, videoIndex) => (
              <VideoCard
                key={video.fileId}
                video={video}
                onClick={() => handleOpenVideo(video.fileId)}
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
        <div className="grid w-full max-w-[2808px] grid-cols-1 gap-3 px-2 min-[680px]:grid-cols-2 min-[1300px]:grid-cols-4 min-[1600px]:grid-cols-5 min-[2090px]:grid-cols-6 md:px-6 lg:grid-cols-3">
          {searchPage.data?.pages?.map((page, pageIndex) =>
            page.map((video, videoIndex) => (
              <VideoTile
                key={video.fileId}
                video={video}
                onClick={() => handleOpenVideo(video.fileId)}
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
      <VideoModal
        videoId={selectedVideoId}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onNavigate={handleNavigate}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    </SearchPage>
  );
};

export default Home;
