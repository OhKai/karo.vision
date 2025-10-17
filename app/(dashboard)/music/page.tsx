"use client";

import SearchPage, { useSearchPage } from "@/components/search-page";
import FilesTable from "@/components/files-table";
import { TableHead } from "@/components/ui/table";
import MusicModal from "@/components/music-modal";
import { useAudioPlayer } from "@/lib/use-audio-player";
import { useQueryParams } from "@/lib/use-query-params";

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
              <FilesTable.ThumbnailCell fileId={title.fileId} />
            </FilesTable.Row>
          ))}
        </FilesTable>
      )}
      <MusicModal
        isOpen={searchPage.selectedId !== null}
        onOpenChange={() => {
          searchPage.onModalClose();
        }}
      />
    </SearchPage>
  );
};

export default MusicPage;
