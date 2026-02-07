"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Activity, Zap, FileText, Terminal, Clock } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ActivityFeedPage() {
  const activities = useQuery(api.activities.list, { limit: 50 });
  const [filter, setFilter] = useState<string>("all");

  const getIcon = (type: string) => {
    switch (type) {
      case "tool":
        return Zap;
      case "exec":
        return Terminal;
      case "file":
        return FileText;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-[#06FFA5]";
      case "error":
        return "text-[#FF7A5C]";
      default:
        return "text-[#FFD166]";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredActivities = filter === "all" 
    ? activities 
    : activities?.filter(a => a.type === filter);

  return (
    <div className="flex min-h-screen w-full flex-col bg-observatory">
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none grid-overlay opacity-30" />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-[#FF7A5C]/[0.04] blur-[150px]" />
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
            <Activity className="h-8 w-8 text-[#FF7A5C]" />
            <h1 className="text-3xl font-bold text-[#F5F3F0]">Activity Feed</h1>
          </div>
          <p className="mt-2 text-sm text-[#9D9BA8]">
            Every action Clawdbot takes, in real-time
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="relative border-b border-white/[0.04] px-8 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-2">
            {["all", "tool", "exec", "file", "api"].map((f) => (
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

      {/* Activity List */}
      <main className="relative flex-1 px-8 py-8">
        <div className="mx-auto max-w-7xl">
          {!activities ? (
            <div className="text-center py-16">
              <div className="animate-spin h-8 w-8 border-2 border-[#FF7A5C]/30 border-t-[#FF7A5C] rounded-full mx-auto mb-4" />
              <p className="text-[#9D9BA8]">Loading activities...</p>
            </div>
          ) : filteredActivities?.length === 0 ? (
            <div className="text-center py-16">
              <Activity className="h-12 w-12 text-[#6B6977] mx-auto mb-4" />
              <p className="text-[#9D9BA8]">No activities yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities?.map((activity) => {
                const Icon = getIcon(activity.type);
                return (
                  <div
                    key={activity._id}
                    className="group relative overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.02] p-6 transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg border border-white/[0.08] bg-white/[0.03] p-2">
                        <Icon className="h-5 w-5 text-[#FF7A5C]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-[#F5F3F0]">
                            {activity.action}
                          </h3>
                          <span className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#9D9BA8] mb-3">
                          {activity.details}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[#6B6977]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(activity.timestamp)}
                          </span>
                          {activity.tokens && (
                            <span>
                              {activity.tokens.toLocaleString()} tokens
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
