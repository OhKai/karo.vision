import {
  useSearchOptionsStore,
  SearchOptionsState,
} from "@/lib/use-search-options-store";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useTransition } from "react";

type ViewToggleGroupProps = {
  viewKey: keyof SearchOptionsState;
  enabledViews: SearchOptionsState[keyof SearchOptionsState]["view"][];
};

const ViewToggleGroup = ({ viewKey, enabledViews }: ViewToggleGroupProps) => {
  const view = useSearchOptionsStore((state) => state[viewKey].view);
  const updateSearchOptions = useSearchOptionsStore(
    (state) => state.updateSearchOptions,
  );
  const [isPending, startTransition] = useTransition();

  return (
    <ToggleGroup
      type="single"
      size="xs"
      className="w-auto"
      variant="outline"
      value={view}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(() =>
          updateSearchOptions(viewKey, {
            view: value as SearchOptionsState[keyof SearchOptionsState]["view"],
          }),
        );
      }}
    >
      {enabledViews.includes("list") && (
        <ToggleGroupItem value="list" aria-label="Toggle List">
          List
        </ToggleGroupItem>
      )}
      {enabledViews.includes("posters") && (
        <ToggleGroupItem value="posters" aria-label="Toggle Posters">
          Posters
        </ToggleGroupItem>
      )}
      {enabledViews.includes("cards") && (
        <ToggleGroupItem
          value="cards"
          aria-label="Toggle Cards"
          className="hidden md:inline-flex"
        >
          Cards
        </ToggleGroupItem>
      )}
      {enabledViews.includes("tiles") && (
        <ToggleGroupItem
          value="tiles"
          aria-label="Toggle Tiles"
          className="max-md:data-[cards=true]:text-accent-foreground max-md:data-[cards=true]:bg-black/[4%]"
          // On mobile, coalesce to "tiles" if "cards" is selected.
          data-cards={view === "cards"}
        >
          Tiles
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  );
};

export default ViewToggleGroup;
