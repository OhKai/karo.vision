import { cn, convertBytesToRoundedString } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";
import Tags from "./tags";

const FileCard = ({
  className,
  children,
  ref,
  ...divProps
}: {
  ref?: React.Ref<HTMLDivElement>;
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...divProps}
      className={cn(
        "flex bg-muted hover:bg-[#fafafa] group rounded shadow-xs max-w-[800px] w-full",
        className,
      )}
      ref={ref}
      style={{ contentVisibility: "auto", containIntrinsicHeight: "225px" }}
    >
      {children}
    </div>
  );
};

FileCard.Left = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "w-1/2 shrink-0 overflow-hidden rounded-l relative bg-secondary group-hover:bg-input flex justify-center items-center h-[225px]",
        className,
      )}
    >
      {children}
    </div>
  );
};

FileCard.Right = ({
  className,
  content,
}: {
  className?: string;
  content:
    | { node: ReactNode }
    | {
        topic: string | null;
        title: string | null;
        tags: string[] | null;
        dirname: string;
        createdAt: Date;
        size: number;
        name: string;
      };
}) => {
  return (
    <div
      className={cn(
        "flex flex-col px-3.5 py-3.5 w-1/2 max-h-[225px]",
        className,
      )}
    >
      {"node" in content ? (
        content.node
      ) : (
        <>
          <h4 className="text-title text-[15px] font-medium mb-[3px]">
            {content.topic}
          </h4>
          <h3
            title={content.title ?? content.name}
            className="text-xl font-medium tracking-[0.25px] mb-5 truncate whitespace-break-spaces after:content-[''] after:block after:absolute after:bg-linear-to-b after:from-transparent after:to-muted after:w-[372px] after:h-[40px] after:bottom-0 group-hover:after:to-[#fafafa] relative grow"
          >
            {content.title ?? content.name}
          </h3>
          <Tags values={content.tags ?? []} maxLines={2} />
          <div className="flex text-xs font-light justify-between flex-1 items-end text-secondary-foreground gap-1">
            <span className="truncate" title={content.dirname}>
              {content.dirname}
            </span>
            <span className="shrink-0">
              {content.createdAt.toLocaleDateString()}
            </span>
            <span className="shrink-0">
              {convertBytesToRoundedString(content.size)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default FileCard;
