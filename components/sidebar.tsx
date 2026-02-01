"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Clock, FileText, Folder, FolderOpen, Plus, PanelLeftClose, PanelLeft, Layers, Settings, LayoutGrid, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const padding = 16 + depth * 14;

  if (isDir) {
    return (
      <div>
        <button
          type="button"
          onClick={() => onToggle(node.path)}
          className="group flex w-full items-center gap-2.5 py-2 text-left text-[13px] text-[#9D9BA8] hover:text-[#F5F3F0] hover:bg-white/[0.03] rounded-lg transition-all duration-150"
          style={{ paddingLeft: padding, paddingRight: 12 }}
        >
          <ChevronRight
            className={cn(
              "h-3 w-3 text-[#6B6977] transition-transform duration-200",
              isCollapsed ? "" : "rotate-90",
            )}
          />
          {isCollapsed ? (
            <Folder className="h-4 w-4 text-[#6B6977]" />
          ) : (
            <FolderOpen className="h-4 w-4 text-[#FF7A5C]/70" />
          )}
          <span className="truncate font-medium">{node.name}</span>
        </button>
        {!isCollapsed && node.children?.length ? (
          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-2 w-px bg-white/[0.04]" />
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
        "group flex w-full items-center gap-2.5 py-2 text-left text-[13px] transition-all duration-150 rounded-lg",
        isActive
          ? "bg-[#FF7A5C]/10 text-[#FF7A5C]"
          : "text-[#9D9BA8] hover:text-[#F5F3F0] hover:bg-white/[0.03]",
      )}
      style={{ paddingLeft: padding + 18, paddingRight: 12 }}
    >
      <FileText className={cn("h-4 w-4 transition-colors", isActive ? "text-[#FF7A5C]" : "text-[#6B6977] group-hover:text-[#9D9BA8]")} />
      <span className="truncate">{node.name.replace(/\.(md|mdx)$/i, "")}</span>
    </button>
  );
}

const navItems = [
  { href: "/architecture", label: "Architecture", icon: Layers },
  { href: "/projects", label: "Projects", icon: LayoutGrid },
  { href: "/config", label: "Config", icon: Settings },
  { href: "/cron", label: "Cron Jobs", icon: Clock },
  { href: "/usage", label: "Usage", icon: Zap },
];

export default function Sidebar({
  tree,
  selectedPath,
  isCollapsed,
  onToggleCollapse,
  onSelect,
  onCreate,
}: SidebarProps) {
  const [collapsedDirs, setCollapsedDirs] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const hasDocs = useMemo(() => tree.length > 0, [tree]);

  const toggleDir = (path: string) => {
    setCollapsedDirs((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r border-white/[0.04] bg-[#0F0E14] transition-all duration-300",
        isCollapsed ? "w-16" : "w-72",
      )}
    >
      {/* Logo & Brand */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-2.5 w-2.5 rounded-full bg-[#FF7A5C] status-beacon status-active" style={{ background: '#FF7A5C' }} />
          </div>
          {!isCollapsed && (
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Second Brain
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-[#6B6977] hover:text-[#F5F3F0] hover:bg-white/[0.04] transition-all duration-150"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {isCollapsed ? (
        <div className="flex flex-1 flex-col items-center py-5 gap-4">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2.5 rounded-lg text-[#6B6977] hover:text-[#F5F3F0] hover:bg-white/[0.04] transition-all duration-150"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          {/* New button */}
          <div className="px-4 py-4">
            <button
              type="button"
              onClick={onCreate}
              className="btn-primary w-full"
            >
              <Plus className="h-4 w-4" />
              <span>New Document</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="px-4 py-3">
            <div className="label-mono px-2 mb-3">
              Navigate
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-all duration-150",
                      isActive
                        ? "bg-[#FF7A5C]/10 text-[#FF7A5C]"
                        : "text-[#9D9BA8] hover:text-[#F5F3F0] hover:bg-white/[0.03]"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-[#FF7A5C]" : "text-[#6B6977]")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Divider */}
          <div className="mx-4 divider-fade" />

          {/* Documents */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="label-mono px-2 mb-3">
              Documents
            </div>
            {!hasDocs ? (
              <div className="px-3 py-6 text-sm text-[#6B6977] text-center">
                <FileText className="w-8 h-8 mx-auto mb-3 text-[#6B6977]/50" />
                <p>No documents yet</p>
                <p className="text-xs mt-1 text-[#6B6977]/70">Create your first document above</p>
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
          <div className="border-t border-white/[0.04] px-5 py-4">
            <div className="flex items-center justify-between text-[11px] text-[#6B6977]">
              <span className="font-mono">Press</span>
              <kbd className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[#9D9BA8] font-mono text-[10px]">
                ⌘K
              </kbd>
              <span className="font-mono">to search</span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
