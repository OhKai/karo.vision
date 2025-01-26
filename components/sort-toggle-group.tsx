import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SearchSortBy } from "./search-bar";
import { cn } from "@/lib/utils";

type SortToggleGroupProps = {
  className?: string;
  value: SearchSortBy;
  onChange: (value: SearchSortBy) => void;
};

const SortToggleGroup = ({
  className,
  value,
  onChange,
}: SortToggleGroupProps) => {
  return (
    <ToggleGroup
      type="single"
      className={cn("justify-stretch", className)}
      value={value.split("-")[0] as "name" | "date" | "size" | "random"}
      onMouseDown={(e) => e.preventDefault()}
      onValueChange={(newValue) => {
        if (!newValue) {
          // Toggle same sort type order
          const [sort, order] = value.split("-");
          onChange(
            (sort +
              (order === "asc"
                ? "-desc"
                : order
                  ? "-asc"
                  : "")) as SearchSortBy,
          );
        } else {
          // Change sort type
          onChange(
            (newValue === "random"
              ? "random"
              : newValue + "-asc") as SearchSortBy,
          );
        }
      }}
    >
      <ToggleGroupItem value="name" aria-label="Toggle Name" className="flex-1">
        Name{" "}
        {value.startsWith("name") ? (value.endsWith("asc") ? "↑" : "↓") : null}
      </ToggleGroupItem>
      <ToggleGroupItem value="date" aria-label="Toggle Date" className="flex-1">
        Date{" "}
        {value.startsWith("date") ? (value.endsWith("asc") ? "↑" : "↓") : null}
      </ToggleGroupItem>
      <ToggleGroupItem value="size" aria-label="Toggle Size" className="flex-1">
        Size{" "}
        {value.startsWith("size") ? (value.endsWith("asc") ? "↑" : "↓") : null}
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
