"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightToLine, House } from "lucide-react";
import Link from "next/link";
import { ReactNode, createContext, useContext, useState } from "react";
import Tags from "./tags";

// Context for sharing state between compound components
type MediaViewerContextType = {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isUserInactive?: boolean;
  isMediaPaused?: boolean;
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
  isUserInactive?: boolean;
  isMediaPaused?: boolean;
  initialSidebarOpen?: boolean;
};

// Root layout component
export const MediaViewerLayout = ({
  children,
  isUserInactive = true,
  isMediaPaused = true,
  initialSidebarOpen = true,
}: MediaViewerLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(initialSidebarOpen);

  return (
    <MediaViewerContext.Provider
      value={{ isSidebarOpen, setSidebarOpen, isUserInactive, isMediaPaused }}
    >
      <div
        className="group flex flex-col md:h-screen md:flex-row md:overflow-hidden"
        data-userinactive={isUserInactive}
        data-mediapaused={isMediaPaused}
      >
        {children}
      </div>
    </MediaViewerContext.Provider>
  );
};

type HomeButtonProps = {
  onPointerMove?: (e: React.PointerEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
};

MediaViewerLayout.HomeButton = ({
  onPointerMove,
  onMouseLeave,
}: HomeButtonProps) => {
  return (
    <Link href="/">
      <Button
        className="bg-primary/35 absolute top-4 left-[9px] z-10 backdrop-blur-lg transition-opacity [&:not(:hover)]:group-data-[mediapaused=false]:group-data-[userinactive=true]:opacity-0"
        title="Back to home page"
        onPointerMove={onPointerMove}
        onMouseLeave={onMouseLeave}
      >
        <House />
      </Button>
    </Link>
  );
};

type MediaContentProps = {
  children: ReactNode;
};

MediaViewerLayout.MediaContent = ({ children }: MediaContentProps) => {
  return <>{children}</>;
};

type SidebarProps = {
  children: ReactNode;
  onToggleButtonPointerMove?: (e: React.PointerEvent) => void;
  onToggleButtonMouseLeave?: (e: React.MouseEvent) => void;
};

MediaViewerLayout.Sidebar = ({
  children,
  onToggleButtonPointerMove,
  onToggleButtonMouseLeave,
}: SidebarProps) => {
  const { isSidebarOpen, setSidebarOpen } = useMediaViewer();

  return (
    <div
      className="bg-background group/sidebar relative mr-0 flex shrink-0 flex-col px-4 py-4 md:w-[350px] md:transition-all md:duration-500 md:data-[opened=false]:-mr-[350px]"
      data-opened={isSidebarOpen}
    >
      <Button
        className="bg-primary/35 absolute -left-[57px] hidden backdrop-blur-lg transition-opacity md:flex [&:not(:hover)]:group-data-[mediapaused=false]:group-data-[userinactive=true]:opacity-0"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        title="Toggle sidebar"
        onPointerMove={onToggleButtonPointerMove}
        onMouseLeave={onToggleButtonMouseLeave}
      >
        <ArrowRightToLine className="transition-transform duration-500 group-data-[opened=false]/sidebar:-rotate-180" />
      </Button>
      {children}
    </div>
  );
};

type SidebarInfoProps = {
  topic?: string | null;
  title: string;
  tags?: string[];
  description?: string | null;
  children?: ReactNode; // For the metadata spans
};

MediaViewerLayout.SidebarInfo = ({ 
  topic, 
  title, 
  tags = [], 
  description,
  children 
}: SidebarInfoProps) => {
  return (
    <>
      {topic && (
        <h4 className="text-muted-foreground mb-[3px] text-[15px] font-medium">
          {topic}
        </h4>
      )}
      <h3 className="mb-5 text-xl font-medium tracking-[0.25px] break-words">
        {title}
      </h3>
      <div className="-mx-4 flex grow flex-col overflow-auto px-4">
        <Tags
          values={tags}
          maxLines={2}
          expandable
          className="mb-7"
        />
        {children && (
          <div className="text-muted-foreground mb-8 grid grid-cols-2 justify-between gap-3 text-xs font-light">
            {children}
          </div>
        )}
        {description && (
          <div className="text-secondary-foreground text-sm">
            {description}
          </div>
        )}
      </div>
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
