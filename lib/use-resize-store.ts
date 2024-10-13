import { create } from "zustand";

type ResizeState = {
  windowWidth: number;
};

type ResizeAction = {
  setWindowWidth: (width: number) => void;
};

export const useResizeStore = create<ResizeState & ResizeAction>((set) => ({
  windowWidth: typeof window !== "undefined" ? window.innerWidth : 0,
  setWindowWidth: (width) => set({ windowWidth: width }),
}));
