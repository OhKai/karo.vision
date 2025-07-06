"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Masonry from "@wowblvck/react-responsive-masonry";
import { useResizeStore } from "@/lib/use-resize-store";
import SearchPage, { useSearchPage } from "@/components/search-page";
import FilesTable from "@/components/files-table";
import { TableHead } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import PhotoTile from "./photo-tile";
import PhotoPoster from "./photo-poster";

const PhotosPage = () => {
  const windowWidth = useResizeStore((state) => state.windowWidth);
  const searchPage = useSearchPage("photos");
  const router = useRouter();

  return (
    <SearchPage
      page="photos"
      enabledViews={["list", "posters", "tiles"]}
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
          {searchPage.data?.pages?.map((page, pageIndex) =>
            page.map((photo, photoIndex) => (
              <FilesTable.Row
                key={photo.fileId}
                file={photo.file}
                isPending={searchPage.isPlaceholderData}
                ref={
                  pageIndex === searchPage.data!.pages.length - 1 &&
                  (photoIndex === page.length - 25 ||
                    photoIndex === page.length - 1)
                    ? searchPage.tripwireRef
                    : undefined
                }
                onClick={() => router.push(`/photos/${photo.fileId}`)}
              >
                <FilesTable.ThumbnailCell fileId={photo.fileId} />
              </FilesTable.Row>
            )),
          )}
        </FilesTable>
      ) : searchPage.pageView === "posters" ? (
        <div className="w-full max-w-[2808px] px-2 md:px-6">
          <Masonry
            columnsCount={windowWidth < 768 ? 1 : windowWidth < 1400 ? 2 : 3}
            gutter="8px"
          >
            {searchPage.data?.pages?.map((page, pageIndex) =>
              page.map((photo, photoIndex) => (
                <PhotoPoster
                  key={photo.fileId}
                  photo={photo}
                  ref={
                    pageIndex === searchPage.data!.pages.length - 1 &&
                    (photoIndex === page.length - 10 ||
                      photoIndex === page.length - 1)
                      ? searchPage.tripwireRef
                      : undefined
                  }
                />
              )),
            )}
          </Masonry>
        </div>
      ) : (
        <div className="grid w-full max-w-[2808px] grid-cols-1 gap-3 px-2 min-[680px]:grid-cols-2 min-[1300px]:grid-cols-4 min-[1600px]:grid-cols-5 min-[2090px]:grid-cols-6 md:px-6 lg:grid-cols-3">
          {searchPage.data?.pages?.map((page, pageIndex) =>
            page.map((photo, photoIndex) => (
              <PhotoTile
                key={photo.fileId}
                photo={photo}
                ref={
                  pageIndex === searchPage.data!.pages.length - 1 &&
                  (photoIndex === page.length - 13 ||
                    photoIndex === page.length - 1)
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

export default PhotosPage;
