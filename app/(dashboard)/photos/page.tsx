"use client";

import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Masonry from "@wowblvck/react-responsive-masonry";
import { useResizeStore } from "@/lib/use-resize-store";
import SearchPage, { useSearchPage } from "@/components/search-page";
import { fileURL } from "@/lib/utils";

const PhotosPage = () => {
  const windowWidth = useResizeStore((state) => state.windowWidth);
  const searchPage = useSearchPage("photos");

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
      {searchPage.pageView === "list" ? null : searchPage.pageView ===
        "posters" ? ( //<FilesTable />
        <div className="max-w-[2808px] w-full md:px-6 px-2">
          <Masonry
            columnsCount={windowWidth < 768 ? 1 : windowWidth < 1400 ? 2 : 3}
            gutter="8px"
          >
            {searchPage.data?.pages?.map((page, pageIndex) =>
              page.map((photo, photoIndex) => (
                <div
                  className="flex bg-muted rounded shadow-xs"
                  key={photo.fileId}
                  ref={
                    pageIndex === searchPage.data!.pages.length - 1 &&
                    (photoIndex === page.length - 10 ||
                      photoIndex === page.length - 1)
                      ? searchPage.tripwireRef
                      : undefined
                  }
                >
                  <Image
                    src={fileURL(photo.fileId)}
                    alt=""
                    className="rounded"
                    width={400}
                    height={225}
                    style={{ width: "100%" }}
                  />
                </div>
              )),
            )}
          </Masonry>
        </div>
      ) : (
        <div className="max-w-[2808px] grid min-[2090px]:grid-cols-6 min-[1600px]:grid-cols-5 min-[1300px]:grid-cols-4 lg:grid-cols-3 min-[680px]:grid-cols-2 grid-cols-1 w-full md:px-6 px-2 gap-3"></div>
      )}
    </SearchPage>
  );
};

export default PhotosPage;
