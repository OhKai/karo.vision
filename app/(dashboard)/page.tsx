"use client";

import Image from "next/image";
import SearchBar from "@/components/search-bar";
import { useViewStore } from "@/lib/use-view-store";
import Tags from "@/components/tags";
import ViewToggleGroup from "@/components/view-toggle-group";
import SortToggleGroup from "@/components/sort-toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FilesTable from "@/components/files-table";
import { trpc } from "@/lib/trpc-client";
import FileCard from "@/components/file-card";
import FileTile from "@/components/file-tile";

const Home = () => {
  const videosView = useViewStore((state) => state.videos);
  const { data: videos, isPending } = trpc.videos.list.useQuery();

  return (
    <div className="mt-[134px] flex flex-col gap-8 items-center pb-4">
      <SearchBar
        className="fixed top-[74px]"
        floating
        searchOptionsNode={
          <>
            <ViewToggleGroup
              viewKey="videos"
              enabledViews={["list", "cards", "tiles"]}
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
      {isPending ? (
        <div>Loading...</div>
      ) : videos?.length === 0 ? (
        <div>No videos found</div>
      ) : videosView === "list" ? (
        <FilesTable />
      ) : videosView === "cards" ? (
        <div className="flex flex-col gap-3.5 px-3">
          {videos?.map((video) => (
            <FileCard key={video.fileId}>
              <FileCard.Left>
                <Image
                  src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                  alt=""
                  className="rounded-l"
                  width={400}
                  height={225}
                />
              </FileCard.Left>
              <FileCard.Right content={video.file} />
            </FileCard>
          ))}
        </div>
      ) : (
        <div className="max-w-[2808px] grid min-[2090px]:grid-cols-6 min-[1600px]:grid-cols-5 min-[1300px]:grid-cols-4 lg:grid-cols-3 min-[680px]:grid-cols-2 grid-cols-1 w-full md:px-6 px-2 gap-3">
          {videos?.map((video) => (
            <FileTile key={video.fileId}>
              <FileTile.Top>
                <Image
                  src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                  alt=""
                  className="rounded-t"
                  width={400}
                  height={225}
                  style={{ width: "100%", aspectRatio: "16 / 9" }}
                />
              </FileTile.Top>
              <FileTile.Bottom content={video.file} />
            </FileTile>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
