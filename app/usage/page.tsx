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
  Zap
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

const providerStyles: Record<string, { color: string; bg: string; border: string }> = {
  openai: {
    color: "#06D6A0",
    bg: "bg-[#06D6A0]/10",
    border: "border-[#06D6A0]/20",
  },
  anthropic: {
    color: "#FF7A5C",
    bg: "bg-[#FF7A5C]/10",
    border: "border-[#FF7A5C]/20",
  },
  gemini: {
    color: "#FFD166",
    bg: "bg-[#FFD166]/10",
    border: "border-[#FFD166]/20",
  },
  unknown: {
    color: "#9D9BA8",
    bg: "bg-white/[0.04]",
    border: "border-white/[0.08]",
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
  const statusColor = summary?.lastSeenIso ? "#06D6A0" : "#6B6977";

  return (
    <div className="min-h-screen bg-observatory text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none grid-overlay opacity-30" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-1/4 h-[420px] w-[420px] rounded-full bg-[#FF7A5C]/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[520px] w-[520px] rounded-full bg-[#A78BFA]/[0.04] blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[#06D6A0]/[0.03] blur-[140px]" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/[0.04]">
          <div className="mx-auto max-w-[1600px] px-8 py-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-[#9D9BA8] transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm">Back</span>
                </Link>
                <div className="h-6 w-px bg-white/[0.06]" />
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Token Usage
                  </h1>
                  <p className="text-sm text-[#6B6977] mt-1 font-mono">
                    Historical capture from tokentap
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-2">
                  <div className="w-2 h-2 rounded-full status-beacon" style={{ background: statusColor }} />
                  <span className="text-sm" style={{ color: statusColor }}>{statusLabel}</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchData(true)}
                  className="btn-observatory"
                >
                  <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#6B6977] font-mono">
              <span>Prompts dir: {data?.promptsDir ?? "~/.tokentap/prompts"}</span>
              <span>•</span>
              <span>Last updated: {formatDateTime(lastUpdated)}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-8 py-8">
          {error ? (
            <div className="mb-6 rounded-xl border border-[#FFD166]/20 bg-[#FFD166]/5 px-5 py-4 text-sm text-[#FFD166]">
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
                color: "#FF7A5C",
              },
              {
                label: "Requests",
                value: summary ? formatNumber(summary.totalRequests) : "--",
                icon: Layers,
                color: "#06D6A0",
              },
              {
                label: "Active Days",
                value: summary ? formatNumber(summary.activeDays) : "--",
                icon: BarChart3,
                color: "#A78BFA",
              },
              {
                label: "Last Seen",
                value: formatDateTime(summary?.lastSeenIso ?? null),
                icon: Clock,
                color: "#FFD166",
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="card-observatory p-5 animate-slide-up opacity-0"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="label-mono">{stat.label}</span>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-2xl font-semibold" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#FF7A5C]/10">
                  <Zap className="w-4 h-4 text-[#FF7A5C]" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-[#F5F3F0]">Provider Breakdown</h2>
                  <p className="text-xs text-[#6B6977] mt-0.5">Tokens and requests by provider</p>
                </div>
              </div>
              <div className="space-y-3">
                {providers.length === 0 ? (
                  <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 text-sm text-[#6B6977]">
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
                          <div className="text-sm font-semibold capitalize" style={{ color: style.color }}>
                            {provider.provider}
                          </div>
                          <div className="text-xs font-mono" style={{ color: style.color }}>
                            {formatNumber(provider.tokens)} tokens
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-[#6B6977] font-mono">
                          {formatNumber(provider.requests)} requests
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="card-elevated p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#73A9FF]/10">
                  <BarChart3 className="w-4 h-4 text-[#73A9FF]" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-[#F5F3F0]">Daily Usage</h2>
                  <p className="text-xs text-[#6B6977] mt-0.5">Last {Math.min(14, days.length)} days</p>
                </div>
              </div>
              <div className="space-y-3">
                {days.length === 0 ? (
                  <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 text-sm text-[#6B6977]">
                    No daily usage data yet.
                  </div>
                ) : (
                  days.slice(0, 14).map((day) => {
                    const width = dayMax ? Math.round((day.tokens / dayMax) * 100) : 0;
                    return (
                      <div key={day.date} className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-[#6B6977] font-mono">
                          <span>{formatDayLabel(day.date)}</span>
                          <span>
                            {formatNumber(day.tokens)} tokens • {formatNumber(day.requests)} req
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#FF7A5C] to-[#FFD166]"
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

          <section className="mt-8 card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#A78BFA]/10">
                <Activity className="w-4 h-4 text-[#A78BFA]" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-[#F5F3F0]">Recent Prompts</h2>
                <p className="text-xs text-[#6B6977] mt-0.5">Latest {recent.length} captured requests</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/[0.06]">
              <div className="grid grid-cols-[160px_100px_1fr_120px] gap-4 border-b border-white/[0.06] bg-white/[0.04] px-4 py-3">
                <span className="label-mono">Timestamp</span>
                <span className="label-mono">Provider</span>
                <span className="label-mono">Prompt</span>
                <span className="label-mono text-right">Tokens</span>
              </div>
              {loading ? (
                <div className="px-4 py-6 text-sm text-[#6B6977]">Loading...</div>
              ) : isEmpty ? (
                <div className="px-4 py-6 text-sm text-[#6B6977]">
                  No prompts captured yet.
                </div>
              ) : (
                recent.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid grid-cols-[160px_100px_1fr_120px] gap-4 border-b border-white/[0.04] px-4 py-4 text-sm text-[#B8B5C4] last:border-b-0"
                  >
                    <div className="text-xs text-[#6B6977] font-mono">
                      {formatDateTime(entry.timestampIso)}
                      <div className="mt-1 text-[10px] text-[#6B6977]/70">
                        {entry.model}
                      </div>
                    </div>
                    <div className="text-xs capitalize" style={{ color: getProviderStyle(entry.provider).color }}>
                      {entry.provider}
                    </div>
                    <div className="text-sm text-[#9D9BA8]">
                      {entry.promptPreview || "No preview available."}
                    </div>
                    <div className="text-right text-xs text-[#6B6977] font-mono">
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
