import {
  useSearchOptionsStore,
  SearchOptionsState,
} from "@/lib/use-search-options-store";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

type ModalSwitchProps = {
  viewKey: keyof SearchOptionsState;
};

const ModalSwitch = ({ viewKey }: ModalSwitchProps) => {
  const openInNewTab = useSearchOptionsStore(
    (state) => state[viewKey].openInNewTab,
  );
  const updateSearchOptions = useSearchOptionsStore(
    (state) => state.updateSearchOptions,
  );

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="open-in-new-tab"
        checked={openInNewTab}
        onCheckedChange={(checked) => {
          updateSearchOptions(viewKey, { openInNewTab: checked });
        }}
      />
      <Label htmlFor="open-in-new-tab" className="text-sm">
        Open in new tab
      </Label>
    </div>
  );
};

export default ModalSwitch;
