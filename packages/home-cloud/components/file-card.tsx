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
        "group flex w-full max-w-[800px] rounded bg-zinc-50 shadow-xs transition-colors hover:bg-zinc-100",
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
        "bg-secondary group-hover:bg-input relative flex h-[225px] w-1/2 shrink-0 items-center justify-center overflow-hidden rounded-l transition-colors",
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
        "flex max-h-[225px] w-1/2 flex-col px-3.5 py-3.5",
        className,
      )}
    >
      {"node" in content ? (
        content.node
      ) : (
        <>
          <h4 className="text-muted-foreground mb-[3px] text-[15px] font-medium">
            {content.topic}
          </h4>
          <h3
            title={content.title ?? content.name}
            className="relative mb-5 grow truncate text-xl font-medium tracking-[0.25px] whitespace-break-spaces after:absolute after:bottom-0 after:block after:h-[40px] after:w-[372px] after:bg-linear-to-b after:from-transparent after:to-zinc-50 after:transition-colors after:content-[''] group-hover:after:to-zinc-100"
          >
            {content.title ?? content.name}
          </h3>
          <Tags
            values={content.tags ?? []}
            maxLines={2}
            tagClassName="bg-zinc-200/50 group-hover:bg-zinc-200"
          />
          <div className="text-muted-foreground flex flex-1 items-end justify-between gap-1 text-xs font-light">
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
