import { create } from "zustand";

interface GloBalProps {
  isFirstRender: boolean;
  setFirstRender: (val: boolean) => void;
  getPathName: () => string;
}
export const useGlobalStore = create<GloBalProps>((set) => ({
  isFirstRender: true,
  setFirstRender: (val: boolean) => set({ isFirstRender: val }),
  getPathName: () => {
    const path = window.location.pathname.split("/").slice(0, -1)[2];
    return path;
  },
}));
