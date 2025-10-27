"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/use-sidebar-store";
import PhotoViewer from "./photo-viewer";
import { MediaViewerLayout } from "./media-viewer-layout";

type PhotoModalProps = {
  photoId?: number | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (direction: "next" | "prev") => void;
  hasNext?: boolean;
  hasPrev?: boolean;
};

const PhotoModal = ({
  photoId,
  isOpen,
  onOpenChange,
  onNavigate,
  hasNext = false,
  hasPrev = false,
}: PhotoModalProps) => {
  const isSidebarOpen = useSidebarStore((state) => state.isPhotosOpened);
  const setIsSidebarOpen = useSidebarStore((state) => state.togglePhotosOpened);

  if (!photoId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[95vh] overflow-hidden border-0 p-0 sm:max-w-[95vw]"
        showCloseButton={false}
      >
        <PhotoViewer
          photoId={photoId}
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
        </PhotoViewer>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;
