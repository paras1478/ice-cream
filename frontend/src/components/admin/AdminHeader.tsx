"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Bell, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { data: session } = useSession();
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-6 h-16 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-4.5 w-4.5" />
          ) : (
            <Moon className="h-4.5 w-4.5" />
          )}
        </button>

        {/* Notifications */}
        <button className="relative h-9 w-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-dark-border">
          {session?.user.image ? (
            <Image
              src={session.user.image}
              alt="Admin"
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-ice flex items-center justify-center text-white font-bold text-sm">
              {session?.user.name?.[0]?.toUpperCase() || "A"}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {session?.user.name}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-2 h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
