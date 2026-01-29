"use client";

import { useEffect, useMemo, useState } from "react";
import { Command, FilePlus, FileText } from "lucide-react";
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
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return items.filter((item) =>
      item.name.toLowerCase().includes(lower) ||
      item.path.toLowerCase().includes(lower),
    );
  }, [items, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3 text-zinc-400">
          <Command className="h-4 w-4" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const first = filtered[0];
                if (first) {
                  onSelect(first.path);
                  onOpenChange(false);
                } else if (query.trim()) {
                  onCreate(query.trim());
                  onOpenChange(false);
                }
              }
            }}
            placeholder="Search notes or create a new one..."
            className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          />
        </div>
        <div className="max-h-72 overflow-y-auto py-2">
          <button
            type="button"
            onClick={() => {
              const title = query.trim() || "Untitled";
              onCreate(title);
              onOpenChange(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-900"
          >
            <FilePlus className="h-4 w-4 text-emerald-400" />
            <span>Create “{query.trim() || "Untitled"}”</span>
          </button>
          <div className="px-4 py-2 text-xs uppercase tracking-[0.2em] text-zinc-600">
            Documents
          </div>
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-zinc-500">
              No matches found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  onSelect(item.path);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-900",
                )}
              >
                <FileText className="h-4 w-4 text-zinc-500" />
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-xs text-zinc-500">{item.path}</span>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="border-t border-zinc-800 px-4 py-3 text-xs text-zinc-500">
          Press Esc to close · Enter to open or create
        </div>
      </div>
    </div>
  );
}
