"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import type { DocFrontmatter } from "@/lib/types";
import { Calendar, Tag } from "lucide-react";

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
      <div className="border-b border-white/[0.04] px-12 py-10">
        <div className="max-w-3xl">
          {path && (
            <p className="label-mono mb-4">
              {path.replace(/\\/g, "/")}
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-tight text-white leading-tight">
            {frontmatter?.title || title}
          </h1>
          <div className="flex items-center gap-5 mt-5">
            {frontmatter?.date && (
              <div className="flex items-center gap-2 text-[#6B6977]">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">
                  {new Date(frontmatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
            {frontmatter?.tags?.length ? (
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#6B6977]" />
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-12 py-12 max-w-3xl">
          {isLoading ? (
            <div className="space-y-5 animate-pulse">
              <div className="h-5 w-3/4 rounded-lg bg-white/[0.04]" />
              <div className="h-5 w-1/2 rounded-lg bg-white/[0.04]" />
              <div className="h-5 w-2/3 rounded-lg bg-white/[0.04]" />
              <div className="h-24 w-full rounded-xl bg-white/[0.04] mt-8" />
              <div className="h-5 w-5/6 rounded-lg bg-white/[0.04]" />
              <div className="h-5 w-3/4 rounded-lg bg-white/[0.04]" />
            </div>
          ) : mdxSource ? (
            <article className="markdown animate-fade-in">
              <MDXRemote {...mdxSource} />
            </article>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#6B6977]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg text-[#9D9BA8] mb-2">Select a document to view</p>
              <p className="text-sm text-[#6B6977]">
                Use the sidebar to navigate or press{" "}
                <kbd className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[#9D9BA8] font-mono text-xs">
                  ⌘K
                </kbd>{" "}
                to search
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
