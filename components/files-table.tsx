"use client";

import { cn, convertBytesToRoundedString, fileThumbURL } from "@/lib/utils";
import Tags from "@/components/tags";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleHelp } from "lucide-react";
import { useState } from "react";

type FilesTableProps = {
  className?: string;
  tableHeadNode?: React.ReactNode;
  children?: React.ReactNode;
};

const FilesTable = ({
  className,
  tableHeadNode,
  children,
}: FilesTableProps) => {
  return (
    <Table className={cn("text-xs font-light", className)}>
      <TableHeader>
        <TableRow>
          {tableHeadNode}
          <TableHead className="max-md:px-2">Title</TableHead>
          <TableHead className="max-md:px-2">Topic</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="hidden xl:table-cell">Folder</TableHead>
          <TableHead className="hidden lg:table-cell">Created</TableHead>
          <TableHead className="hidden text-right lg:table-cell">
            Size
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
};

type RowProps = {
  file: {
    topic: string | null;
    title: string | null;
    tags: string[] | null;
    dirname: string;
    createdAt: Date;
    size: number;
    name: string;
  };
  isPending?: boolean;
  ref?: React.Ref<HTMLTableRowElement>;
  onClick?: () => void;
  children?: React.ReactNode;
};

const Row = ({ file, isPending, ref, onClick, children }: RowProps) => {
  return (
    <TableRow
      ref={ref}
      style={{
        contentVisibility: "auto",
        containIntrinsicHeight: "49.5px",
      }}
      onClick={onClick}
      className={cn("cursor-pointer", { "animate-pulse": isPending })}
    >
      {children}
      <TableCell
        className="max-w-[20vw] truncate font-medium max-md:px-2 min-[1800px]:!max-w-[600px] md:w-[300px] md:max-w-[300px]"
        title={file.title ?? file.name}
      >
        {file.title ?? file.name}
      </TableCell>
      <TableCell
        className="max-w-[20vw] truncate max-md:px-2 min-[1800px]:!max-w-[250px] md:w-[130px] md:max-w-[130px]"
        title={file.topic ?? undefined}
      >
        {file.topic}
      </TableCell>
      {/* 
        max-w-0 - This prevents the cell from expanding beyond the remaining space
        w-full - This allows the cell to take up the remaining available width
      */}
      <TableCell className="w-full max-w-0 max-md:max-w-[20vw] max-md:px-2">
        <Tags values={file.tags ?? []} maxLines={1} />
      </TableCell>
      <TableCell
        className="hidden w-[250px] max-w-[250px] truncate min-[1800px]:!max-w-[350px] xl:table-cell"
        title={file.dirname}
      >
        {file.dirname}
      </TableCell>
      <TableCell className="hidden w-[105px] lg:table-cell">
        {file.createdAt.toLocaleDateString()}
      </TableCell>
      <TableCell className="hidden w-[100px] max-w-[100px] truncate text-right lg:table-cell">
        {convertBytesToRoundedString(file.size)}
      </TableCell>
    </TableRow>
  );
};

const ThumbnailCell = ({ fileId }: { fileId: number }) => {
  // Wether this file is corrupted or not, in this case if we could find a thumbnail.
  const [hasThumb, setHasThump] = useState(true);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  return (
    <TableCell className="flex h-[48.5px] w-[84px] min-w-[84px] items-center justify-center p-1 pl-2 md:w-[92px] md:min-w-[92px] md:pl-4">
      {!hasThumb ? (
        <CircleHelp className="text-muted-foreground h-[35px] w-[35px]" />
      ) : (
        <img
          src={fileThumbURL(fileId)}
          loading="lazy"
          className={cn(
            "max-h-[40.5px] max-w-[72px] rounded transition-opacity duration-300",
            {
              "opacity-0": !hasInitiallyLoaded,
            },
          )}
          onError={(e) => {
            setHasThump(false);
          }}
          onLoad={(e) => {
            if (!hasInitiallyLoaded) {
              e.currentTarget.classList.add("opacity-100");
              setHasInitiallyLoaded(true);
            }
          }}
        />
      )}
    </TableCell>
  );
};

FilesTable.Row = Row;
FilesTable.ThumbnailCell = ThumbnailCell;

export default FilesTable;
