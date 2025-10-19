"use client";

import SearchPage, { useSearchPage } from "@/components/search-page";
import FilesTable from "@/components/files-table";
import { TableHead, TableCell } from "@/components/ui/table";
import MusicModal from "@/components/music-modal";
import { useAudioPlayer } from "@/lib/use-audio-player";
import { useQueryParams } from "@/lib/use-query-params";
import AudioBarAnimation from "@/components/audio-bar-animation";

const MusicPage = () => {
  const searchPage = useSearchPage("music");
  const { query } = useQueryParams();
  const audioPlayer = useAudioPlayer();

  return (
    <SearchPage page="music" {...searchPage}>
      {searchPage.isPending ? (
        <div>Loading...</div>
      ) : (searchPage.data?.length ?? 0) === 0 ? (
        searchPage.isPlaceholderData ? (
          <div>Loading</div>
        ) : (
          <div className="text-accent-foreground mt-12 text-lg font-extralight">
            No music found
          </div>
        )
      ) : (
        <FilesTable
          tableHeadNode={
            <>
              <TableHead className="px-0"></TableHead>
            </>
          }
        >
          {searchPage.data?.map((title, photoIndex) => (
            <FilesTable.Row
              key={title.fileId}
              file={title.file}
              isPending={searchPage.isPlaceholderData}
              ref={
                photoIndex === searchPage.data.length - 25 ||
                photoIndex === searchPage.data.length - 1
                  ? searchPage.tripwireRef
                  : undefined
              }
              onClick={(e) => {
                searchPage.onClick(e, title.fileId);
                audioPlayer.playTrack(title.fileId, query.toString());
              }}
            >
              {audioPlayer.currentTrackId === title.fileId &&
              audioPlayer.isPlaying ? (
                <TableCell className="flex h-[48.5px] w-[84px] min-w-[84px] items-center justify-center p-1 pl-2 md:w-[92px] md:min-w-[92px] md:pl-4">
                  <AudioBarAnimation />
                </TableCell>
              ) : (
                <FilesTable.ThumbnailCell fileId={title.fileId} />
              )}
            </FilesTable.Row>
          ))}
        </FilesTable>
      )}
      <MusicModal
        isOpen={searchPage.selectedId !== null}
        onOpenChange={() => {
          searchPage.onModalClose();
          // Only keep mini player if audio wasn't paused in the modal.
          !audioPlayer.isPlaying && audioPlayer.stop();
        }}
      />
    </SearchPage>
  );
};

export default MusicPage;
