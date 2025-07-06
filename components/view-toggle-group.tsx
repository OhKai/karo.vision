import { useViewStore, ViewState } from "@/lib/use-view-store";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useTransition } from "react";

type ViewToggleGroupProps = {
  viewKey: keyof ViewState;
  enabledViews: ViewState[keyof ViewState][];
};

const ViewToggleGroup = ({ viewKey, enabledViews }: ViewToggleGroupProps) => {
  const view = useViewStore((state) => state[viewKey]);
  const updateView = useViewStore((state) => state.updateView);
  const [isPending, startTransition] = useTransition();

  return (
    <ToggleGroup
      type="single"
      size="sm"
      className="w-auto"
      variant="outline"
      value={view}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(() =>
          updateView(viewKey, value as ViewState[keyof ViewState]),
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
