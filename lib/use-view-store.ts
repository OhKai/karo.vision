import { create } from "zustand";
import { readLocalStorage, writeLocalStorage } from "./utils";

export type ViewState = {
  videos: "list" | "cards" | "tiles";
  photos: "list" | "tiles";
  music: "list";
};

type ViewAction = {
  updateView: (key: keyof ViewState, newView: ViewState[typeof key]) => void;
};

const initialViewState: ViewState = {
  videos: readLocalStorage("videos-view", "cards") as ViewState["videos"],
  photos: readLocalStorage("photos-view", "tiles") as ViewState["photos"],
  music: "list", // No local storage for music view, since it's only one option.
};

export const useViewStore = create<ViewState & ViewAction>((set) => ({
  ...initialViewState,
  updateView: (key, newView) => {
    set({ [key]: newView });
    writeLocalStorage(`${key}-view`, newView);
  },
}));
