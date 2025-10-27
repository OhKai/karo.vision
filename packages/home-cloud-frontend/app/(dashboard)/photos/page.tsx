"use client";

import Masonry from "@wowblvck/react-responsive-masonry";
import { useResizeStore } from "@/lib/use-resize-store";
import SearchPage, { useSearchPage } from "@/components/search-page";
import FilesTable from "@/components/files-table";
import { TableHead } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import PhotoTile from "./photo-tile";
import PhotoPoster from "./photo-poster";
import ModalSwitch from "@/components/modal-switch";
import PhotoModal from "@/components/photo-modal";

const PhotosPage = () => {
  const windowWidth = useResizeStore((state) => state.windowWidth);
  const searchPage = useSearchPage("photos");
  const router = useRouter();

  return (
    <SearchPage
      page="photos"
      enabledViews={["list", "posters", "tiles"]}
      searchOptionsNode={<ModalSwitch viewKey="photos" />}
      {...searchPage}
    >
      {searchPage.isPending ? (
        <div>Loading...</div>
      ) : (searchPage.data?.length ?? 0) === 0 ? (
        searchPage.isPlaceholderData ? (
          <div>Loading</div>
        ) : (
          <div className="text-accent-foreground mt-12 text-lg font-extralight">
            No photos found
          </div>
        )
      ) : searchPage.pageView === "list" ? (
        <FilesTable
          tableHeadNode={
            <>
              <TableHead className="px-0"></TableHead>
            </>
          }
        >
          {searchPage.data?.map((photo, photoIndex) => (
            <FilesTable.Row
              key={photo.fileId}
              file={photo.file}
              isPending={searchPage.isPlaceholderData}
              ref={
                photoIndex === searchPage.data.length - 25 ||
                photoIndex === searchPage.data.length - 1
                  ? searchPage.tripwireRef
                  : undefined
              }
              onClick={(e) => searchPage.onClick(e, photo.fileId)}
            >
              <FilesTable.ThumbnailCell fileId={photo.fileId} />
            </FilesTable.Row>
          ))}
        </FilesTable>
      ) : searchPage.pageView === "posters" ? (
        <div className="w-full max-w-[2808px] px-2 md:px-6">
          <Masonry
            columnsCount={windowWidth < 768 ? 1 : windowWidth < 1400 ? 2 : 3}
            gutter="8px"
          >
            {searchPage.data?.map((photo, photoIndex) => (
              <PhotoPoster
                key={photo.fileId}
                photo={photo}
                ref={
                  photoIndex === searchPage.data.length - 10 ||
                  photoIndex === searchPage.data.length - 1
                    ? searchPage.tripwireRef
                    : undefined
                }
                onClick={(e) => searchPage.onClick(e, photo.fileId)}
              />
            ))}
          </Masonry>
        </div>
      ) : (
        <div className="grid w-full max-w-[2808px] grid-cols-1 gap-3 px-2 min-[680px]:grid-cols-2 min-[1300px]:grid-cols-4 min-[1600px]:grid-cols-5 min-[2090px]:grid-cols-6 md:px-6 lg:grid-cols-3">
          {searchPage.data?.map((photo, photoIndex) => (
            <PhotoTile
              key={photo.fileId}
              photo={photo}
              ref={
                photoIndex === searchPage.data.length - 13 ||
                photoIndex === searchPage.data.length - 1
                  ? searchPage.tripwireRef
                  : undefined
              }
              onClick={(e) => searchPage.onClick(e, photo.fileId)}
            />
          ))}
        </div>
      )}
      <PhotoModal
        photoId={searchPage.selectedId}
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

export default PhotosPage;
