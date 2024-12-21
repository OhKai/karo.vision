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

const Home = () => {
  const videosView = useViewStore((state) => state.videos);

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
      {videosView === "list" ? (
        <FilesTable />
      ) : videosView === "cards" ? (
        <div className="flex flex-col gap-3.5 px-3">
          <div className="flex bg-muted rounded shadow-sm max-w-[800px] w-full">
            <div className="w-1/2 shrink-0">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded-l"
                width={400}
                height={225}
              />
            </div>
            <div className="flex flex-col px-3.5 py-3.5 w-1/2">
              <h4 className="text-title text-[15px] font-medium mb-[3px]">
                Youtube
              </h4>
              <h3 className="text-xl font-medium tracking-[0.25px] mb-5">
                Credit Card
              </h3>
              <Tags
                values={[
                  "favoritesdssdldsf sdfkdsksdfsd abcddssdldsf sdfkdsksdfsd abcd dssdldsf sdfkdsksdfsd abcd",
                  "ahhhhaa",
                  "dssdldsf sdfkdsksdfsd",
                  "sdfdsfdsfdsfdfs",
                  "favorites2",
                  "ahhhhaa2",
                  "dssdldsf sdfkdsksdfsd2",
                  "sdfdsfdsfdsfdfs2",
                ]}
                maxLines={2}
              />
              <div className="flex text-xs font-light justify-between flex-1 items-end text-secondary-foreground">
                <span>/downloads/new</span>
                <span>05.06.2024</span>
                <span>1 GB</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-[2808px] grid min-[2090px]:grid-cols-6 min-[1600px]:grid-cols-5 min-[1300px]:grid-cols-4 lg:grid-cols-3 min-[680px]:grid-cols-2 grid-cols-1 w-full md:px-6 px-2 gap-3">
          <div className="flex flex-col bg-muted rounded shadow-sm">
            <div className="shrink-0">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded-t"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex flex-col px-2.5 py-2.5 w-full">
              <h4 className="text-title text-[13px] font-medium">Youtube</h4>
              <h3 className="text-[17px] font-medium tracking-[0.25px] mb-3.5">
                Credit Card
              </h3>
              <Tags
                values={[
                  "favorites",
                  "ahhhhaa",
                  "dssdldsf sdfkdsksdfsd",
                  "sdfdsfdsfdsfdfs",
                  "favorites2",
                  "ahhhhaa2",
                  "dssdldsf sdfkdsksdfsd2",
                  "sdfdsfdsfdsfdfs2",
                ]}
                maxLines={1}
                className="mb-2"
              />
              <div className="flex text-[11px] font-light justify-between flex-1 items-end text-secondary-foreground">
                <span>/downloads/new</span>
                <span>05.06.2024</span>
                <span>1 GB</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-muted rounded-md shadow-sm">
            <div className="shrink-0">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded-t"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex flex-col px-2.5 py-2.5 w-full">
              <h4 className="text-title text-[13px] font-medium">Youtube</h4>
              <h3 className="text-[17px] font-medium tracking-[0.25px] mb-3.5">
                Credit Card
              </h3>
              <Tags
                values={[
                  "favorites",
                  "ahhhhaa",
                  "dssdldsf sdfkdsksdfsd",
                  "sdfdsfdsfdsfdfs",
                  "favorites2",
                  "ahhhhaa2",
                  "dssdldsf sdfkdsksdfsd2",
                  "sdfdsfdsfdsfdfs2",
                ]}
                maxLines={1}
                className="mb-2"
              />
              <div className="flex text-[11px] font-light justify-between flex-1 items-end text-secondary-foreground">
                <span>/downloads/new</span>
                <span>05.06.2024</span>
                <span>1 GB</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-muted rounded-md shadow-sm">
            <div className="shrink-0">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded-t"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex flex-col px-2.5 py-2.5 w-full">
              <h4 className="text-title text-[13px] font-medium">Youtube</h4>
              <h3 className="text-[17px] font-medium tracking-[0.25px] mb-3.5">
                Credit Card
              </h3>
              <Tags
                values={[
                  "favorites",
                  "ahhhhaa",
                  "dssdldsf sdfkdsksdfsd",
                  "sdfdsfdsfdsfdfs",
                  "favorites2",
                  "ahhhhaa2",
                  "dssdldsf sdfkdsksdfsd2",
                  "sdfdsfdsfdsfdfs2",
                ]}
                maxLines={1}
                className="mb-2"
              />
              <div className="flex text-[11px] font-light justify-between flex-1 items-end text-secondary-foreground">
                <span>/downloads/new</span>
                <span>05.06.2024</span>
                <span>1 GB</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-muted rounded-md shadow-sm">
            <div className="shrink-0">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded-t"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex flex-col px-2.5 py-2.5 w-full">
              <h4 className="text-title text-[13px] font-medium">Youtube</h4>
              <h3 className="text-[17px] font-medium tracking-[0.25px] mb-3.5">
                Credit Card
              </h3>
              <Tags
                values={[
                  "favorites",
                  "ahhhhaa",
                  "dssdldsf sdfkdsksdfsd",
                  "sdfdsfdsfdsfdfs",
                  "favorites2",
                  "ahhhhaa2",
                  "dssdldsf sdfkdsksdfsd2",
                  "sdfdsfdsfdsfdfs2",
                ]}
                maxLines={1}
                className="mb-2"
              />
              <div className="flex text-[11px] font-light justify-between flex-1 items-end text-secondary-foreground">
                <span>/downloads/new</span>
                <span>05.06.2024</span>
                <span>1 GB</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-muted rounded-md shadow-sm">
            <div className="shrink-0">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded-t"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex flex-col px-2.5 py-2.5 w-full">
              <h4 className="text-title text-[13px] font-medium">Youtube</h4>
              <h3 className="text-[17px] font-medium tracking-[0.25px] mb-3.5">
                Credit Card
              </h3>
              <Tags
                values={[
                  "favorites",
                  "ahhhhaa",
                  "dssdldsf sdfkdsksdfsd",
                  "sdfdsfdsfdsfdfs",
                  "favorites2",
                  "ahhhhaa2",
                  "dssdldsf sdfkdsksdfsd2",
                  "sdfdsfdsfdsfdfs2",
                ]}
                maxLines={1}
                className="mb-2"
              />
              <div className="flex text-[11px] font-light justify-between flex-1 items-end text-secondary-foreground">
                <span>/downloads/new</span>
                <span>05.06.2024</span>
                <span>1 GB</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-muted rounded-md shadow-sm">
            <div className="shrink-0">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded-t"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex flex-col px-2.5 py-2.5 w-full">
              <h4 className="text-title text-[13px] font-medium">Youtube</h4>
              <h3 className="text-[17px] font-medium tracking-[0.25px] mb-3.5">
                Credit Card
              </h3>
              <Tags
                values={[
                  "favorites",
                  "ahhhhaa",
                  "dssdldsf sdfkdsksdfsd",
                  "sdfdsfdsfdsfdfs",
                  "favorites2",
                  "ahhhhaa2",
                  "dssdldsf sdfkdsksdfsd2",
                  "sdfdsfdsfdsfdfs2",
                ]}
                maxLines={1}
                className="mb-2"
              />
              <div className="flex text-[11px] font-light justify-between flex-1 items-end text-secondary-foreground">
                <span>/downloads/new</span>
                <span>05.06.2024</span>
                <span>1 GB</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-muted rounded-md shadow-sm">
            <div className="shrink-0">
              <Image
                src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                alt=""
                className="rounded-t"
                width={400}
                height={225}
                style={{ width: "100%", aspectRatio: "16 / 9" }}
              />
            </div>
            <div className="flex flex-col px-2.5 py-2.5 w-full">
              <h4 className="text-title text-[13px] font-medium">Youtube</h4>
              <h3 className="text-[17px] font-medium tracking-[0.25px] mb-3.5">
                Credit Card
              </h3>
              <Tags
                values={[
                  "favorites",
                  "ahhhhaa",
                  "dssdldsf sdfkdsksdfsd",
                  "sdfdsfdsfdsfdfs",
                  "favorites2",
                  "ahhhhaa2",
                  "dssdldsf sdfkdsksdfsd2",
                  "sdfdsfdsfdsfdfs2",
                ]}
                maxLines={1}
                className="mb-2"
              />
              <div className="flex text-[11px] font-light justify-between flex-1 items-end text-secondary-foreground">
                <span>/downloads/new</span>
                <span>05.06.2024</span>
                <span>1 GB</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
