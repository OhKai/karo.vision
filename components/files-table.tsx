import Tags from "./tags";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";

type FilesTableProps = {
  className?: string;
};

const FilesTable = ({ className }: FilesTableProps) => {
  return (
    <Table className="font-light text-xs">
      <TableHeader>
        <TableRow>
          <TableHead className="md:w-[92px] md:min-w-[92px] w-[84px] min-w-[84px] px-0"></TableHead>
          <TableHead className="md:w-[100px] max-md:px-2">Length</TableHead>
          <TableHead className="md:w-[300px] max-md:px-2">Title</TableHead>
          <TableHead className="md:w-[130px] max-md:px-2">Topic</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="w-[250px] xl:table-cell hidden">Path</TableHead>
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
            <Tags values={["favorites", "abc", "really long"]} maxLines={1} />
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
  );
};

export default FilesTable;
