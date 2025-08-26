"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightToLine, XIcon } from "lucide-react";
import { ReactNode, createContext, useContext, useState } from "react";
import Tags from "./tags";
import { cn } from "@/lib/utils";
import { DialogClose } from "./ui/dialog";

// Context for sharing state between compound components
type MediaViewerContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  showControls: boolean;
};

const MediaViewerContext = createContext<MediaViewerContextType | null>(null);

const useMediaViewer = () => {
  const context = useContext(MediaViewerContext);
  if (!context) {
    throw new Error("useMediaViewer must be used within MediaViewerLayout");
  }
  return context;
};

type MediaViewerLayoutProps = {
  children: ReactNode;
  showControls?: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  className?: string;
};

// Root layout component
export const MediaViewerLayout = ({
  children,
  showControls = true,
  isSidebarOpen,
  setIsSidebarOpen,
  className,
}: MediaViewerLayoutProps) => {
  return (
    <MediaViewerContext.Provider
      value={{ isSidebarOpen, setIsSidebarOpen, showControls }}
    >
      <div
        className={cn(
          "group flex flex-col overflow-y-auto md:flex-row md:overflow-y-hidden",
          className,
        )}
        data-showcontrols={showControls}
      >
        {children}
      </div>
    </MediaViewerContext.Provider>
  );
};

type ControlProps = React.ComponentProps<typeof Button>;

MediaViewerLayout.Control = ({
  className,
  children,
  ...props
}: ControlProps) => {
  return (
    <Button
      size="icon"
      className={cn(
        "bg-primary/35 absolute z-10 backdrop-blur-lg transition-opacity [&:not(:hover)]:group-data-[showcontrols=false]:opacity-0",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

type MediaContentProps = {
  children: ReactNode;
};

MediaViewerLayout.MediaContent = ({ children }: MediaContentProps) => {
  // Note the hidden overflow is necessary to avoid the scroll container being stuck and showing a
  // bar at the bottom when scrolling in mobile view and resizing to desktop view after.
  return (
    <div className="relative h-full w-full md:overflow-hidden">{children}</div>
  );
};

type SidebarProps = {
  children: ReactNode;
  toggleButtonProps?: React.ComponentProps<typeof Button>;
};

MediaViewerLayout.Sidebar = ({ children, toggleButtonProps }: SidebarProps) => {
  const { isSidebarOpen, setIsSidebarOpen } = useMediaViewer();

  return (
    <div
      className="bg-background group/sidebar relative mr-0 flex shrink-0 flex-col px-4 py-4 md:w-[350px] md:transition-all md:duration-500 md:data-[opened=false]:-mr-[350px]"
      data-opened={isSidebarOpen}
    >
      <MediaViewerLayout.Control
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title="Toggle sidebar"
        {...toggleButtonProps}
        className={cn(
          "-left-[57px] hidden md:flex",
          toggleButtonProps?.className,
        )}
      >
        <ArrowRightToLine className="transition-transform duration-500 group-data-[opened=false]/sidebar:-rotate-180" />
      </MediaViewerLayout.Control>
      {children}
    </div>
  );
};

type SidebarInfoProps = {
  topic?: string | null;
  title: string;
  tags?: string[];
  description?: string | null;
  dialogClose?: boolean; // If true, adds dialog close button
  children?: ReactNode; // For the metadata spans
};

MediaViewerLayout.SidebarInfo = ({
  topic,
  title,
  tags = [],
  description,
  dialogClose = false,
  children,
}: SidebarInfoProps) => {
  return (
    <>
      {topic && (
        <h4
          className={cn(
            "text-muted-foreground mb-[3px] text-[15px] font-medium",
            {
              "mr-6": dialogClose,
            },
          )}
        >
          {topic}
        </h4>
      )}
      <h3
        className={cn(
          "mb-5 text-xl font-medium tracking-[0.25px] break-words",
          {
            "mr-6": dialogClose && !topic,
          },
        )}
      >
        {title}
      </h3>
      <div className="-mx-4 flex grow flex-col overflow-auto px-4">
        <Tags values={tags} maxLines={2} expandable className="mb-7" />
        {children && (
          <div className="text-muted-foreground mb-8 grid grid-cols-2 justify-between gap-3 text-xs font-light">
            {children}
          </div>
        )}
        {description && (
          <div className="text-secondary-foreground text-sm">{description}</div>
        )}
      </div>
      {dialogClose && (
        <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogClose>
      )}
    </>
  );
};

type SidebarActionsProps = {
  children: ReactNode;
};

MediaViewerLayout.SidebarActions = ({ children }: SidebarActionsProps) => {
  return <div className="mt-3.5 flex flex-col gap-2.5">{children}</div>;
};

// Export the hook for external use
export { useMediaViewer };
