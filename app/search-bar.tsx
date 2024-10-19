"use client";

import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useViewStore } from "@/lib/use-view-store";
import SortToggleGroup from "./sort-toggle-group";

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
  const viewStore = useViewStore();

  return (
    <div
      className={cn(
        "flex flex-col gap-1 items-center justify-center w-[90vw] max-w-[726px]",
        className,
      )}
    >
      <div
        className={cn(
          "grid grid-cols-[40px_1fr_40px] gap-2 peer w-full",
          floating
            ? "backdrop-blur-[80px] px-5 py-3 bg-background/25 shadow-float rounded-[100px]"
            : "",
        )}
      >
        <div
          className="flex items-center justify-center text-black/[22%] text-xs font-bold bg-muted rounded-full w-[40px] h-[40px]"
          title="205.535 results"
        >
          205K
        </div>
        <Input
          type="search"
          spellCheck={false}
          placeholder="Search Files, Tags, Notes ..."
          className="rounded-full h-[42px] px-5 col-start-2 font-medium focus-within:shadow-[0_2px_8px_-2px_hsl(var(--foreground)_/_8%)] text-title"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground"
              title="Search Options"
              onMouseDown={(e) => e.preventDefault()}
            >
              <SlidersHorizontal />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="text-title flex flex-col gap-4 w-[325px]"
            // Prevent autofocus on the first item.
            onOpenAutoFocus={(e) => {
              document.activeElement === document.body && e.preventDefault();
            }}
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
                className="flex-1 hidden md:inline-flex"
              >
                Cards
              </ToggleGroupItem>
              <ToggleGroupItem
                value="tiles"
                aria-label="Toggle Tiles"
                className="flex-1 max-md:data-[cards=true]:bg-black/[4%] max-md:data-[cards=true]:text-accent-foreground"
                // On mobile, coalesce to "tiles" if "cards" is selected.
                data-cards={viewStore.videos === "cards"}
              >
                Tiles
              </ToggleGroupItem>
            </ToggleGroup>
            <SortToggleGroup className="flex md:hidden" />
            <div className="flex items-center space-x-2">
              <Switch id="open-blank" />
              <Label htmlFor="open-blank" className="text-xs">
                Open In New Tab
              </Label>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div
        className={cn(
          "focus-within:pointer-events-auto focus-within:opacity-100 focus-within:scale-100 focus-within:translate-y-0 peer-focus-within:pointer-events-auto peer-focus-within:opacity-100 peer-focus-within:scale-100 peer-focus-within:translate-y-0 opacity-0 scale-95 translate-y-[-10px] transition-all md:block hidden pointer-events-none",
          floating
            ? "backdrop-blur-[80px] px-3 py-2.5 bg-background/25 shadow-float rounded-[14px]"
            : "",
        )}
      >
        <SortToggleGroup className="w-[278px] border-none bg-background/75" />
      </div>
    </div>
  );
};

export default SearchBar;
