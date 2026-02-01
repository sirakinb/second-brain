"use client";

import { useMemo, useState } from "react";
import { ChevronRight, FileText, Folder, FolderOpen, Plus, PanelLeftClose, PanelLeft } from "lucide-react";
import Link from "next/link";
import type { DocTreeNode } from "@/lib/types";
import { cn } from "@/lib/utils";

type SidebarProps = {
  tree: DocTreeNode[];
  selectedPath?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelect: (path: string) => void;
  onCreate: () => void;
};

function TreeNode({
  node,
  selectedPath,
  collapsed,
  onToggle,
  onSelect,
  depth,
}: {
  node: DocTreeNode;
  selectedPath?: string;
  collapsed: Record<string, boolean>;
  onToggle: (path: string) => void;
  onSelect: (path: string) => void;
  depth: number;
}) {
  const isDir = node.type === "dir";
  const isCollapsed = collapsed[node.path] ?? false;
  const padding = 16 + depth * 12;

  if (isDir) {
    return (
      <div>
        <button
          type="button"
          onClick={() => onToggle(node.path)}
          className="group flex w-full items-center gap-2 py-1.5 text-left text-[13px] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] rounded-md transition-all"
          style={{ paddingLeft: padding, paddingRight: 12 }}
        >
          <ChevronRight
            className={cn(
              "h-3 w-3 text-zinc-600 transition-transform",
              isCollapsed ? "" : "rotate-90",
            )}
          />
          {isCollapsed ? (
            <Folder className="h-3.5 w-3.5 text-zinc-500" />
          ) : (
            <FolderOpen className="h-3.5 w-3.5 text-zinc-500" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {!isCollapsed && node.children?.length ? (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                selectedPath={selectedPath}
                collapsed={collapsed}
                onToggle={onToggle}
                onSelect={onSelect}
                depth={depth + 1}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  const isActive = selectedPath === node.path;
  return (
    <button
      type="button"
      onClick={() => onSelect(node.path)}
      className={cn(
        "group flex w-full items-center gap-2 py-1.5 text-left text-[13px] transition-all rounded-md",
        isActive
          ? "bg-[#00d4ff]/10 text-[#00d4ff]"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]",
      )}
      style={{ paddingLeft: padding + 16, paddingRight: 12 }}
    >
      <FileText className={cn("h-3.5 w-3.5", isActive ? "text-[#00d4ff]" : "text-zinc-600")} />
      <span className="truncate">{node.name.replace(/\.(md|mdx)$/i, "")}</span>
    </button>
  );
}

export default function Sidebar({
  tree,
  selectedPath,
  isCollapsed,
  onToggleCollapse,
  onSelect,
  onCreate,
}: SidebarProps) {
  const [collapsedDirs, setCollapsedDirs] = useState<Record<string, boolean>>({});

  const hasDocs = useMemo(() => tree.length > 0, [tree]);

  const toggleDir = (path: string) => {
    setCollapsedDirs((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-white/[0.04] bg-[#0d0d0e] transition-all duration-300",
        isCollapsed ? "w-14" : "w-64",
      )}
    >
      {/* Logo & Brand */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.04] px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-[#00d4ff]" />
            <div className="absolute inset-0 h-2 w-2 rounded-full bg-[#00d4ff] animate-ping opacity-30" />
          </div>
          {!isCollapsed && (
            <span className="text-sm font-medium tracking-tight text-white">
              Second Brain
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {isCollapsed ? (
        <div className="flex flex-1 flex-col items-center py-4 gap-4">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          {/* New button */}
          <div className="px-3 py-3">
            <button
              type="button"
              onClick={onCreate}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.04] hover:border-white/[0.1] hover:text-white transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Document</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="px-3 py-2">
            <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600 px-2 mb-2">
              Navigate
            </div>
            <nav className="space-y-0.5">
              <Link
                href="/architecture"
                className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] rounded-md transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                Architecture
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] rounded-md transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                Projects
              </Link>
            </nav>
          </div>

          {/* Documents */}
          <div className="flex-1 overflow-y-auto px-3 py-2">
            <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600 px-2 mb-2">
              Documents
            </div>
            {!hasDocs ? (
              <div className="px-2 py-4 text-xs text-zinc-600">
                No documents yet
              </div>
            ) : (
              <div className="space-y-0.5">
                {tree.map((node) => (
                  <TreeNode
                    key={node.path}
                    node={node}
                    selectedPath={selectedPath}
                    collapsed={collapsedDirs}
                    onToggle={toggleDir}
                    onSelect={onSelect}
                    depth={0}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-4 py-3">
            <div className="flex items-center justify-between text-[10px] text-zinc-600">
              <span>⌘K to search</span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
