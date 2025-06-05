import { create } from "zustand";

interface props {
  isBoolean: { [key: string]: boolean };
  setIsBoolean: (key: string, value: boolean) => void;
}

export const useShowFunction = create<props>((set) => ({
  isBoolean: {},
  setIsBoolean: (key: string, value: boolean) =>
    set((state) => ({ isBoolean: { ...state.isBoolean, [key]: value } })),
}));
