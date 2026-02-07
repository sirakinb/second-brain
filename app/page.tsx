"use client";

import Link from "next/link";
import { Activity, Calendar, Search, Brain, Zap } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "Activity Feed",
      description: "Monitor every action Clawdbot takes in real-time. Track tool calls, commands, and token usage.",
      href: "/activity",
      icon: Activity,
      color: "from-[#FF7A5C]/20 to-[#FF7A5C]/5",
      iconColor: "text-[#FF7A5C]",
    },
    {
      title: "Calendar",
      description: "View all scheduled tasks and cron jobs. Weekly view of upcoming autonomous work.",
      href: "/calendar",
      icon: Calendar,
      color: "from-[#FFD166]/20 to-[#FFD166]/5",
      iconColor: "text-[#FFD166]",
    },
    {
      title: "Global Search",
      description: "Search across all memories, documents, and conversations. Find any past context instantly.",
      href: "/search",
      icon: Search,
      color: "from-[#73A9FF]/20 to-[#73A9FF]/5",
      iconColor: "text-[#73A9FF]",
    },
    {
      title: "Knowledge Vault",
      description: "Browse and edit your Second Brain documents, daily journals, and project notes.",
      href: "/vault",
      icon: Brain,
      color: "from-[#06FFA5]/20 to-[#06FFA5]/5",
      iconColor: "text-[#06FFA5]",
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-observatory">
      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none grid-overlay opacity-30" />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[15%] w-[60%] h-[60%] rounded-full bg-[#FF7A5C]/[0.04] blur-[150px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[50%] h-[50%] rounded-full bg-[#FFD166]/[0.03] blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-[#73A9FF]/[0.02] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/[0.04] px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-[#FF7A5C]" />
            <h1 className="text-3xl font-bold text-[#F5F3F0]">
              Mission Control
            </h1>
          </div>
          <p className="mt-2 text-sm text-[#9D9BA8]">
            Central command for Clawdbot autonomous operations
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.05] bg-gradient-to-br from-white/[0.02] to-transparent p-8 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.03] hover:shadow-2xl hover:shadow-black/20"
                >
                  {/* Card glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="mb-4 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-[#F5F3F0]">
                      {feature.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-[#9D9BA8]">
                      {feature.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute right-6 top-6 text-[#6B6977] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#9D9BA8]">
                    →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.04] px-8 py-6">
        <div className="mx-auto max-w-7xl">
          <p className="label-mono text-[#6B6977]">
            Powered by Clawdbot · Built with Next.js + Convex
          </p>
        </div>
      </footer>
    </div>
  );
}
