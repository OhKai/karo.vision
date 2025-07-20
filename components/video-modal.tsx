"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import VideoViewer, { VideoControl } from "./video-viewer";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/use-sidebar-store";

type VideoModalProps = {
  videoId?: number | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (direction: "next" | "prev") => void;
  hasNext?: boolean;
  hasPrev?: boolean;
};

const VideoModal = ({
  videoId,
  isOpen,
  onOpenChange,
  onNavigate,
  hasNext = false,
  hasPrev = false,
}: VideoModalProps) => {
  const isSidebarOpen = useSidebarStore((state) => state.isVideosOpened);
  const setIsSidebarOpen = useSidebarStore((state) => state.toggleVideosOpened);

  if (!videoId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[95vh] overflow-hidden border-0 p-0 sm:max-w-[95vw]"
        showCloseButton={false}
      >
        <VideoViewer
          videoId={videoId}
          key={videoId}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        >
          {onNavigate && (
            <>
              <VideoControl
                className={cn(
                  "top-1/2 left-4 size-12 -translate-y-1/2 rounded-full",
                  {
                    hidden: !hasPrev,
                  },
                )}
                onClick={() => hasPrev && onNavigate("prev")}
              >
                <ChevronLeft className="size-5" />
              </VideoControl>
              <VideoControl
                className={cn(
                  "top-1/2 right-4 size-12 -translate-y-1/2 rounded-full",
                  {
                    hidden: !hasNext,
                  },
                )}
                onClick={() => hasNext && onNavigate("next")}
              >
                <ChevronRight className="size-5" />
              </VideoControl>
            </>
          )}
        </VideoViewer>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
