"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export function ProductSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery !== (searchParams.get("search") || "")) {
      setIsSearching(true);
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedQuery) {
        params.set("search", debouncedQuery);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`/products?${params.toString()}`);
      setTimeout(() => setIsSearching(false), 300);
    }
  }, [debouncedQuery]);

  return (
    <div className="relative w-full">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search flavors, ingredients..."
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm text-gray-700 dark:text-dark-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
