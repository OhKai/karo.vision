"use client";

import { Dialog, DialogContent } from "./ui/dialog";
import { useSidebarStore } from "@/lib/use-sidebar-store";
import MusicViewer from "./music-viewer";

type MusicModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

const MusicModal = ({ isOpen, onOpenChange }: MusicModalProps) => {
  const isSidebarOpen = useSidebarStore((state) => state.isMusicOpened);
  const setIsSidebarOpen = useSidebarStore((state) => state.toggleMusicOpened);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-[95vh] overflow-hidden border-0 p-0 sm:max-w-[95vw]"
        showCloseButton={false}
      >
        <MusicViewer
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        ></MusicViewer>
      </DialogContent>
    </Dialog>
  );
};

export default MusicModal;
