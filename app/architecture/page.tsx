"use client";

import { useState, useEffect } from "react";
import {
  Cpu,
  Brain,
  MessageCircle,
  FolderOpen,
  Database,
  Globe,
  Clock,
  Zap,
  Network,
  FileText,
  Server,
  Activity,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface SystemNode {
  id: string;
  name: string;
  description: string;
  status: "active" | "idle" | "connected";
  path?: string;
  icon: React.ReactNode;
  connections: string[];
}

const systemNodes: SystemNode[] = [
  {
    id: "kimi",
    name: "Kimi K2.5",
    description: "Moonshot AI model - the core reasoning engine (me!)",
    status: "active",
    path: "moonshot.cn/kimi-k2.5",
    icon: <Brain className="w-4 h-4" />,
    connections: ["gateway", "tools", "memory"]
  },
  {
    id: "soul",
    name: "SOUL.md",
    description: "Core personality, values, and behavioral principles",
    status: "active",
    path: "/clawd/SOUL.md",
    icon: <Brain className="w-4 h-4" />,
    connections: ["identity", "memory"]
  },
  {
    id: "identity",
    name: "IDENTITY.md",
    description: "Name, role, emoji, public persona",
    status: "active",
    path: "/clawd/IDENTITY.md",
    icon: <FileText className="w-4 h-4" />,
    connections: ["soul", "user"]
  },
  {
    id: "user",
    name: "USER.md",
    description: "Aki's profile and communication preferences",
    status: "active",
    path: "/clawd/USER.md",
    icon: <FileText className="w-4 h-4" />,
    connections: ["identity", "telegram"]
  },
  {
    id: "memory",
    name: "MEMORY.md",
    description: "Long-term curated memories and learnings",
    status: "active",
    path: "/clawd/MEMORY.md",
    icon: <Database className="w-4 h-4" />,
    connections: ["soul", "daily-memory"]
  },
  {
    id: "daily-memory",
    name: "Daily Memory",
    description: "Raw daily logs (memory/YYYY-MM-DD.md)",
    status: "active",
    path: "/clawd/memory/",
    icon: <Clock className="w-4 h-4" />,
    connections: ["memory", "second-brain"]
  },
  {
    id: "telegram",
    name: "Telegram Gateway",
    description: "Primary communication channel with Aki",
    status: "connected",
    path: "@sirakinb (id: 1360341449)",
    icon: <MessageCircle className="w-4 h-4" />,
    connections: ["user", "gateway"]
  },
  {
    id: "gateway",
    name: "Clawdbot Gateway",
    description: "Central routing and session management",
    status: "active",
    path: "http://127.0.0.1:18791",
    icon: <Server className="w-4 h-4" />,
    connections: ["telegram", "tools"]
  },
  {
    id: "tools",
    name: "Tool Orchestrator",
    description: "Routes commands to appropriate skills",
    status: "active",
    path: "/opt/homebrew/lib/node_modules/clawdbot/skills/",
    icon: <Cpu className="w-4 h-4" />,
    connections: ["gateway", "browser-use", "exa", "alpaca"]
  },
  {
    id: "browser-use",
    name: "Browser-Use",
    description: "Advanced browser automation (anti-bot, parallel)",
    status: "active",
    path: "~/.claude/skills/browser-use/",
    icon: <Globe className="w-4 h-4" />,
    connections: ["tools", "external-apis"]
  },
  {
    id: "exa",
    name: "Exa MCP",
    description: "Semantic web search (Reddit, X, News)",
    status: "active",
    path: "mcp.exa.ai",
    icon: <Network className="w-4 h-4" />,
    connections: ["tools", "external-apis"]
  },
  {
    id: "alpaca",
    name: "Alpaca API",
    description: "Trading automation platform",
    status: "idle",
    path: "alpaca.markets",
    icon: <Activity className="w-4 h-4" />,
    connections: ["tools", "external-apis"]
  },
  {
    id: "external-apis",
    name: "External APIs",
    description: "GitHub, Gmail, Calendar, Twitter",
    status: "active",
    icon: <Zap className="w-4 h-4" />,
    connections: ["browser-use", "exa", "alpaca"]
  },
  {
    id: "second-brain",
    name: "Second Brain",
    description: "Knowledge storage and retrieval system",
    status: "active",
    path: "/clawd/second-brain-docs/",
    icon: <FolderOpen className="w-4 h-4" />,
    connections: ["daily-memory", "daily-journal"]
  },
  {
    id: "daily-journal",
    name: "Daily Journals",
    description: "4 AM daily entries (YYYY-MM-DD.md)",
    status: "active",
    path: "/clawd/second-brain-docs/daily-journals/",
    icon: <FileText className="w-4 h-4" />,
    connections: ["second-brain"]
  }
];

function NodeCard({ node, isSelected, onClick }: {
  node: SystemNode;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusConfig = {
    active: {
      dot: "bg-emerald-400",
      glow: "shadow-[0_0_12px_rgba(52,211,153,0.4)]",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5"
    },
    idle: {
      dot: "bg-amber-400",
      glow: "shadow-[0_0_12px_rgba(251,191,36,0.4)]",
      text: "text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/5"
    },
    connected: {
      dot: "bg-[#00d4ff]",
      glow: "shadow-[0_0_12px_rgba(0,212,255,0.4)]",
      text: "text-[#00d4ff]",
      border: "border-[#00d4ff]/20",
      bg: "bg-[#00d4ff]/5"
    }
  };

  const config = statusConfig[node.status];

  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full p-4 rounded-xl text-left transition-all duration-300
        border backdrop-blur-sm
        ${isSelected
          ? "border-[#00d4ff]/30 bg-[#00d4ff]/5 ring-1 ring-[#00d4ff]/20"
          : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          p-2 rounded-lg transition-colors
          ${isSelected ? "bg-[#00d4ff]/10 text-[#00d4ff]" : "bg-white/[0.04] text-zinc-400 group-hover:text-zinc-300"}
        `}>
          {node.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium text-sm truncate transition-colors ${isSelected ? "text-white" : "text-zinc-200 group-hover:text-white"}`}>
              {node.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${config.dot} ${config.glow}`} />
              <span className={`text-[10px] uppercase tracking-wider ${config.text}`}>
                {node.status}
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
            {node.description}
          </p>
        </div>
      </div>
      {node.path && (
        <div className="mt-3 px-2 py-1 rounded bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] font-mono text-zinc-600 truncate block">
            {node.path}
          </span>
        </div>
      )}
    </button>
  );
}

export default function ArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const sections = [
    { id: "brain", title: "AI Brain", icon: Brain, color: "text-rose-400", nodes: ["kimi"] },
    { id: "identity", title: "Core Identity", icon: Brain, color: "text-violet-400", nodes: ["soul", "identity", "user"] },
    { id: "memory", title: "Memory Systems", icon: Database, color: "text-[#00d4ff]", nodes: ["memory", "daily-memory"] },
    { id: "comms", title: "Communication", icon: MessageCircle, color: "text-blue-400", nodes: ["telegram", "gateway"] },
    { id: "tools", title: "Tools & Skills", icon: Cpu, color: "text-emerald-400", nodes: ["tools", "browser-use", "exa", "alpaca"] },
    { id: "apis", title: "External APIs", icon: Zap, color: "text-amber-400", nodes: ["external-apis"] },
    { id: "storage", title: "Document Storage", icon: FolderOpen, color: "text-pink-400", nodes: ["second-brain", "daily-journal"] },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00d4ff]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-500/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/[0.04]">
          <div className="max-w-[1600px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </Link>
                <div className="w-px h-6 bg-white/[0.06]" />
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    System Architecture
                  </h1>
                  <p className="text-sm text-zinc-500 mt-1">
                    Living system visualization • {currentTime} EST
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                  <span className="text-sm text-emerald-400">System Online</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20">
                  <MessageCircle className="w-4 h-4 text-[#00d4ff]" />
                  <span className="text-sm text-[#00d4ff]">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-[1600px] mx-auto px-8 py-8">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Nodes", value: systemNodes.filter(n => n.status === "active").length, color: "text-emerald-400" },
              { label: "Connected", value: systemNodes.filter(n => n.status === "connected").length, color: "text-[#00d4ff]" },
              { label: "Idle", value: systemNodes.filter(n => n.status === "idle").length, color: "text-amber-400" },
              { label: "Total Systems", value: systemNodes.length, color: "text-zinc-300" }
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{stat.label}</div>
                <div className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Architecture grid */}
          <div className="grid grid-cols-4 gap-6">
            {sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/[0.04]">
                  <section.icon className={`w-4 h-4 ${section.color}`} />
                  <h2 className="text-sm font-medium text-zinc-300">{section.title}</h2>
                  <span className="ml-auto text-xs text-zinc-600">{section.nodes.length}</span>
                </div>
                <div className="space-y-3">
                  {systemNodes
                    .filter(n => section.nodes.includes(n.id))
                    .map(node => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        isSelected={selectedNode === node.id}
                        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Data flow */}
          <div className="mt-12 p-6 rounded-xl border border-white/[0.04] bg-white/[0.02]">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-[#00d4ff]" />
              <h2 className="text-sm font-medium text-zinc-300">Data Flow</h2>
            </div>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {[
                { label: "You message", color: "bg-blue-400" },
                { label: "Gateway routes", color: "bg-violet-400" },
                { label: "I process (read memory, use tools)", color: "bg-emerald-400" },
                { label: "Update docs/memory", color: "bg-pink-400" },
                { label: "Reply to you", color: "bg-[#00d4ff]" }
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] whitespace-nowrap">
                    <div className={`w-2 h-2 rounded-full ${step.color}`} />
                    <span className="text-sm text-zinc-400">{step.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <svg className="w-4 h-4 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00d4ff]" />
              <span>Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Idle</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
