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
  const statusTone = enabledJobs.length > 0 ? "text-emerald-400" : "text-zinc-400";

  const columns = [
    {
      id: "scheduled",
      title: "Scheduled",
      description: "Recurring jobs with a queued run",
      jobs: scheduledJobs,
      tone: "border-emerald-400/30",
      accent: "text-emerald-300",
      icon: CheckCircle2,
    },
    {
      id: "one-shot",
      title: "One-shot",
      description: "Auto-deletes after execution",
      jobs: oneShotJobs,
      tone: "border-amber-400/30",
      accent: "text-amber-300",
      icon: Bolt,
    },
    {
      id: "standby",
      title: "Standby",
      description: "Enabled but waiting for a next run",
      jobs: standbyJobs,
      tone: "border-sky-400/30",
      accent: "text-sky-300",
      icon: Layers,
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "Paused from the line",
      jobs: disabledJobs,
      tone: "border-zinc-500/30",
      accent: "text-zinc-400",
      icon: PauseCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070809] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 right-1/4 h-[360px] w-[360px] rounded-full bg-[#00d4ff]/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-emerald-500/[0.05] blur-[160px]" />
        <div className="absolute top-1/3 left-0 h-[320px] w-[320px] rounded-full bg-amber-500/[0.04] blur-[140px]" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/[0.04]">
          <div className="mx-auto max-w-[1700px] px-8 py-6">
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
                    Cron Assembly Line
                  </h1>
                  <p className="mt-1 text-sm text-zinc-500">
                    Live status of scheduled background work
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
                  onClick={() => fetchJobs(true)}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-white/[0.18] hover:text-white"
                >
                  <RefreshCcw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
              <span>Total jobs: {formatNumber(jobs.length)}</span>
              <span>Enabled: {formatNumber(enabledJobs.length)}</span>
              <span>Disabled: {formatNumber(disabledJobs.length)}</span>
              <span>Next run: {formatDateTime(nextRunMs ?? undefined)}</span>
              <span>
                Last updated: {lastUpdated ? formatDateTime(Date.parse(lastUpdated)) : "--"}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1700px] px-8 py-8">
          {error ? (
            <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/5 px-5 py-4 text-sm text-amber-200">
              Unable to load cron jobs: {error}
            </div>
          ) : null}

          <div className="mb-8 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Assembly Line</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Jobs flow through stations based on schedule state
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock className="h-4 w-4 text-zinc-400" />
                {loading ? "Syncing line…" : "Line synced"}
              </div>
            </div>
            <div
              className="mt-6 h-2 w-full rounded-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 12px, rgba(255,255,255,0.03) 12px, rgba(255,255,255,0.03) 24px)",
              }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {columns.map((column) => (
              <section
                key={column.id}
                className={`rounded-2xl border ${column.tone} bg-white/[0.02] p-5`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <column.icon className={`h-4 w-4 ${column.accent}`} />
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                        {column.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-xs text-zinc-500">
                      {column.description}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-xs text-zinc-300">
                    {formatNumber(column.jobs.length)}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {loading ? (
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-zinc-500">
                      Loading jobs...
                    </div>
                  ) : column.jobs.length === 0 ? (
                    <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-3 text-xs text-zinc-500">
                      No jobs here yet.
                    </div>
                  ) : (
                    column.jobs.map((job) => (
                      <div
                        key={job.id}
                        className="rounded-lg border border-white/[0.08] bg-[#0c0d10] px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-zinc-100">
                              {job.name}
                            </div>
                            <div className="mt-1 text-xs text-zinc-500">
                              {job.description ?? "No description"}
                            </div>
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {job.enabled ? "Enabled" : "Disabled"}
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-zinc-400">
                          <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2 py-1">
                            {scheduleLabel(job.schedule)}
                          </span>
                          <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2 py-1">
                            Next: {formatDateTime(job.state?.nextRunAtMs)}
                          </span>
                          {job.schedule?.tz ? (
                            <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2 py-1">
                              TZ: {job.schedule.tz}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-zinc-500">
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
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
