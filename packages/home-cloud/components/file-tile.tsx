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
      className={cn(
        "group flex h-full flex-col rounded bg-zinc-50 shadow-xs transition-colors hover:bg-zinc-100",
        className,
      )}
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
      className={cn(
        "bg-secondary group-hover:bg-input relative flex shrink-0 justify-center overflow-hidden rounded-t transition-colors",
        className,
      )}
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
    <div className={cn("flex w-full grow flex-col px-2.5 py-2.5", className)}>
      {"node" in content ? (
        content.node
      ) : (
        <>
          <h4 className="text-muted-foreground text-[13px] font-medium">
            {content.topic ?? "•••"}
          </h4>
          <h3
            title={content.title ?? content.name}
            className="mb-3.5 truncate text-[17px] font-medium tracking-[0.25px]"
          >
            {content.title ?? content.name}
          </h3>
          {content.tags ? (
            <Tags
              values={content.tags ?? []}
              maxLines={2}
              className="mb-2"
              tagClassName="bg-zinc-200/50 group-hover:bg-zinc-200"
            />
          ) : null}
          <div className="text-muted-foreground flex flex-1 items-end justify-between gap-1 text-[11px] font-light">
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
