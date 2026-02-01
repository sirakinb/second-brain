"use client";

import { useState } from "react";
import { X, FileText, Folder, Tag } from "lucide-react";

type CreateDocModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: { title: string; folder?: string; tags?: string[] }) => void;
};

export default function CreateDocModal({
  isOpen,
  onClose,
  onCreate,
}: CreateDocModalProps) {
  const [title, setTitle] = useState("");
  const [folder, setFolder] = useState("");
  const [tags, setTags] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    const titleValue = title.trim() || "Untitled";
    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    onCreate({
      title: titleValue,
      folder: folder.trim() || undefined,
      tags: tagList.length ? tagList : undefined,
    });
    setTitle("");
    setFolder("");
    setTags("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-white/[0.06] bg-[#111113] shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.04] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Create Document</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
              <FileText className="h-3.5 w-3.5" />
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#00d4ff]/40 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/10 transition-all"
              placeholder="My new document"
              autoFocus
            />
          </div>

          {/* Folder */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
              <Folder className="h-3.5 w-3.5" />
              Folder
              <span className="text-zinc-600 font-normal">(optional)</span>
            </label>
            <input
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#00d4ff]/40 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/10 transition-all"
              placeholder="projects/2026"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-400 mb-2">
              <Tag className="h-3.5 w-3.5" />
              Tags
              <span className="text-zinc-600 font-normal">(comma separated)</span>
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-[#00d4ff]/40 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/10 transition-all"
              placeholder="research, idea, draft"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/[0.04] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#00d4ff] text-[#0a0a0b] hover:bg-[#00d4ff]/90 transition-colors"
            style={{ boxShadow: "0 0 20px rgba(0, 212, 255, 0.15)" }}
          >
            Create Document
          </button>
        </div>
      </div>
    </div>
  );
}
