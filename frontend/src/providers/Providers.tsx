"use client";

import { SessionProvider } from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
