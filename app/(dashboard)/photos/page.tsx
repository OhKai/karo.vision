"use client";

import Image from "next/image";
import SearchBar from "@/components/search-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useViewStore } from "@/lib/use-view-store";
import Tags from "@/components/tags";
import ViewToggleGroup from "@/components/view-toggle-group";
import SortToggleGroup from "@/components/sort-toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const PhotosPage = () => {
  const photosView = useViewStore((state) => state.photos);

  return (
    <div className="mt-[134px] flex flex-col gap-8 items-center pb-4">
      <SearchBar
        className="fixed top-[74px]"
        floating
        searchOptionsNode={
          <>
            <ViewToggleGroup
              viewKey="photos"
              enabledViews={["list", "tiles"]}
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
        <Table className="font-light text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="md:w-[92px] md:min-w-[92px] w-[84px] min-w-[84px] px-0"></TableHead>
              <TableHead className="md:w-[100px] max-md:px-2">Length</TableHead>
              <TableHead className="md:w-[300px] max-md:px-2">Title</TableHead>
              <TableHead className="md:w-[130px] max-md:px-2">Topic</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-[250px] xl:table-cell hidden">
                Path
              </TableHead>
              <TableHead className="w-[105px] lg:table-cell hidden">
                Created
              </TableHead>
              <TableHead className="w-[100px] text-right lg:table-cell hidden">
                Size
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="p-1 md:pl-4 pl-2">
                <Image
                  src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                  alt=""
                  className="rounded"
                  width={72}
                  height={40.5}
                />
              </TableCell>
              <TableCell className="truncate md:max-w-[100px] max-w-[65px] max-md:px-2">
                99999:34:45
              </TableCell>
              <TableCell className="font-medium truncate md:max-w-[300px] max-w-[20vw] max-md:px-2">
                Credit Card abc reallylongotherwordshere asdasddf
              </TableCell>
              <TableCell className="truncate md:max-w-[130px] max-w-[20vw] max-md:px-2">
                Youtube abc reallylongotherwordshere asdasddf
              </TableCell>
              <TableCell className="max-md:px-2 max-md:max-w-[20vw]">
                <Tags
                  values={["favorites", "abc", "really long"]}
                  maxLines={1}
                />
              </TableCell>
              <TableCell className="xl:table-cell hidden truncate max-w-[250px]">
                /downloads/newabc reallylongotherwordshere asdasddf
              </TableCell>
              <TableCell className="lg:table-cell hidden">05.06.2024</TableCell>
              <TableCell className="text-right lg:table-cell hidden truncate max-w-[100px]">
                1 GB
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <div className="grid min-[2090px]:grid-cols-6 min-[1600px]:grid-cols-5 min-[1300px]:grid-cols-4 lg:grid-cols-3 min-[680px]:grid-cols-2 grid-cols-1 w-full md:px-6 px-2 gap-3">
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

export default PhotosPage;
