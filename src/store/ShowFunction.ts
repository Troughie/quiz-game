import { create } from "zustand";

interface props {
  isShow: { [key: string]: boolean };
  setIsShow: (key: string, value: boolean) => void;
}

export const useShowFunction = create<props>((set) => ({
  isShow: {},
  setIsShow: (key: string, value: boolean) =>
    set((state) => ({ isShow: { ...state.isShow, [key]: value } })),
}));
