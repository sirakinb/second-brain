"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Clock,
  Flame,
  RefreshCcw,
  Layers,
} from "lucide-react";

type TokentapEntry = {
  id: string;
  timestampIso: string;
  dateKey: string;
  provider: string;
  model: string;
  tokens: number;
  promptPreview: string;
  fileName: string;
};

type TokentapSummary = {
  totalTokens: number;
  totalRequests: number;
  activeDays: number;
  providers: Array<{
    provider: string;
    tokens: number;
    requests: number;
  }>;
  days: Array<{
    date: string;
    tokens: number;
    requests: number;
  }>;
  recent: TokentapEntry[];
  firstSeenIso: string | null;
  lastSeenIso: string | null;
};

type TokentapResponse = {
  promptsDir: string;
  entries: TokentapEntry[];
  summary: TokentapSummary;
  error: string | null;
};

const providerStyles: Record<string, { border: string; bg: string; text: string }> = {
  openai: {
    border: "border-[#00d4ff]/20",
    bg: "bg-[#00d4ff]/10",
    text: "text-[#00d4ff]",
  },
  anthropic: {
    border: "border-[#8b5cf6]/20",
    bg: "bg-[#8b5cf6]/10",
    text: "text-[#8b5cf6]",
  },
  gemini: {
    border: "border-amber-400/20",
    bg: "bg-amber-400/10",
    text: "text-amber-400",
  },
  unknown: {
    border: "border-white/[0.08]",
    bg: "bg-white/[0.04]",
    text: "text-zinc-300",
  },
};

function formatNumber(value: number) {
  return value.toLocaleString();
}

function formatDateTime(value: string | null) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDayLabel(dayKey: string) {
  const date = new Date(`${dayKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dayKey;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
  });
}

function getProviderStyle(provider: string) {
  return providerStyles[provider] ?? providerStyles.unknown;
}

export default function UsagePage() {
  const [data, setData] = useState<TokentapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const response = await fetch("/api/usage/tokentap", { cache: "no-store" });
      const payload = (await response.json()) as TokentapResponse;
      setData(payload);
      setError(payload.error);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load data.";
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summary = data?.summary;
  const isEmpty = !summary || summary.totalRequests === 0;
  const recent = summary?.recent ?? [];
  const days = summary?.days ?? [];
  const providers = summary?.providers ?? [];
  const dayMax = useMemo(
    () => Math.max(0, ...days.map((day) => day.tokens)),
    [days],
  );

  const statusLabel = summary?.lastSeenIso ? "Capturing" : "Idle";
  const statusTone = summary?.lastSeenIso ? "text-emerald-400" : "text-zinc-400";

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-1/4 h-[420px] w-[420px] rounded-full bg-[#00d4ff]/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[520px] w-[520px] rounded-full bg-[#8b5cf6]/[0.04] blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-emerald-500/[0.03] blur-[140px]" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/[0.04]">
          <div className="mx-auto max-w-[1600px] px-8 py-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">Back</span>
                </Link>
                <div className="h-6 w-px bg-white/[0.06]" />
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Token Usage History
                  </h1>
                  <p className="text-sm text-zinc-500 mt-1">
                    Historical capture from tokentap
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2">
                  <Activity className={`h-4 w-4 ${statusTone}`} />
                  <span className={`text-sm ${statusTone}`}>{statusLabel}</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchData(true)}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-white/[0.18] hover:text-white"
                >
                  <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <span>Prompts dir: {data?.promptsDir ?? "~/.tokentap/prompts"}</span>
              <span>Last updated: {formatDateTime(lastUpdated)}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-8 py-8">
          {error ? (
            <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/5 px-5 py-4 text-sm text-amber-200">
              {error.includes("no such file") || error.includes("ENOENT") ? (
                <div>
                  No tokentap history found yet. Start tokentap, run your tool
                  through it, then refresh.
                </div>
              ) : (
                <div>Unable to read tokentap data: {error}</div>
              )}
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-4">
            {[
              {
                label: "Total Tokens",
                value: summary ? formatNumber(summary.totalTokens) : "--",
                icon: Flame,
                accent: "text-[#00d4ff]",
              },
              {
                label: "Requests",
                value: summary ? formatNumber(summary.totalRequests) : "--",
                icon: Layers,
                accent: "text-emerald-400",
              },
              {
                label: "Active Days",
                value: summary ? formatNumber(summary.activeDays) : "--",
                icon: BarChart3,
                accent: "text-violet-400",
              },
              {
                label: "Last Seen",
                value: formatDateTime(summary?.lastSeenIso ?? null),
                icon: Clock,
                accent: "text-amber-300",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.15em] text-zinc-500">
                    {stat.label}
                  </span>
                  <stat.icon className={`h-4 w-4 ${stat.accent}`} />
                </div>
                <div className="mt-3 text-2xl font-semibold">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Provider Breakdown</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Tokens and requests by provider
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {providers.length === 0 ? (
                  <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 text-sm text-zinc-500">
                    No provider data yet.
                  </div>
                ) : (
                  providers.map((provider) => {
                    const style = getProviderStyle(provider.provider);
                    return (
                      <div
                        key={provider.provider}
                        className={`rounded-lg border ${style.border} ${style.bg} p-4`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold capitalize">
                            {provider.provider}
                          </div>
                          <div className={`text-xs ${style.text}`}>
                            {formatNumber(provider.tokens)} tokens
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-zinc-400">
                          {formatNumber(provider.requests)} requests
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Daily Usage</h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Last {Math.min(14, days.length)} days
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {days.length === 0 ? (
                  <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 text-sm text-zinc-500">
                    No daily usage data yet.
                  </div>
                ) : (
                  days.slice(0, 14).map((day) => {
                    const width = dayMax ? Math.round((day.tokens / dayMax) * 100) : 0;
                    return (
                      <div key={day.date} className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-zinc-400">
                          <span>{formatDayLabel(day.date)}</span>
                          <span>
                            {formatNumber(day.tokens)} tokens • {formatNumber(day.requests)} req
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#8b5cf6]"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Recent Prompts</h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Latest {recent.length} captured requests
                </p>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.06]">
              <div className="grid grid-cols-[160px_100px_1fr_120px] gap-4 border-b border-white/[0.06] bg-white/[0.04] px-4 py-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
                <span>Timestamp</span>
                <span>Provider</span>
                <span>Prompt</span>
                <span className="text-right">Tokens</span>
              </div>
              {loading ? (
                <div className="px-4 py-6 text-sm text-zinc-500">Loading...</div>
              ) : isEmpty ? (
                <div className="px-4 py-6 text-sm text-zinc-500">
                  No prompts captured yet.
                </div>
              ) : (
                recent.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-[160px_100px_1fr_120px] gap-4 border-b border-white/[0.04] px-4 py-4 text-sm text-zinc-300 last:border-b-0"
                  >
                    <div className="text-xs text-zinc-500">
                      {formatDateTime(entry.timestampIso)}
                      <div className="mt-1 text-[10px] text-zinc-600">
                        {entry.model}
                      </div>
                    </div>
                    <div className="text-xs capitalize text-zinc-400">
                      {entry.provider}
                    </div>
                    <div className="text-sm text-zinc-200">
                      {entry.promptPreview || "No preview available."}
                    </div>
                    <div className="text-right text-xs text-zinc-400">
                      {formatNumber(entry.tokens)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
