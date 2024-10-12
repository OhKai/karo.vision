import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

type TagsProps = {
  values: string[];
  maxLines?: number;
  expandable?: boolean;
};

const getOverflowIndicatorLength = (digits: number) => 4 + 8.84 + 7.7 * digits; // gap + ml + "+" + "4" width * digits

const Tags = ({ values, maxLines = 2, expandable }: TagsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutoff, setCutoff] = useState<number | undefined>(undefined);
  const [isExpanded, setIsExpanded] = useState(false);

  useLayoutEffect(() => {
    setCutoff(undefined);
  }, [values, maxLines]);

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
    }
  }, [cutoff, maxLines]);

  return (
    <div ref={containerRef} className="flex flex-wrap gap-1 items-center">
      {values.slice(0, isExpanded ? undefined : cutoff).map((value) => (
        <Button
          key={value}
          data-key={value}
          variant="secondary"
          size="sm"
          className="text-[11px] px-4 py-1 h-auto inline-block text-ellipsis overflow-hidden whitespace-nowrap"
        >
          {value}
        </Button>
      ))}
      {!isExpanded && cutoff ? (
        <>
          <div className="text-xs text-title ml-0.5">
            +{values.length - cutoff}
          </div>
          {expandable ? (
            <Button
              variant="default"
              size="sm"
              className="text-[11px] px-2 py-1 h-auto mt-1.5"
              onClick={() => setIsExpanded(true)}
            >
              Show All
            </Button>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default Tags;
