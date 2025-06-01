"use client";

import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SortToggleGroup from "./sort-toggle-group";
import ViewToggleGroup from "./view-toggle-group";
import { ViewState } from "@/lib/use-view-store";

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
  value: string[];
  sortValue: SearchSortBy;
  floating?: boolean;
  searchOptionsNode?: React.ReactNode;
  onChange: (search: string[]) => void;
  onSortChange: (sort: SearchSortBy) => void;
  viewToggle?: {
    page: keyof ViewState;
    enabledViews: ViewState[keyof ViewState][];
  };
};

const SearchBar = ({
  className,
  value,
  sortValue,
  floating = false,
  searchOptionsNode,
  onChange,
  onSortChange,
  viewToggle,
}: SearchBarProps) => {
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
          className="flex items-center justify-center text-xs font-bold text-muted-foreground bg-background/75 rounded-full size-10"
          title="205.535 results"
        >
          205K
        </div>
        <div className="relative col-start-2">
          <Search
            strokeWidth={2.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-accent-foreground pointer-events-none z-10"
          />
          <Input
            type="search"
            spellCheck={false}
            placeholder="Search Files, Tags, Notes ..."
            className="rounded-full h-[40px] pl-11 pr-5 font-medium bg-secondary focus-visible:ring-0 border-transparent focus-visible:border-zinc-300 text-accent-foreground"
            value={value[0]}
            onChange={(e) => onChange([e.target.value])}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="size-10 text-muted-foreground bg-background/75"
              title="Search Options"
              onMouseDown={(e) => e.preventDefault()}
            >
              <SlidersHorizontal className="size-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="text-muted-foreground flex flex-col gap-4 w-[325px]"
            // Prevent autofocus on the first item.
            onOpenAutoFocus={(e) => {
              document.activeElement === document.body && e.preventDefault();
            }}
          >
            <>
              {viewToggle ? (
                <ViewToggleGroup
                  viewKey={viewToggle.page}
                  enabledViews={viewToggle.enabledViews}
                />
              ) : null}
              <SortToggleGroup
                className="md:hidden w-auto"
                size="sm"
                value={sortValue}
                onChange={onSortChange}
              />
              {searchOptionsNode}
            </>
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
        <SortToggleGroup
          className="w-[335px] bg-background/75 text-muted-foreground"
          size="xs"
          value={sortValue}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
