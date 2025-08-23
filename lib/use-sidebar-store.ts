import { create } from "zustand";

export type SidebarState = {
  isVideosOpened: boolean;
  isPhotosOpened: boolean;
  isMusicOpened: boolean;
};

type SidebarAction = {
  toggleVideosOpened: () => void;
  togglePhotosOpened: () => void;
  toggleMusicOpened: () => void;
};

const initialSidebarState: SidebarState = {
  isVideosOpened: true,
  isPhotosOpened: true,
  isMusicOpened: true,
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
  toggleMusicOpened: () =>
    set((state) => {
      const newValue = !state.isMusicOpened;
      return { isMusicOpened: newValue };
    }),
}));
