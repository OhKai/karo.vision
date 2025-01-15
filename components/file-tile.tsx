import { cn, convertBytesToRoundedString } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";
import Tags from "./tags";

const FileTile = ({
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
      className={cn("flex flex-col bg-muted rounded shadow-sm", className)}
      ref={ref}
    >
      {children}
    </div>
  );
};

FileTile.Top = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn("shrink-0 overflow-hidden rounded-t relative", className)}
    >
      {children}
    </div>
  );
};

FileTile.Bottom = ({
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
    <div className={cn("flex flex-col px-2.5 py-2.5 w-full", className)}>
      {"node" in content ? (
        content.node
      ) : (
        <>
          <h4 className="text-title text-[13px] font-medium">
            {content.topic}
          </h4>
          <h3
            title={content.title ?? content.name}
            className="text-[17px] font-medium tracking-[0.25px] mb-3.5 truncate"
          >
            {content.title ?? content.name}
          </h3>
          <Tags values={content.tags ?? []} maxLines={2} className="mb-2" />
          <div className="flex text-[11px] font-light justify-between flex-1 items-end text-secondary-foreground gap-1">
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

export default FileTile;
