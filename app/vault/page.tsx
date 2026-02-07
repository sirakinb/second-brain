"use client";

import { useEffect, useMemo, useState } from "react";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import Sidebar from "@/components/sidebar";
import MarkdownViewer from "@/components/markdown-viewer";
import CommandPalette from "@/components/command-palette";
import CreateDocModal from "@/components/create-doc-modal";
import type { DocFrontmatter, DocTreeNode } from "@/lib/types";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

type DocResponse = {
  path: string;
  frontmatter: DocFrontmatter;
  content: string;
  mdxSource: MDXRemoteSerializeResult;
};

function flattenTree(tree: DocTreeNode[]) {
  const files: DocTreeNode[] = [];
  const visit = (nodes: DocTreeNode[]) => {
    for (const node of nodes) {
      if (node.type === "file") {
        files.push(node);
      } else if (node.children) {
        visit(node.children);
      }
    }
  };
  visit(tree);
  return files;
}

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  return slug || "untitled";
}

export default function VaultPage() {
  const [tree, setTree] = useState<DocTreeNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [doc, setDoc] = useState<DocResponse | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fileItems = useMemo(() => flattenTree(tree), [tree]);

  const refreshTree = async () => {
    const response = await fetch("/api/docs/tree");
    const data = await response.json();
    const nextTree = data.tree ?? [];
    setTree(nextTree);
    if (!selectedPath) {
      const firstFile = flattenTree(nextTree)[0];
      if (firstFile) {
        setSelectedPath(firstFile.path);
      }
    }
  };

  const fetchDoc = async (path: string) => {
    setLoadingDoc(true);
    try {
      const response = await fetch(`/api/docs/${encodePath(path)}`);
      if (!response.ok) {
        setDoc(null);
        return;
      }
      const data = (await response.json()) as DocResponse;
      setDoc(data);
    } finally {
      setLoadingDoc(false);
    }
  };

  const handleSelect = (path: string) => {
    setSelectedPath(path);
  };

  const handleCreate = async (params: {
    title: string;
    folder?: string;
    tags?: string[];
  }) => {
    const folder = params.folder?.replace(/\\/g, "/").replace(/^\/+/, "");
    const fileName = `${slugify(params.title)}.md`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    const today = new Date().toISOString().slice(0, 10);

    await fetch("/api/docs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: filePath,
        title: params.title,
        date: today,
        tags: params.tags ?? [],
        content: `# ${params.title}\n\nStart writing your thoughts here.\n`,
      }),
    });

    await refreshTree();
    setSelectedPath(filePath);
  };

  useEffect(() => {
    refreshTree();
  }, []);

  useEffect(() => {
    if (selectedPath) {
      fetchDoc(selectedPath);
    }
  }, [selectedPath]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-observatory">
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none grid-overlay opacity-30" />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-[#06FFA5]/[0.04] blur-[150px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[50%] h-[50%] rounded-full bg-[#FFD166]/[0.03] blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-[#73A9FF]/[0.02] blur-[120px]" />
      </div>

      {/* Sidebar */}
      <Sidebar
        tree={tree}
        selectedPath={selectedPath ?? undefined}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onSelect={handleSelect}
        onCreate={() => setCreateOpen(true)}
      />

      {/* Main Content */}
      <main className="relative flex h-full flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/[0.04] px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#9D9BA8] hover:text-[#F5F3F0] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Mission Control
            </Link>
            <span className="text-[#6B6977]">/</span>
            <span className="label-mono">
              Vault
            </span>
            {selectedPath && (
              <>
                <span className="text-[#6B6977]">/</span>
                <span className="text-[12px] font-medium text-[#9D9BA8]">
                  {selectedPath.split("/").slice(0, -1).join(" / ")}
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="group flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] px-4 py-2 text-sm text-[#9D9BA8] transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-[#F5F3F0]"
          >
            <Search className="h-4 w-4 text-[#6B6977] group-hover:text-[#9D9BA8] transition-colors" />
            <span>Search documents</span>
            <kbd className="ml-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-[#6B6977]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          <MarkdownViewer
            title={selectedPath?.split("/").pop()?.replace(/\.(md|mdx)$/i, "") || "Welcome"}
            frontmatter={doc?.frontmatter}
            mdxSource={doc?.mdxSource}
            path={doc?.path}
            isLoading={loadingDoc}
          />
        </div>
      </main>

      {/* Modals */}
      <CommandPalette
        isOpen={paletteOpen}
        items={fileItems}
        onOpenChange={setPaletteOpen}
        onSelect={handleSelect}
        onCreate={(title) => handleCreate({ title })}
      />
      <CreateDocModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
