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
        className="absolute inset-0 bg-[#0C0B0E]/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.06] bg-[#16141A] shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.04] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FF7A5C]/10">
              <FileText className="w-4 h-4 text-[#FF7A5C]" />
            </div>
            <h2 className="text-lg font-semibold text-white">Create Document</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#6B6977] hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#9D9BA8] mb-2">
              <FileText className="h-3.5 w-3.5" />
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="input-observatory"
              placeholder="My new document"
              autoFocus
            />
          </div>

          {/* Folder */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#9D9BA8] mb-2">
              <Folder className="h-3.5 w-3.5" />
              Folder
              <span className="text-[#6B6977] font-normal">(optional)</span>
            </label>
            <input
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="input-observatory"
              placeholder="projects/2026"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#9D9BA8] mb-2">
              <Tag className="h-3.5 w-3.5" />
              Tags
              <span className="text-[#6B6977] font-normal">(comma separated)</span>
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input-observatory"
              placeholder="research, idea, draft"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/[0.04] px-6 py-4 bg-white/[0.01]">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary"
          >
            Create Document
          </button>
        </div>
      </div>
    </div>
  );
}
