import { create } from "zustand";

export interface ITheme {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const Theme=create<ITheme>((set,get) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
  getTheme: () => get().theme,
}));