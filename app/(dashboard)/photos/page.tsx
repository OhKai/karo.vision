"use client";

import Image from "next/image";
import SearchBar from "@/components/search-bar";
import { useViewStore } from "@/lib/use-view-store";
import Tags from "@/components/tags";
import ViewToggleGroup from "@/components/view-toggle-group";
import SortToggleGroup from "@/components/sort-toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Masonry from "@wowblvck/react-responsive-masonry";
import { useResizeStore } from "@/lib/use-resize-store";
import FilesTable from "@/components/files-table";

const PhotosPage = () => {
  const photosView = useViewStore((state) => state.photos);
  const windowWidth = useResizeStore((state) => state.windowWidth);

  return (
    <div className="mt-[134px] flex flex-col gap-8 items-center pb-4">
      <SearchBar
        className="fixed top-[74px]"
        floating
        searchOptionsNode={
          <>
            <ViewToggleGroup
              viewKey="photos"
              enabledViews={["list", "posters", "tiles"]}
            />
            <SortToggleGroup className="flex md:hidden" />
            <div className="flex items-center space-x-2">
              <Switch id="open-blank" />
              <Label htmlFor="open-blank" className="text-xs">
                Open In New Tab
              </Label>
            </div>
          </>
        }
      />
      {photosView === "list" ? (
        <FilesTable />
      ) : photosView === "posters" ? (
        <div className="max-w-[2808px] w-full md:px-6 px-2">
          <Masonry
            columnsCount={windowWidth < 768 ? 1 : windowWidth < 1400 ? 2 : 3}
            gutter="8px"
          >
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.2:53852/fs?path=%2Fmedia%2Fpi%2FSeagate%20B%2F_lib%2Fpics%2F1024watermarked%2FDSC_0181.jpg"
                alt=""
                className="rounded"
                width={996}
                height={1500}
                style={{ width: "100%" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex bg-muted rounded shadow-sm">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
          </Masonry>
        </div>
      ) : (
        <div className="max-w-[2808px] grid min-[2090px]:grid-cols-6 min-[1600px]:grid-cols-5 min-[1300px]:grid-cols-4 lg:grid-cols-3 min-[680px]:grid-cols-2 grid-cols-1 w-full md:px-6 px-2 gap-3"></div>
      )}
    </div>
  );
};

export default PhotosPage;
