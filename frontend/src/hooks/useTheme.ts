import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";

interface ThemeStore {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light",

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        }));
      },

      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: "theme-storage",
    }
  )
);

// Hook to apply theme to document
export function useThemeEffect() {
  const theme = useTheme((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);
}
