"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Search, FileText, Brain, MessageSquare, Clock } from "lucide-react";

type SearchResult = {
  id: string;
  type: "memory" | "document" | "conversation" | "task";
  title: string;
  snippet: string;
  path?: string;
  timestamp?: number;
  score: number;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "memory":
        return Brain;
      case "document":
        return FileText;
      case "conversation":
        return MessageSquare;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "memory":
        return "text-[#73A9FF]";
      case "document":
        return "text-[#06FFA5]";
      case "conversation":
        return "text-[#FFD166]";
      default:
        return "text-[#9D9BA8]";
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredResults = filter === "all"
    ? results
    : results.filter(r => r.type === filter);

  return (
    <div className="flex min-h-screen w-full flex-col bg-observatory">
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none grid-overlay opacity-30" />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-[#73A9FF]/[0.04] blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/[0.04] px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#9D9BA8] hover:text-[#F5F3F0] transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Mission Control
          </Link>
          <div className="flex items-center gap-3">
            <Search className="h-8 w-8 text-[#73A9FF]" />
            <h1 className="text-3xl font-bold text-[#F5F3F0]">Global Search</h1>
          </div>
          <p className="mt-2 text-sm text-[#9D9BA8]">
            Search across all memories, documents, and conversations
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative border-b border-white/[0.04] px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B6977]" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search for anything..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-12 pr-4 py-4 text-[#F5F3F0] placeholder-[#6B6977] focus:border-[#73A9FF]/30 focus:outline-none focus:ring-2 focus:ring-[#73A9FF]/20"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      {results.length > 0 && (
        <div className="relative border-b border-white/[0.04] px-8 py-4">
          <div className="mx-auto max-w-7xl">
            <div className="flex gap-2">
              {["all", "memory", "document", "conversation", "task"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f
                      ? "bg-white/[0.08] text-[#F5F3F0] border border-white/[0.1]"
                      : "text-[#9D9BA8] hover:text-[#F5F3F0] hover:bg-white/[0.04]"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <main className="relative flex-1 px-8 py-8">
        <div className="mx-auto max-w-7xl">
          {searching ? (
            <div className="text-center py-16">
              <div className="animate-spin h-8 w-8 border-2 border-[#73A9FF]/30 border-t-[#73A9FF] rounded-full mx-auto mb-4" />
              <p className="text-[#9D9BA8]">Searching...</p>
            </div>
          ) : results.length === 0 && query ? (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-[#6B6977] mx-auto mb-4" />
              <p className="text-[#9D9BA8]">No results found for "{query}"</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <Brain className="h-12 w-12 text-[#6B6977] mx-auto mb-4" />
              <p className="text-[#9D9BA8]">Start typing to search</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#9D9BA8] mb-6">
                {filteredResults.length} result{filteredResults.length === 1 ? '' : 's'}
              </p>
              <div className="space-y-4">
                {filteredResults.map((result) => {
                  const Icon = getIcon(result.type);
                  return (
                    <div
                      key={result.id}
                      className="group rounded-xl border border-white/[0.05] bg-white/[0.02] p-6 hover:border-white/[0.1] hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2">
                          <Icon className={`h-5 w-5 ${getTypeColor(result.type)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-[#F5F3F0]">
                              {result.title}
                            </h3>
                            <span className={`text-xs font-medium ${getTypeColor(result.type)}`}>
                              {result.type}
                            </span>
                          </div>
                          <p className="text-sm text-[#9D9BA8] mb-3 line-clamp-2">
                            {result.snippet}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[#6B6977]">
                            {result.path && <span>{result.path}</span>}
                            {result.timestamp && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(result.timestamp)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
