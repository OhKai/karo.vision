import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SearchSortBy } from "./search-bar";
import { useState } from "react";
import { cn } from "@/lib/utils";

type SortToggleGroupProps = {
  className?: string;
};

const SortToggleGroup = ({ className }: SortToggleGroupProps) => {
  const [sortBy, setSortBy] = useState<SearchSortBy>("name-asc");

  return (
    <ToggleGroup
      type="single"
      className={cn("justify-stretch", className)}
      value={sortBy.split("-")[0] as "name" | "date" | "size" | "random"}
      onMouseDown={(e) => e.preventDefault()}
      onValueChange={(value) => {
        if (!value) {
          // Toggle same sort type order
          const [sort, order] = sortBy.split("-");
          setSortBy(
            (sort +
              (order === "asc"
                ? "-desc"
                : order
                  ? "-asc"
                  : "")) as SearchSortBy,
          );
        } else {
          // Change sort type
          setSortBy(
            (value === "random" ? "random" : value + "-asc") as SearchSortBy,
          );
        }
      }}
    >
      <ToggleGroupItem value="name" aria-label="Toggle Name" className="flex-1">
        Name{" "}
        {sortBy.startsWith("name")
          ? sortBy.endsWith("asc")
            ? "↑"
            : "↓"
          : null}
      </ToggleGroupItem>
      <ToggleGroupItem value="date" aria-label="Toggle Date" className="flex-1">
        Date{" "}
        {sortBy.startsWith("date")
          ? sortBy.endsWith("asc")
            ? "↑"
            : "↓"
          : null}
      </ToggleGroupItem>
      <ToggleGroupItem value="size" aria-label="Toggle Size" className="flex-1">
        Size{" "}
        {sortBy.startsWith("size")
          ? sortBy.endsWith("asc")
            ? "↑"
            : "↓"
          : null}
      </ToggleGroupItem>
      <ToggleGroupItem
        value="random"
        aria-label="Toggle Random"
        className="flex-1"
      >
        Random
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default SortToggleGroup;
