"use client";

import { Toaster } from "react-hot-toast";

export function Toast() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#fff",
          color: "#333",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          fontSize: "14px",
          fontWeight: "500",
        },
        success: {
          iconTheme: {
            primary: "#FF6B9D",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
