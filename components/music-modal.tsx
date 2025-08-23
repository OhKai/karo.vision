"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import VideoViewer, { VideoControl } from "./video-viewer";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/use-sidebar-store";
import PhotoViewer from "./photo-viewer";
import { MediaViewerLayout } from "./media-viewer-layout";
import MusicViewer from "./music-viewer";

type MusicModalProps = {
  musicId?: number | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (direction: "next" | "prev") => void;
  hasNext?: boolean;
  hasPrev?: boolean;
};

const MusicModal = ({
  musicId,
  isOpen,
  onOpenChange,
  onNavigate,
  hasNext = false,
  hasPrev = false,
}: MusicModalProps) => {
  const isSidebarOpen = useSidebarStore((state) => state.isMusicOpened);
  const setIsSidebarOpen = useSidebarStore((state) => state.toggleMusicOpened);

  if (!musicId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[95vh] overflow-hidden border-0 p-0 sm:max-w-[95vw]"
        showCloseButton={false}
      >
        <MusicViewer
          musicId={musicId}
          key={musicId}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        >
          {onNavigate && (
            <>
              <MediaViewerLayout.Control
                className={cn(
                  "top-1/2 left-4 size-12 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100",
                  {
                    hidden: !hasPrev,
                  },
                )}
                onClick={() => hasPrev && onNavigate("prev")}
              >
                <ChevronLeft className="size-5" />
              </MediaViewerLayout.Control>
              <MediaViewerLayout.Control
                className={cn(
                  "top-1/2 right-4 size-12 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100",
                  {
                    hidden: !hasNext,
                  },
                )}
                onClick={() => hasNext && onNavigate("next")}
              >
                <ChevronRight className="size-5" />
              </MediaViewerLayout.Control>
            </>
          )}
        </MusicViewer>
      </DialogContent>
    </Dialog>
  );
};

export default MusicModal;
