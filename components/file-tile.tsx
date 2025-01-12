import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Tags from "./tags";

const FileTile = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div className={cn("flex flex-col bg-muted rounded shadow-sm", className)}>
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
  return <div className={cn("shrink-0", className)}>{children}</div>;
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
          <h3 className="text-[17px] font-medium tracking-[0.25px] mb-3.5">
            {content.title}
          </h3>
          <Tags values={content.tags ?? []} maxLines={2} className="mb-2" />
          <div className="flex text-[11px] font-light justify-between flex-1 items-end text-secondary-foreground">
            <span>{content.dirname}</span>
            <span>{content.createdAt.toLocaleDateString()}</span>
            <span>{content.size}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default FileTile;
