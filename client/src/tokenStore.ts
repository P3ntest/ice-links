import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenStore {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useTokenStore = create(
  persist<TokenStore>(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: "token-storage",
    }
  )
);