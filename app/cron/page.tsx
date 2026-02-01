"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Bolt,
  CheckCircle2,
  Clock,
  Layers,
  PauseCircle,
  RefreshCcw,
  Zap,
} from "lucide-react";

type CronSchedule = {
  kind?: string;
  expr?: string;
  tz?: string;
};

type CronJob = {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  deleteAfterRun?: boolean;
  createdAtMs?: number;
  updatedAtMs?: number;
  schedule?: CronSchedule;
  sessionTarget?: string;
  wakeMode?: string;
  payload?: {
    kind?: string;
    text?: string;
  };
  state?: {
    nextRunAtMs?: number;
  };
};

type CronResponse = {
  jobs?: CronJob[];
  error?: string;
};

function formatDateTime(ms?: number) {
  if (!ms) return "--";
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function getNextRun(jobs: CronJob[]) {
  const next = jobs
    .map((job) => job.state?.nextRunAtMs)
    .filter((value): value is number => typeof value === "number")
    .sort((a, b) => a - b)[0];
  return next ?? null;
}

function scheduleLabel(schedule?: CronSchedule) {
  if (!schedule) return "No schedule";
  const parts = [schedule.kind, schedule.expr].filter(Boolean);
  return parts.join(" · ") || "Scheduled";
}

const columnConfig = {
  scheduled: {
    color: "#06D6A0",
    bg: "bg-[#06D6A0]/10",
    border: "border-[#06D6A0]/20",
  },
  "one-shot": {
    color: "#FFD166",
    bg: "bg-[#FFD166]/10",
    border: "border-[#FFD166]/20",
  },
  standby: {
    color: "#73A9FF",
    bg: "bg-[#73A9FF]/10",
    border: "border-[#73A9FF]/20",
  },
  disabled: {
    color: "#6B6977",
    bg: "bg-white/[0.02]",
    border: "border-white/[0.06]",
  },
};

export default function CronPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchJobs = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch("/api/cron", { cache: "no-store" });
      const payload = (await response.json()) as CronResponse;
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load cron jobs.");
      }
      setJobs(payload.jobs ?? []);
      setError(payload.error ?? null);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to load jobs.";
      setError(message);
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const enabledJobs = useMemo(() => jobs.filter((job) => job.enabled), [jobs]);
  const disabledJobs = useMemo(() => jobs.filter((job) => !job.enabled), [jobs]);
  const oneShotJobs = useMemo(
    () => enabledJobs.filter((job) => job.deleteAfterRun),
    [enabledJobs],
  );
  const scheduledJobs = useMemo(
    () =>
      enabledJobs.filter(
        (job) => !job.deleteAfterRun && !!job.state?.nextRunAtMs,
      ),
    [enabledJobs],
  );
  const standbyJobs = useMemo(
    () =>
      enabledJobs.filter(
        (job) => !job.deleteAfterRun && !job.state?.nextRunAtMs,
      ),
    [enabledJobs],
  );

  const nextRunMs = useMemo(() => getNextRun(enabledJobs), [enabledJobs]);
  const statusLabel = enabledJobs.length > 0 ? "Live" : "Idle";
  const statusColor = enabledJobs.length > 0 ? "#06D6A0" : "#6B6977";

  const columns = [
    {
      id: "scheduled" as const,
      title: "Scheduled",
      description: "Recurring jobs with a queued run",
      jobs: scheduledJobs,
      icon: CheckCircle2,
    },
    {
      id: "one-shot" as const,
      title: "One-shot",
      description: "Auto-deletes after execution",
      jobs: oneShotJobs,
      icon: Bolt,
    },
    {
      id: "standby" as const,
      title: "Standby",
      description: "Enabled but waiting for a next run",
      jobs: standbyJobs,
      icon: Layers,
    },
    {
      id: "disabled" as const,
      title: "Disabled",
      description: "Paused from the line",
      jobs: disabledJobs,
      icon: PauseCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-observatory text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none grid-overlay opacity-30" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-1/4 h-[420px] w-[420px] rounded-full bg-[#06D6A0]/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[520px] w-[520px] rounded-full bg-[#FFD166]/[0.04] blur-[140px]" />
        <div className="absolute top-1/3 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[#73A9FF]/[0.03] blur-[140px]" />
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
                    Cron Assembly Line
                  </h1>
                  <p className="mt-1 text-sm text-[#6B6977] font-mono">
                    Live status of scheduled background work
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
                  onClick={() => fetchJobs(true)}
                  className="btn-observatory"
                >
                  <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#6B6977] font-mono">
              <span>Total jobs: {formatNumber(jobs.length)}</span>
              <span>•</span>
              <span>Enabled: {formatNumber(enabledJobs.length)}</span>
              <span>•</span>
              <span>Disabled: {formatNumber(disabledJobs.length)}</span>
              <span>•</span>
              <span>Next run: {formatDateTime(nextRunMs ?? undefined)}</span>
              <span>•</span>
              <span>Last updated: {lastUpdated ? formatDateTime(Date.parse(lastUpdated)) : "--"}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] px-8 py-8">
          {error ? (
            <div className="mb-6 rounded-xl border border-[#FFD166]/20 bg-[#FFD166]/5 px-5 py-4 text-sm text-[#FFD166]">
              Unable to load cron jobs: {error}
            </div>
          ) : null}

          {/* Stats row */}
          <div className="grid gap-4 lg:grid-cols-4 mb-8">
            {[
              { label: "Total Jobs", value: jobs.length, icon: Layers, color: "#FF7A5C" },
              { label: "Enabled", value: enabledJobs.length, icon: CheckCircle2, color: "#06D6A0" },
              { label: "Disabled", value: disabledJobs.length, icon: PauseCircle, color: "#6B6977" },
              { label: "Next Run", value: formatDateTime(nextRunMs ?? undefined), icon: Clock, color: "#FFD166" },
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
                <div className="text-2xl font-semibold" style={{ color: stat.color }}>
                  {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Assembly line visual */}
          <div className="card-elevated p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#A78BFA]/10">
                <Zap className="w-4 h-4 text-[#A78BFA]" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-[#F5F3F0]">Assembly Line</h2>
                <p className="text-xs text-[#6B6977] mt-0.5">Jobs flow through stations based on schedule state</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs text-[#6B6977] font-mono">
                <Clock className="h-4 w-4 text-[#9D9BA8]" />
                {loading ? "Syncing line…" : "Line synced"}
              </div>
            </div>
            <div
              className="h-2 w-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #06D6A0 0%, #FFD166 33%, #73A9FF 66%, #6B6977 100%)",
                opacity: 0.3,
              }}
            />
            <div className="flex justify-between mt-3 text-[10px] text-[#6B6977] font-mono uppercase tracking-wider">
              <span>Scheduled</span>
              <span>One-shot</span>
              <span>Standby</span>
              <span>Disabled</span>
            </div>
          </div>

          {/* Job columns */}
          <div className="grid gap-6 lg:grid-cols-4">
            {columns.map((column, colIndex) => {
              const config = columnConfig[column.id];
              return (
                <section
                  key={column.id}
                  className="animate-slide-up opacity-0"
                  style={{ animationDelay: `${(colIndex + 4) * 0.05}s`, animationFillMode: 'forwards' }}
                >
                  <div className="flex items-center gap-3 pb-4 border-b border-white/[0.04] mb-4">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${config.color}15` }}
                    >
                      <column.icon className="w-4 h-4" style={{ color: config.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-[#F5F3F0]">{column.title}</h3>
                      <p className="text-xs text-[#6B6977] mt-0.5">{column.description}</p>
                    </div>
                    <span
                      className="text-xs font-mono px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${config.color}15`, color: config.color }}
                    >
                      {formatNumber(column.jobs.length)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-4 text-sm text-[#6B6977]">
                        Loading jobs...
                      </div>
                    ) : column.jobs.length === 0 ? (
                      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-4 text-sm text-[#6B6977]">
                        No jobs here yet.
                      </div>
                    ) : (
                      column.jobs.map((job) => (
                        <div
                          key={job.id}
                          className={`rounded-xl border ${config.border} ${config.bg} p-4`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-[#F5F3F0]">
                                {job.name}
                              </div>
                              <div className="mt-1 text-xs text-[#6B6977]">
                                {job.description ?? "No description"}
                              </div>
                            </div>
                            <div
                              className="text-[10px] uppercase tracking-wider font-mono"
                              style={{ color: config.color }}
                            >
                              {job.enabled ? "Enabled" : "Disabled"}
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="tag">
                              {scheduleLabel(job.schedule)}
                            </span>
                            <span className="tag">
                              Next: {formatDateTime(job.state?.nextRunAtMs)}
                            </span>
                            {job.schedule?.tz ? (
                              <span className="tag">
                                TZ: {job.schedule.tz}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-[#6B6977] font-mono">
                            <span>ID: {job.id}</span>
                            {job.sessionTarget ? (
                              <span>Session: {job.sessionTarget}</span>
                            ) : null}
                            {job.wakeMode ? <span>Wake: {job.wakeMode}</span> : null}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
