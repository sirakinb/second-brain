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
      <div className="border-b border-zinc-800/70 px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {path ? path.replace(/\\/g, "/") : "Second Brain"}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-zinc-100">
              {frontmatter?.title || title}
            </h1>
          </div>
          {frontmatter?.date && (
            <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
              {frontmatter.date}
            </span>
          )}
        </div>
        {frontmatter?.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-800/70 px-3 py-1 text-xs text-zinc-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {isLoading ? (
          <div className="space-y-4 animate-in fade-in">
            <div className="h-4 w-2/3 rounded bg-zinc-800/60" />
            <div className="h-4 w-1/2 rounded bg-zinc-800/60" />
            <div className="h-4 w-3/4 rounded bg-zinc-800/60" />
          </div>
        ) : mdxSource ? (
          <article className="markdown animate-in fade-in duration-500">
            <MDXRemote {...mdxSource} />
          </article>
        ) : (
          <div className="text-zinc-400">Pick a document to get started.</div>
        )}
      </div>
    </section>
  );
}
