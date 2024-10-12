"use client";

import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useViewStore } from "@/lib/use-view-store";

export type SearchSortBy =
  | "name-asc"
  | "name-desc"
  | "date-asc"
  | "date-desc"
  | "size-asc"
  | "size-desc"
  | "random";

type SearchBarProps = {
  className?: string;
  floating?: boolean;
};

const SearchBar = ({ className, floating = false }: SearchBarProps) => {
  const [sortBy, setSortBy] = useState<SearchSortBy>("name-asc");
  const viewStore = useViewStore();

  return (
    <div
      className={cn(
        "flex flex-col gap-1 items-center justify-center",
        className,
      )}
    >
      <div
        className={cn(
          "grid grid-cols-[40px_1fr_40px] gap-2 peer",
          floating
            ? "backdrop-blur-[80px] px-5 py-3 bg-background/25 shadow-float rounded-[100px]"
            : "",
        )}
      >
        <div className="flex items-center justify-center text-black/[22%] text-xs font-bold bg-muted rounded-full w-[40px] h-[40px]">
          205
        </div>
        <Input
          type="search"
          spellCheck={false}
          placeholder="Search Files, Tags, Notes ..."
          className="w-[590px] rounded-full h-[42px] px-5 col-start-2 font-medium focus-within:shadow-[0_2px_8px_-2px_hsl(var(--foreground)_/_8%)] text-title"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground"
              title="Search Options"
            >
              <SlidersHorizontal />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="text-title flex flex-col gap-4"
            autoFocus
            // Prevent autofocus on the first item.
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <ToggleGroup
              type="single"
              className="justify-stretch"
              value={viewStore.videos}
              onValueChange={(value) => {
                viewStore.updateView(
                  "videos",
                  value as "list" | "cards" | "tiles",
                );
              }}
            >
              <ToggleGroupItem
                value="list"
                aria-label="Toggle List"
                className="flex-1"
              >
                List
              </ToggleGroupItem>
              <ToggleGroupItem
                value="cards"
                aria-label="Toggle Cards"
                className="flex-1"
              >
                Cards
              </ToggleGroupItem>
              <ToggleGroupItem
                value="tiles"
                aria-label="Toggle Tiles"
                className="flex-1"
              >
                Tiles
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="flex items-center space-x-2">
              <Switch id="group-folders" />
              <Label htmlFor="group-folders" className="text-xs">
                Group By Folders
              </Label>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div
        className={cn(
          "focus-within:opacity-100 focus-within:scale-100 focus-within:translate-y-0 peer-focus-within:opacity-100 peer-focus-within:scale-100 peer-focus-within:translate-y-0 opacity-0 scale-95 translate-y-[-10px] transition-all",
          floating
            ? "backdrop-blur-[80px] px-3 py-2.5 bg-background/25 shadow-float rounded-[14px]"
            : "",
        )}
      >
        <ToggleGroup
          type="single"
          className="justify-stretch w-[278px] border-none bg-background/75"
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
                (value === "random"
                  ? "random"
                  : value + "-asc") as SearchSortBy,
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
    </div>
  );
};

export default SearchBar;
