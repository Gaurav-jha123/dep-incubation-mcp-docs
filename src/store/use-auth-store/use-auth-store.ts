import { create } from "zustand";

export interface IUserDetails {
  fName: string | null;
  lName: string | null;
  emailId: string | null;
  isLoggedIn: boolean;
  iat: number | null;
  exp: number | null;
  setUserDetails: (userDetails: Omit<IUserDetails, 'setUserDetails' | 'clearUserDetails' | 'getUserName'>) => void;
  clearUserDetails: () => void;
  getUserName: () => string;
}

export const useAuthStore = create<IUserDetails>((set, get) => ({
  fName: null,
  lName: null,
  emailId: null,
  isLoggedIn: false,
  iat: null,
  exp: null,

  // setters
  setUserDetails: (userDetails) => set(userDetails),
  clearUserDetails: () =>
    set({
      fName: null,
      lName: null,
      emailId: null,
      isLoggedIn: false,
      iat: null,
      exp: null,
    }),
    getUserName: () => {
      const { fName, lName } = get()
      return `${fName} ${lName}`
    },
}));
