import {
  cn,
  convertBytesToRoundedString,
  convertSecondsToRoundedString,
} from "@/lib/utils";
import Tags from "@/components/tags";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

type VideosTableProps = {
  className?: string;
  videosPages?: {
    fileId: number;
    duration: number;
    resumeTime: number | null;
    file: {
      topic: string | null;
      title: string | null;
      tags: string[] | null;
      dirname: string;
      createdAt: Date;
      size: number;
      name: string;
    };
  }[][];
  ref?: React.Ref<HTMLTableRowElement>;
};

const VideosTable = ({ className, videosPages, ref }: VideosTableProps) => {
  return (
    <Table className={cn("font-light text-xs", className)}>
      <TableHeader>
        <TableRow>
          <TableHead className="px-0"></TableHead>
          <TableHead className="max-md:px-2">Duration</TableHead>
          <TableHead className="max-md:px-2">Title</TableHead>
          <TableHead className="max-md:px-2">Topic</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="xl:table-cell hidden">Folder</TableHead>
          <TableHead className="lg:table-cell hidden">Created</TableHead>
          <TableHead className="text-right lg:table-cell hidden">
            Size
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {videosPages?.map((page, pageIndex) =>
          page.map((video, videoIndex) => (
            <TableRow
              key={video.fileId}
              ref={
                pageIndex === videosPages.length - 1 &&
                (videoIndex === page.length - 25 ||
                  videoIndex === page.length - 1)
                  ? ref
                  : undefined
              }
              style={{
                contentVisibility: "auto",
                containIntrinsicHeight: "49.5px",
              }}
            >
              <TableCell className="md:w-[92px] md:min-w-[92px] w-[84px] min-w-[84px] p-1 md:pl-4 pl-2">
                <Image
                  src="http://192.168.0.4:53852/fs?path=%2FVolumes%2FElements9%2Fdownloads%2FTwitch%20-%20__%20Barbie%20Suzy%20____%20%20(1).mp4.png"
                  alt=""
                  className="rounded"
                  width={72}
                  height={40.5}
                />
              </TableCell>
              <TableCell className="md:w-[100px] truncate md:max-w-[100px] max-w-[65px] max-md:px-2">
                {convertSecondsToRoundedString(video.duration)}
              </TableCell>
              <TableCell
                className="md:w-[300px] font-medium truncate md:max-w-[300px] min-[1800px]:max-w-[600px] max-w-[20vw] max-md:px-2"
                title={video.file.title ?? video.file.name}
              >
                {video.file.title ?? video.file.name}
              </TableCell>
              <TableCell className="md:w-[130px] truncate md:max-w-[130px] max-w-[20vw] max-md:px-2 min-[1800px]:max-w-[250px]">
                {video.file.topic}
              </TableCell>
              <TableCell className="max-md:px-2 max-md:max-w-[20vw]">
                <Tags values={video.file.tags ?? []} maxLines={1} />
              </TableCell>
              <TableCell className="w-[250px] xl:table-cell hidden truncate max-w-[250px] min-[1800px]:max-w-[350px]">
                {video.file.dirname}
              </TableCell>
              <TableCell className="w-[105px] lg:table-cell hidden">
                {video.file.createdAt.toLocaleDateString()}
              </TableCell>
              <TableCell className="w-[100px] text-right lg:table-cell hidden truncate max-w-[100px]">
                {convertBytesToRoundedString(video.file.size)}
              </TableCell>
            </TableRow>
          )),
        )}
      </TableBody>
    </Table>
  );
};

export default VideosTable;
