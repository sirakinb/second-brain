"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar as CalendarIcon, Clock, Trash2 } from "lucide-react";

type CronJob = {
  id: string;
  schedule: string;
  text: string;
  nextRun?: number;
  enabled: boolean;
};

export default function CalendarPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    fetchCronJobs();
  }, []);

  const fetchCronJobs = async () => {
    try {
      const response = await fetch("/api/cron/list");
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch cron jobs:", error);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Delete this scheduled task?")) return;
    
    try {
      await fetch(`/api/cron/${jobId}`, { method: "DELETE" });
      await fetchCronJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  const formatNextRun = (timestamp?: number) => {
    if (!timestamp) return "Not scheduled";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = timestamp - now.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (diff < 0) return "Overdue";
    if (hours < 1) return `${Math.floor(diff / 60000)}m`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString();
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className="flex min-h-screen w-full flex-col bg-observatory">
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none grid-overlay opacity-30" />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-[#FFD166]/[0.04] blur-[150px]" />
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
            <CalendarIcon className="h-8 w-8 text-[#FFD166]" />
            <h1 className="text-3xl font-bold text-[#F5F3F0]">Calendar</h1>
          </div>
          <p className="mt-2 text-sm text-[#9D9BA8]">
            Scheduled tasks and autonomous work
          </p>
        </div>
      </header>

      {/* Week Navigation */}
      <div className="relative border-b border-white/[0.04] px-8 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                const prev = new Date(currentWeek);
                prev.setDate(prev.getDate() - 7);
                setCurrentWeek(prev);
              }}
              className="px-4 py-2 text-sm text-[#9D9BA8] hover:text-[#F5F3F0] transition-colors"
            >
              ← Previous Week
            </button>
            <h2 className="text-lg font-semibold text-[#F5F3F0]">
              {weekDays[0].toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <button
              onClick={() => {
                const next = new Date(currentWeek);
                next.setDate(next.getDate() + 7);
                setCurrentWeek(next);
              }}
              className="px-4 py-2 text-sm text-[#9D9BA8] hover:text-[#F5F3F0] transition-colors"
            >
              Next Week →
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <main className="relative flex-1 px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, i) => {
              const isToday = new Date().toDateString() === day.toDateString();
              return (
                <div
                  key={i}
                  className={`rounded-xl border ${
                    isToday
                      ? "border-[#FFD166]/30 bg-[#FFD166]/5"
                      : "border-white/[0.05] bg-white/[0.02]"
                  } p-4`}
                >
                  <div className="mb-4 text-center">
                    <div className="text-xs text-[#6B6977] mb-1">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className={`text-2xl font-bold ${
                      isToday ? "text-[#FFD166]" : "text-[#F5F3F0]"
                    }`}>
                      {day.getDate()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {jobs
                      .filter((job) => job.enabled)
                      .map((job) => (
                        <div
                          key={job.id}
                          className="group rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-[#F5F3F0] font-medium truncate mb-1">
                                {job.text.split('\n')[0]}
                              </p>
                              <div className="flex items-center gap-1 text-[#6B6977]">
                                <Clock className="h-3 w-3" />
                                <span>{formatNextRun(job.nextRun)}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteJob(job.id)}
                              className="opacity-0 group-hover:opacity-100 text-[#FF7A5C] hover:text-[#FF7A5C]/80 transition-all"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Jobs List */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-[#F5F3F0] mb-4">All Scheduled Tasks</h2>
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#F5F3F0] mb-2">
                        {job.text.split('\n')[0]}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#9D9BA8]">
                        <span>Schedule: {job.schedule}</span>
                        <span>Next: {formatNextRun(job.nextRun)}</span>
                        <span className={job.enabled ? "text-[#06FFA5]" : "text-[#6B6977]"}>
                          {job.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="text-[#FF7A5C] hover:text-[#FF7A5C]/80 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
