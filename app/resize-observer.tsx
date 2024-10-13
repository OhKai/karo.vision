"use client";

import { useEffect } from "react";
import { useResizeStore } from "@/lib/use-resize-store";

type ResizeObserverProps = {
  children: React.ReactNode;
};

const ResizeObserver = ({ children }: ResizeObserverProps) => {
  const setWindowWidth = useResizeStore((state) => state.setWindowWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setWindowWidth]);

  return children;
};

export default ResizeObserver;
