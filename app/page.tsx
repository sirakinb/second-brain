"use client";

import { useEffect, useMemo, useState } from "react";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import Sidebar from "@/components/sidebar";
import MarkdownViewer from "@/components/markdown-viewer";
import CommandPalette from "@/components/command-palette";
import CreateDocModal from "@/components/create-doc-modal";
import type { DocFrontmatter, DocTreeNode } from "@/lib/types";

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

export default function HomePage() {
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
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar
        tree={tree}
        selectedPath={selectedPath ?? undefined}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onSelect={handleSelect}
        onCreate={() => setCreateOpen(true)}
      />
      <main className="relative flex h-full flex-1 flex-col bg-[radial-gradient(circle_at_top,_rgba(63,63,70,0.15),_rgba(9,9,11,0.9))]">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(120deg,_rgba(24,24,27,0.8)_0%,_rgba(9,9,11,0.9)_60%)]" />
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800/70 px-6 py-4 text-xs uppercase tracking-[0.3em] text-zinc-500">
            <span>Vault</span>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="rounded-full border border-zinc-800 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-zinc-300 hover:bg-zinc-900"
            >
              Command Palette
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <MarkdownViewer
              title={selectedPath?.split("/").pop()?.replace(/\.(md|mdx)$/i, "") || "Welcome"}
              frontmatter={doc?.frontmatter}
              mdxSource={doc?.mdxSource}
              path={doc?.path}
              isLoading={loadingDoc}
            />
          </div>
        </div>
      </main>
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
