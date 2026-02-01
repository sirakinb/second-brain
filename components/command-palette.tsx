"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, FilePlus, FileText, X } from "lucide-react";
import type { DocTreeNode } from "@/lib/types";
import { cn } from "@/lib/utils";

type CommandPaletteProps = {
  isOpen: boolean;
  items: DocTreeNode[];
  onOpenChange: (open: boolean) => void;
  onSelect: (path: string) => void;
  onCreate: (title: string) => void;
};

export default function CommandPalette({
  isOpen,
  items,
  onOpenChange,
  onSelect,
  onCreate,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!isOpen);
      }
      if (event.key === "Escape" && isOpen) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return items.filter((item) =>
      item.name.toLowerCase().includes(lower) ||
      item.path.toLowerCase().includes(lower),
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filtered]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex === 0) {
        onCreate(query.trim() || "Untitled");
        onOpenChange(false);
      } else if (filtered[selectedIndex - 1]) {
        onSelect(filtered[selectedIndex - 1].path);
        onOpenChange(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0C0B0E]/80 backdrop-blur-sm animate-fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.06] bg-[#16141A] shadow-2xl animate-scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-white/[0.04] px-5 py-4">
          <Search className="h-4 w-4 text-[#6B6977]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documents or create new..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#6B6977]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg hover:bg-white/[0.04] text-[#6B6977] hover:text-[#9D9BA8] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1 font-mono text-[10px] text-[#6B6977]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto py-2">
          {/* Create new option */}
          <button
            type="button"
            onClick={() => {
              onCreate(query.trim() || "Untitled");
              onOpenChange(false);
            }}
            className={cn(
              "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors",
              selectedIndex === 0 ? "bg-[#FF7A5C]/10" : "hover:bg-white/[0.02]"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg",
              selectedIndex === 0 ? "bg-[#FF7A5C]/20 text-[#FF7A5C]" : "bg-white/[0.04] text-[#6B6977]"
            )}>
              <FilePlus className="h-4 w-4" />
            </div>
            <span className={cn(
              "text-sm",
              selectedIndex === 0 ? "text-[#FF7A5C]" : "text-[#9D9BA8]"
            )}>
              Create "{query.trim() || "Untitled"}"
            </span>
          </button>

          {/* Divider */}
          <div className="px-5 py-3">
            <div className="label-mono">
              Documents
            </div>
          </div>

          {/* Document list */}
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-[#6B6977]">
              No documents found
            </div>
          ) : (
            filtered.map((item, index) => (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  onSelect(item.path);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors",
                  selectedIndex === index + 1 ? "bg-[#FF7A5C]/10" : "hover:bg-white/[0.02]"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  selectedIndex === index + 1 ? "bg-[#FF7A5C]/20 text-[#FF7A5C]" : "bg-white/[0.04] text-[#6B6977]"
                )}>
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    "text-sm block truncate",
                    selectedIndex === index + 1 ? "text-[#FF7A5C]" : "text-[#F5F3F0]"
                  )}>
                    {item.name.replace(/\.(md|mdx)$/i, "")}
                  </span>
                  <span className="text-[11px] text-[#6B6977] block truncate font-mono">
                    {item.path}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.04] px-5 py-3 flex items-center gap-6 text-[11px] text-[#6B6977]">
          <div className="flex items-center gap-2">
            <kbd className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
            <span>navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
            <span>select</span>
          </div>
        </div>
      </div>
    </div>
  );
}
