"use client";

import VideoViewer from "@/components/video-viewer";
import { useParams, usePathname } from "next/navigation";

const Viewer = () => {
  const params = useParams();
  // TODO: remove this test to see what it is in production
  console.log(params);

  // Note: This should always be a number since we check it server-side before returning this page.
  const videoId = parseInt(usePathname().split("/").pop()!);
  return <VideoViewer videoId={videoId} />;
};

export default Viewer;
