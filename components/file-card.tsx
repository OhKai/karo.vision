import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Tags from "./tags";

const FileCard = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex bg-muted rounded shadow-sm max-w-[800px] w-full",
        className,
      )}
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
  return <div className={cn("w-1/2 shrink-0", className)}>{children}</div>;
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
      };
}) => {
  return (
    <div className={cn("flex flex-col px-3.5 py-3.5 w-1/2", className)}>
      {"node" in content ? (
        content.node
      ) : (
        <>
          <h4 className="text-title text-[15px] font-medium mb-[3px]">
            {content.topic}
          </h4>
          <h3 className="text-xl font-medium tracking-[0.25px] mb-5">
            {content.title}
          </h3>
          <Tags values={content.tags ?? []} maxLines={2} />
          <div className="flex text-xs font-light justify-between flex-1 items-end text-secondary-foreground">
            <span>{content.dirname}</span>
            <span>{content.createdAt.toLocaleDateString()}</span>
            <span>{content.size}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default FileCard;
