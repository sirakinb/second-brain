"use client";

import { useState } from "react";
import { X } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Create new note</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-800 p-1 text-zinc-400 hover:bg-zinc-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 space-y-4">
          <label className="block text-sm text-zinc-400">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/60"
              placeholder="My new idea"
            />
          </label>
          <label className="block text-sm text-zinc-400">
            Folder (optional)
            <input
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/60"
              placeholder="projects/2026"
            />
          </label>
          <label className="block text-sm text-zinc-400">
            Tags (comma separated)
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/60"
              placeholder="research, idea"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
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
            }}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
