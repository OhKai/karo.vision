"use client";

import VideoCard from "./video-card";
import VideoTile from "./video-tile";
import SearchPage, { useSearchPage } from "@/components/search-page";
import FilesTable from "@/components/files-table";
import { TableCell, TableHead } from "@/components/ui/table";
import { convertSecondsToRoundedString } from "@/lib/utils";
import VideoModal from "@/components/video-modal";
import ModalSwitch from "@/components/modal-switch";

const Home = () => {
  const searchPage = useSearchPage("videos");

  return (
    <SearchPage
      page="videos"
      enabledViews={["list", "cards", "tiles"]}
      searchOptionsNode={<ModalSwitch viewKey="videos" />}
      {...searchPage}
    >
      {searchPage.isPending ? (
        <div>Loading...</div>
      ) : (searchPage.data?.length ?? 0) === 0 ? (
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
          {searchPage.data?.map((video, videoIndex) => (
            <FilesTable.Row
              key={video.fileId}
              file={video.file}
              isPending={searchPage.isPlaceholderData}
              ref={
                videoIndex === searchPage.data.length - 25 ||
                videoIndex === searchPage.data.length - 1
                  ? searchPage.tripwireRef
                  : undefined
              }
              onClick={(e) => searchPage.onClick(e, video.fileId)}
            >
              <FilesTable.ThumbnailCell fileId={video.fileId} />
              <TableCell className="max-w-[65px] truncate max-md:px-2 md:w-[100px] md:max-w-[100px]">
                {convertSecondsToRoundedString(video.duration)}
              </TableCell>
            </FilesTable.Row>
          ))}
        </FilesTable>
      ) : searchPage.pageView === "cards" ? (
        <div className="flex flex-col gap-3.5 px-3">
          {searchPage.data?.map((video, videoIndex) => (
            <VideoCard
              key={video.fileId}
              video={video}
              onClick={(e) => searchPage.onClick(e, video.fileId)}
              ref={
                videoIndex === searchPage.data.length - 10 ||
                videoIndex === searchPage.data.length - 1
                  ? searchPage.tripwireRef
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="grid w-full max-w-[2808px] grid-cols-1 gap-3 px-2 min-[680px]:grid-cols-2 min-[1300px]:grid-cols-4 min-[1600px]:grid-cols-5 min-[2090px]:grid-cols-6 md:px-6 lg:grid-cols-3">
          {searchPage.data?.map((video, videoIndex) => (
            <VideoTile
              key={video.fileId}
              video={video}
              onClick={(e) => searchPage.onClick(e, video.fileId)}
              ref={
                videoIndex === searchPage.data.length - 13 ||
                videoIndex === searchPage.data.length - 1
                  ? searchPage.tripwireRef
                  : undefined
              }
            />
          ))}
        </div>
      )}
      <VideoModal
        videoId={searchPage.selectedId}
        isOpen={searchPage.selectedId !== null}
        onOpenChange={() => {
          searchPage.onModalClose();
        }}
        onNavigate={searchPage.onNavigate}
        hasNext={searchPage.hasNext}
        hasPrev={searchPage.hasPrev}
      />
    </SearchPage>
  );
};

export default Home;
