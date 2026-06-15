"use client";

import { Toast } from "@/components/ui/Toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toast />
    </>
  );
}
