"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import type { DocFrontmatter } from "@/lib/types";

type MarkdownViewerProps = {
  title: string;
  frontmatter?: DocFrontmatter;
  mdxSource?: MDXRemoteSerializeResult;
  path?: string;
  isLoading?: boolean;
};

export default function MarkdownViewer({
  title,
  frontmatter,
  mdxSource,
  path,
  isLoading,
}: MarkdownViewerProps) {
  return (
    <section className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-white/[0.04] px-10 py-8">
        <div className="max-w-3xl">
          {path && (
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 mb-3">
              {path.replace(/\\/g, "/")}
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {frontmatter?.title || title}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            {frontmatter?.date && (
              <span className="text-xs text-zinc-500">
                {new Date(frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
            {frontmatter?.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[11px] text-zinc-400 border border-white/[0.04]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-10 py-10 max-w-3xl">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-3/4 rounded bg-white/[0.04]" />
              <div className="h-4 w-1/2 rounded bg-white/[0.04]" />
              <div className="h-4 w-2/3 rounded bg-white/[0.04]" />
              <div className="h-20 w-full rounded bg-white/[0.04] mt-6" />
              <div className="h-4 w-5/6 rounded bg-white/[0.04]" />
              <div className="h-4 w-3/4 rounded bg-white/[0.04]" />
            </div>
          ) : mdxSource ? (
            <article className="markdown animate-fade-in">
              <MDXRemote {...mdxSource} />
            </article>
          ) : (
            <div className="text-zinc-500">
              <p className="text-lg">Select a document to view its contents.</p>
              <p className="mt-2 text-sm text-zinc-600">
                Use the sidebar to navigate or press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] text-zinc-400 text-xs font-mono">⌘K</kbd> to search.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
