"use client";

import SearchPage, { useSearchPage } from "@/components/search-page";
import FilesTable from "@/components/files-table";
import { TableHead } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import MusicModal from "@/components/music-modal";

const MusicPage = () => {
  const searchPage = useSearchPage("music");
  const router = useRouter();

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
              onClick={(e) => searchPage.onClick(e, title.fileId)}
            >
              <FilesTable.ThumbnailCell fileId={title.fileId} />
            </FilesTable.Row>
          ))}
        </FilesTable>
      )}
      <MusicModal
        musicId={searchPage.selectedId}
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

export default MusicPage;
