"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useResizeStore } from "@/lib/use-resize-store";
import { SquarePlus } from "lucide-react";

type TagsProps = {
  values: string[];
  maxLines?: number;
  expandable?: boolean;
  className?: string;
};

const getOverflowIndicatorLength = (digits: number) => 4 + 8.84 + 7.7 * digits; // gap + ml + "+" + "4" width * digits

const Tags = ({ values, maxLines = 2, expandable, className }: TagsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutoff, setCutoff] = useState<number | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  const windowWidth = useResizeStore((state) => state.windowWidth);

  useLayoutEffect(() => {
    setCutoff(undefined);
  }, [values, maxLines, windowWidth]);

  useLayoutEffect(() => {
    // This is where we calculate the cutoff. It happens after the first render
    // (or when the values change) but before the browser paints, so there is no
    // flicker.
    if (cutoff === undefined) {
      let row = 0;
      let offset = 0;
      let i = 0;
      for (const tag of Array.from(containerRef.current!.children)) {
        if ((tag as HTMLDivElement).offsetTop > offset) {
          row += 1;
          offset = (tag as HTMLDivElement).offsetTop;
        }

        if (row > maxLines) {
          setCutoff(i);
          return;
        } else if (
          // Check if the indicator in the last row would overflow, if so, cut off one earlier.
          row === maxLines &&
          i < containerRef.current!.children.length - 1 && // not the last tag
          (tag as HTMLDivElement).offsetLeft +
            (tag as HTMLDivElement).offsetWidth +
            getOverflowIndicatorLength(
              (containerRef.current!.children.length - i).toString().length,
            ) >
            containerRef.current!.offsetLeft + containerRef.current!.offsetWidth
        ) {
          setCutoff(i);
          return;
        }

        i++;
      }

      // IMPORTANT: No cutoff, but we need to update the state so a new render
      // is triggered when setting it to undefined again (e.g. on resize).
      setCutoff(containerRef.current!.children.length);
    }
  }, [cutoff, maxLines]);

  return (
    <div className={cn(className)}>
      <div ref={containerRef} className="flex flex-wrap gap-1 items-center">
        {values.slice(0, isExpanded ? undefined : cutoff).map((value) => (
          <Button
            key={value}
            data-key={value}
            variant="secondary"
            size="sm"
            className="text-[11px] px-4 py-1 h-auto inline-block truncate"
          >
            {value}
          </Button>
        ))}
        {!isExpanded && cutoff !== undefined && values.length - cutoff > 0 ? (
          <>
            <div className="text-xs text-title ml-0.5">
              {cutoff > 0 && "+"}
              {values.length - cutoff}
            </div>
          </>
        ) : null}
      </div>
      {!isExpanded &&
      cutoff !== undefined &&
      values.length - cutoff > 0 &&
      expandable ? (
        <Button
          variant="default"
          size="sm"
          className="text-[11px] px-2 py-1 h-auto mt-2"
          onClick={() => setIsExpanded(true)}
        >
          <SquarePlus className="!w-3 !h-3" /> Show All
        </Button>
      ) : null}
    </div>
  );
};

export default Tags;
