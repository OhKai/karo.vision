import { create } from "zustand";
import { readLocalStorage, writeLocalStorage } from "./utils";

export type SearchOptionsState = {
  videos: { view: "list" | "cards" | "tiles"; openInNewTab: boolean };
  photos: { view: "list" | "posters" | "tiles"; openInNewTab: boolean };
  music: { view: "list"; openInNewTab: boolean };
};

type SearchOptionsAction = {
  updateSearchOptions: <K extends keyof SearchOptionsState>(
    key: K,
    newOptions: Partial<SearchOptionsState[K]>,
  ) => void;
};

const initialSearchOptionsState: SearchOptionsState = {
  videos: {
    view: readLocalStorage(
      "videos-view",
      "tiles",
    ) as SearchOptionsState["videos"]["view"],
    openInNewTab: readLocalStorage("videos-openInNewTab", "true") === "true",
  },
  photos: {
    view: readLocalStorage(
      "photos-view",
      "posters",
    ) as SearchOptionsState["photos"]["view"],
    openInNewTab: readLocalStorage("photos-openInNewTab", "false") === "true",
  },
  music: { view: "list", openInNewTab: false }, // No local storage for music view, since it's only one option.
};

export const useSearchOptionsStore = create<
  SearchOptionsState & SearchOptionsAction
>((set) => ({
  ...initialSearchOptionsState,
  updateSearchOptions: (key, newOptions) => {
    set((state) => ({ [key]: { ...state[key], ...newOptions } }));
    Object.entries(newOptions).forEach(([optionKey, optionValue]) => {
      // Write each option to local storage.
      writeLocalStorage(
        `${key}-${optionKey}`,
        typeof optionValue === "boolean" ? String(optionValue) : optionValue,
      );
    });
  },
}));
