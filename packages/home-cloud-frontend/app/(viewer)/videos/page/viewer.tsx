"use client";

import VideoViewer, { VideoControl } from "@/components/video-viewer";
import { House } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

const Viewer = () => {
  const params = useParams();
  // TODO: remove this test to see what it is in production
  console.log(params);

  // Note: This should always be a number since we check it server-side before returning this page.
  const videoId = parseInt(usePathname().split("/").pop()!);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <VideoViewer
      videoId={videoId}
      fullscreen
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
    >
      <Link href="/">
        <VideoControl title="Back to home page" className="top-4 left-[9px]">
          <House />
        </VideoControl>
      </Link>
    </VideoViewer>
  );
};

export default Viewer;
