"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        root.classList.add("dark");
      }
    }
  }, []);

  return <>{children}</>;
}
