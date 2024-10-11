"use client";

import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type SearchSortBy =
  | "name-asc"
  | "name-desc"
  | "date-asc"
  | "date-desc"
  | "size-asc"
  | "size-desc"
  | "random";

const SearchBar = () => {
  const [sortBy, setSortBy] = useState<SearchSortBy>("name-asc");

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="grid grid-cols-[40px_1fr_40px] gap-2 peer">
        <Input
          type="search"
          spellCheck={false}
          placeholder="Search Files, Tags, Notes ..."
          className="w-[590px] rounded-full h-[42px] px-5 col-start-2 font-medium focus-within:shadow-[0_2px_8px_-2px_hsl(var(--foreground)_/_8%)] text-title"
        />
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground"
          title="Search Options"
        >
          <SlidersHorizontal />
        </Button>
      </div>
      <ToggleGroup
        type="single"
        className="justify-stretch w-[278px] focus-within:opacity-100 focus-within:scale-100 focus-within:translate-y-0 peer-focus-within:opacity-100 peer-focus-within:scale-100 peer-focus-within:translate-y-0 opacity-0 scale-95 translate-y-[-10px] transition-all"
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
        <ToggleGroupItem
          value="name"
          aria-label="Toggle Name"
          className="flex-1"
        >
          Name{" "}
          {sortBy.startsWith("name")
            ? sortBy.endsWith("asc")
              ? "↑"
              : "↓"
            : null}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="date"
          aria-label="Toggle Date"
          className="flex-1"
        >
          Date{" "}
          {sortBy.startsWith("date")
            ? sortBy.endsWith("asc")
              ? "↑"
              : "↓"
            : null}
        </ToggleGroupItem>
        <ToggleGroupItem
          value="size"
          aria-label="Toggle Size"
          className="flex-1"
        >
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
    </div>
  );
};

export default SearchBar;
