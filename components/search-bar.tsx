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
  | "title-asc"
  | "title-desc"
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
        "flex w-[90vw] max-w-[726px] flex-col items-center justify-center gap-1",
        className,
      )}
    >
      <div
        className={cn(
          "peer grid w-full grid-cols-[40px_1fr_40px] gap-2",
          floating
            ? "bg-background/25 shadow-float rounded-[100px] px-5 py-3 backdrop-blur-[80px]"
            : "",
        )}
      >
        <div
          className="text-muted-foreground bg-background/75 flex size-10 items-center justify-center rounded-full text-xs font-bold"
          title="205.535 results"
        >
          205K
        </div>
        <div className="relative col-start-2">
          <Search
            strokeWidth={2.5}
            className="text-accent-foreground pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2"
          />
          <Input
            type="search"
            spellCheck={false}
            placeholder="Search Files, Tags, Notes ..."
            className="bg-secondary text-accent-foreground h-[40px] rounded-full border-transparent pr-5 pl-11 font-medium focus-visible:border-zinc-300 focus-visible:ring-0"
            value={value[0]}
            onChange={(e) => onChange([e.target.value])}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground bg-background/75 size-10"
              title="Search Options"
              onMouseDown={(e) => e.preventDefault()}
            >
              <SlidersHorizontal className="size-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="text-muted-foreground flex w-[325px] flex-col gap-4"
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
                className="w-auto md:hidden"
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
          "pointer-events-none hidden translate-y-[-10px] scale-95 opacity-0 transition-all peer-focus-within:pointer-events-auto peer-focus-within:translate-y-0 peer-focus-within:scale-100 peer-focus-within:opacity-100 focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:scale-100 focus-within:opacity-100 md:block",
          floating
            ? "bg-background/25 shadow-float rounded-[14px] px-3 py-2.5 backdrop-blur-[80px]"
            : "",
        )}
      >
        <SortToggleGroup
          className="bg-background/75 text-muted-foreground w-[335px]"
          size="xs"
          value={sortValue}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
