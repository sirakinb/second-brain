"use client";

import { useMemo, useState } from "react";
import { ChevronRight, FileText, Folder, FolderOpen, Plus } from "lucide-react";
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
  const padding = 12 + depth * 12;

  if (isDir) {
    return (
      <div>
        <button
          type="button"
          onClick={() => onToggle(node.path)}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800/70"
          style={{ paddingLeft: padding }}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed ? "" : "rotate-90",
            )}
          />
          {isCollapsed ? (
            <Folder className="h-4 w-4 text-zinc-400" />
          ) : (
            <FolderOpen className="h-4 w-4 text-zinc-400" />
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
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition",
        isActive
          ? "bg-zinc-800/80 text-white"
          : "text-zinc-300 hover:bg-zinc-800/50",
      )}
      style={{ paddingLeft: padding + 12 }}
    >
      <FileText className="h-4 w-4 text-zinc-500" />
      <span className="truncate">{node.name}</span>
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
        "relative flex h-full flex-col border-r border-zinc-900/80 bg-zinc-950/80 transition-all duration-300",
        isCollapsed ? "w-16" : "w-72",
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/70 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
          {!isCollapsed && (
            <span className="text-sm font-semibold tracking-wide text-zinc-100">
              Second Brain
            </span>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCreate}
              className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800/70"
            >
              <Plus className="mr-1 inline h-3 w-3" /> New
            </button>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800/70"
            >
              Collapse
            </button>
          </div>
        )}
      </div>
      {isCollapsed ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-zinc-400">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="rounded-full border border-zinc-800 p-2 hover:bg-zinc-800/70"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-6">
          {!hasDocs ? (
            <div className="px-4 py-6 text-sm text-zinc-500">
              No docs yet. Create your first note.
            </div>
          ) : (
            <div className="py-2">
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
      )}
      {!isCollapsed && (
        <div className="border-t border-zinc-800/70 px-4 py-4 text-xs text-zinc-500">
          Cmd + K for quick navigation
        </div>
      )}
    </aside>
  );
}
