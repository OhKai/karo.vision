import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SearchSortBy } from "./search-bar";
import { Shuffle } from "lucide-react";

type SortToggleGroupProps = {
  className?: string;
  size?: "default" | "sm" | "lg" | "xs";
  value: SearchSortBy;
  onChange: (value: SearchSortBy) => void;
};

const SortToggleGroup = ({
  className,
  size,
  value,
  onChange,
}: SortToggleGroupProps) => {
  return (
    <ToggleGroup
      type="single"
      size={size}
      variant="outline"
      className={className}
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
      <ToggleGroupItem value="name" aria-label="Toggle Name">
        Name{" "}
        {value.startsWith("name") ? (value.endsWith("asc") ? "↑" : "↓") : null}
      </ToggleGroupItem>
      <ToggleGroupItem value="date" aria-label="Toggle Date">
        Date{" "}
        {value.startsWith("date") ? (value.endsWith("asc") ? "↑" : "↓") : null}
      </ToggleGroupItem>
      <ToggleGroupItem value="size" aria-label="Toggle Size">
        Size{" "}
        {value.startsWith("size") ? (value.endsWith("asc") ? "↑" : "↓") : null}
      </ToggleGroupItem>
      <ToggleGroupItem value="random" aria-label="Toggle Random">
        <div className="flex items-center justify-center gap-1">
          Random {value === "random" ? <Shuffle className="size-3" /> : null}
        </div>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default SortToggleGroup;
