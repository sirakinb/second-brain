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
  ArrowLeft,
  ChevronRight
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
    description: "Moonshot AI model - the core reasoning engine",
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
    description: "User profile and communication preferences",
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
    description: "Primary communication channel",
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
    description: "Advanced browser automation",
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

const statusConfig = {
  active: {
    color: "#06D6A0",
    label: "Active",
    bg: "bg-[#06D6A0]/10",
    border: "border-[#06D6A0]/20",
  },
  idle: {
    color: "#FFD166",
    label: "Idle",
    bg: "bg-[#FFD166]/10",
    border: "border-[#FFD166]/20",
  },
  connected: {
    color: "#73A9FF",
    label: "Connected",
    bg: "bg-[#73A9FF]/10",
    border: "border-[#73A9FF]/20",
  }
};

function NodeCard({ node, isSelected, onClick }: {
  node: SystemNode;
  isSelected: boolean;
  onClick: () => void;
}) {
  const config = statusConfig[node.status];

  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full p-4 rounded-xl text-left transition-all duration-200
        border backdrop-blur-sm
        ${isSelected
          ? "border-[#FF7A5C]/30 bg-[#FF7A5C]/5 ring-1 ring-[#FF7A5C]/20"
          : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          p-2.5 rounded-lg transition-colors
          ${isSelected ? "bg-[#FF7A5C]/10 text-[#FF7A5C]" : "bg-white/[0.04] text-[#9D9BA8] group-hover:text-[#F5F3F0]"}
        `}>
          {node.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium text-sm truncate transition-colors ${isSelected ? "text-white" : "text-[#F5F3F0] group-hover:text-white"}`}>
              {node.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full status-beacon"
                style={{ background: config.color }}
              />
              <span className="text-[10px] uppercase tracking-wider font-mono" style={{ color: config.color }}>
                {config.label}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#6B6977] leading-relaxed line-clamp-2">
            {node.description}
          </p>
        </div>
      </div>
      {node.path && (
        <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] font-mono text-[#6B6977] truncate block">
            {node.path}
          </span>
        </div>
      )}
    </button>
  );
}

const sections = [
  { id: "brain", title: "AI Brain", icon: Brain, color: "#FF7A5C", nodes: ["kimi"] },
  { id: "identity", title: "Core Identity", icon: Brain, color: "#A78BFA", nodes: ["soul", "identity", "user"] },
  { id: "memory", title: "Memory Systems", icon: Database, color: "#73A9FF", nodes: ["memory", "daily-memory"] },
  { id: "comms", title: "Communication", icon: MessageCircle, color: "#06D6A0", nodes: ["telegram", "gateway"] },
  { id: "tools", title: "Tools & Skills", icon: Cpu, color: "#FFD166", nodes: ["tools", "browser-use", "exa", "alpaca"] },
  { id: "apis", title: "External APIs", icon: Zap, color: "#FF6B9D", nodes: ["external-apis"] },
  { id: "storage", title: "Document Storage", icon: FolderOpen, color: "#06D6A0", nodes: ["second-brain", "daily-journal"] },
];

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

  const stats = [
    { label: "Active", value: systemNodes.filter(n => n.status === "active").length, color: "#06D6A0" },
    { label: "Connected", value: systemNodes.filter(n => n.status === "connected").length, color: "#73A9FF" },
    { label: "Idle", value: systemNodes.filter(n => n.status === "idle").length, color: "#FFD166" },
    { label: "Total", value: systemNodes.length, color: "#F5F3F0" }
  ];

  return (
    <div className="min-h-screen bg-observatory text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none grid-overlay opacity-30" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF7A5C]/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#A78BFA]/[0.04] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#73A9FF]/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/[0.04]">
          <div className="max-w-[1600px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-[#9D9BA8] hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </Link>
                <div className="w-px h-6 bg-white/[0.06]" />
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    System Architecture
                  </h1>
                  <p className="text-sm text-[#6B6977] mt-1 font-mono">
                    Live visualization • {currentTime} EST
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#06D6A0]/10 border border-[#06D6A0]/20">
                  <div className="w-2 h-2 rounded-full bg-[#06D6A0] status-beacon status-active" style={{ background: '#06D6A0' }} />
                  <span className="text-sm text-[#06D6A0] font-medium">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-[1600px] mx-auto px-8 py-8">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="card-observatory p-5 animate-slide-up opacity-0"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <div className="label-mono mb-2">{stat.label} Nodes</div>
                <div className="text-3xl font-semibold" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Architecture grid */}
          <div className="grid grid-cols-4 gap-6">
            {sections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="space-y-4 animate-slide-up opacity-0"
                style={{ animationDelay: `${(sectionIndex + 4) * 0.05}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex items-center gap-3 pb-3 border-b border-white/[0.04]">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${section.color}15` }}
                  >
                    <section.icon className="w-4 h-4" style={{ color: section.color }} />
                  </div>
                  <h2 className="text-sm font-medium text-[#F5F3F0]">{section.title}</h2>
                  <span className="ml-auto text-xs text-[#6B6977] font-mono">{section.nodes.length}</span>
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
          <div className="mt-12 card-elevated p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#FF7A5C]/10">
                <Activity className="w-4 h-4 text-[#FF7A5C]" />
              </div>
              <h2 className="text-sm font-medium text-[#F5F3F0]">Data Flow Pipeline</h2>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {[
                { label: "You message", color: "#73A9FF" },
                { label: "Gateway routes", color: "#A78BFA" },
                { label: "Process (read memory, use tools)", color: "#06D6A0" },
                { label: "Update docs/memory", color: "#FFD166" },
                { label: "Reply to you", color: "#FF7A5C" }
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] whitespace-nowrap">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: step.color }} />
                    <span className="text-sm text-[#9D9BA8]">{step.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-[#6B6977] flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-6 text-sm text-[#6B6977]">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                <span>{config.label}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
