import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-ice text-white text-xl font-bold">
            🍦
          </div>
          <span className="text-xl font-bold">
            <span className="text-primary">Scoop</span>
            <span className="text-secondary">Heaven</span>
          </span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} ScoopHeaven. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
