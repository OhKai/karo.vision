import { create } from "zustand";

export type SidebarState = {
  isVideosOpened: boolean;
  isPhotosOpened: boolean;
};

type SidebarAction = {
  toggleVideosOpened: () => void;
  togglePhotosOpened: () => void;
};

const initialSidebarState: SidebarState = {
  isVideosOpened: true,
  isPhotosOpened: true,
};

export const useSidebarStore = create<SidebarState & SidebarAction>((set) => ({
  ...initialSidebarState,
  toggleVideosOpened: () =>
    set((state) => {
      const newValue = !state.isVideosOpened;
      return { isVideosOpened: newValue };
    }),
  togglePhotosOpened: () =>
    set((state) => {
      const newValue = !state.isPhotosOpened;
      return { isPhotosOpened: newValue };
    }),
}));
