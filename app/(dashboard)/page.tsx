"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import VideoCard from "./video-card";
import VideoTile from "./video-tile";
import SearchPage, { useSearchPage } from "@/components/search-page";
import FilesTable from "@/components/files-table";
import { TableCell, TableHead } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { convertSecondsToRoundedString } from "@/lib/utils";

const Home = () => {
  const searchPage = useSearchPage("videos");
  const router = useRouter();

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
                onClick={() => router.push(`/videos/${video.fileId}`)}
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
