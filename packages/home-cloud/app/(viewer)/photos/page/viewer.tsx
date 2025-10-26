"use client";

import { MediaViewerLayout } from "@/components/media-viewer-layout";
import PhotoViewer from "@/components/photo-viewer";
import VideoViewer, { VideoControl } from "@/components/video-viewer";
import { House } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

const Viewer = () => {
  // Note: This should always be a number since we check it server-side before returning this page.
  const photoId = parseInt(usePathname().split("/").pop()!);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <PhotoViewer
      photoId={photoId}
      fullscreen
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <Link href="/photos">
        <MediaViewerLayout.Control
          title="Back to home page"
          className="top-4 left-[9px] opacity-0 group-hover:opacity-100"
        >
          <House />
        </MediaViewerLayout.Control>
      </Link>
    </PhotoViewer>
  );
};

export default Viewer;
