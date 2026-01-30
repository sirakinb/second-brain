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
  Activity
} from "lucide-react";

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
    id: "soul",
    name: "SOUL.md",
    description: "Core personality, values, and behavioral principles",
    status: "active",
    path: "/clawd/SOUL.md",
    icon: <Brain className="w-5 h-5" />,
    connections: ["identity", "memory"]
  },
  {
    id: "identity",
    name: "IDENTITY.md",
    description: "Name, role, emoji, public persona",
    status: "active",
    path: "/clawd/IDENTITY.md",
    icon: <FileText className="w-5 h-5" />,
    connections: ["soul", "user"]
  },
  {
    id: "user",
    name: "USER.md",
    description: "Aki's profile and communication preferences",
    status: "active",
    path: "/clawd/USER.md",
    icon: <FileText className="w-5 h-5" />,
    connections: ["identity", "telegram"]
  },
  {
    id: "memory",
    name: "MEMORY.md",
    description: "Long-term curated memories and learnings",
    status: "active",
    path: "/clawd/MEMORY.md",
    icon: <Database className="w-5 h-5" />,
    connections: ["soul", "daily-memory"]
  },
  {
    id: "daily-memory",
    name: "Daily Memory",
    description: "Raw daily logs (memory/YYYY-MM-DD.md)",
    status: "active",
    path: "/clawd/memory/",
    icon: <Clock className="w-5 h-5" />,
    connections: ["memory", "second-brain"]
  },
  {
    id: "telegram",
    name: "Telegram Gateway",
    description: "Primary communication channel with Aki",
    status: "connected",
    path: "@sirakinb (id: 1360341449)",
    icon: <MessageCircle className="w-5 h-5" />,
    connections: ["user", "gateway"]
  },
  {
    id: "gateway",
    name: "Clawdbot Gateway",
    description: "Central routing and session management",
    status: "active",
    path: "http://127.0.0.1:18791",
    icon: <Server className="w-5 h-5" />,
    connections: ["telegram", "tools"]
  },
  {
    id: "tools",
    name: "Tool Orchestrator",
    description: "Routes commands to appropriate skills",
    status: "active",
    path: "/opt/homebrew/lib/node_modules/clawdbot/skills/",
    icon: <Cpu className="w-5 h-5" />,
    connections: ["gateway", "browser-use", "exa", "alpaca"]
  },
  {
    id: "browser-use",
    name: "Browser-Use",
    description: "Advanced browser automation (anti-bot, parallel)",
    status: "active",
    path: "~/.claude/skills/browser-use/",
    icon: <Globe className="w-5 h-5" />,
    connections: ["tools", "external-apis"]
  },
  {
    id: "exa",
    name: "Exa MCP",
    description: "Semantic web search (Reddit, X, News)",
    status: "active",
    path: "mcp.exa.ai",
    icon: <Network className="w-5 h-5" />,
    connections: ["tools", "external-apis"]
  },
  {
    id: "alpaca",
    name: "Alpaca API",
    description: "Trading automation platform",
    status: "idle",
    path: "alpaca.markets",
    icon: <Activity className="w-5 h-5" />,
    connections: ["tools", "external-apis"]
  },
  {
    id: "external-apis",
    name: "External APIs",
    description: "GitHub, Gmail, Calendar, Twitter",
    status: "active",
    icon: <Zap className="w-5 h-5" />,
    connections: ["browser-use", "exa", "alpaca"]
  },
  {
    id: "second-brain",
    name: "Second Brain",
    description: "Knowledge storage and retrieval system",
    status: "active",
    path: "/clawd/second-brain-docs/",
    icon: <FolderOpen className="w-5 h-5" />,
    connections: ["daily-memory", "daily-journal"]
  },
  {
    id: "daily-journal",
    name: "Daily Journals",
    description: "4 AM daily entries (YYYY-MM-DD.md)",
    status: "active",
    path: "/clawd/second-brain-docs/daily-journals/",
    icon: <FileText className="w-5 h-5" />,
    connections: ["second-brain"]
  }
];

function NodeCard({ node, isSelected, onClick }: { 
  node: SystemNode; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusColors = {
    active: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
    idle: "bg-amber-500/20 border-amber-500/50 text-amber-400",
    connected: "bg-blue-500/20 border-blue-500/50 text-blue-400"
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 rounded-lg border cursor-pointer transition-all duration-300
        hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10
        ${isSelected ? "ring-2 ring-cyan-500 bg-cyan-500/10" : "bg-slate-900/50"}
        ${statusColors[node.status]}
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-md bg-slate-800">
          {node.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{node.name}</h3>
          <span className={`
            text-xs px-2 py-0.5 rounded-full uppercase tracking-wider
            ${node.status === "active" ? "bg-emerald-500/20 text-emerald-400" : ""}
            ${node.status === "idle" ? "bg-amber-500/20 text-amber-400" : ""}
            ${node.status === "connected" ? "bg-blue-500/20 text-blue-400" : ""}
          `}>
            {node.status}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        {node.description}
      </p>
      {node.path && (
        <div className="mt-2 text-xs font-mono text-slate-500 truncate">
          {node.path}
        </div>
      )}
    </div>
  );
}

function ConnectionLine({ from, to }: { from: string; to: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function ArchitecturePage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [sessionStatus, setSessionStatus] = useState("online");

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Adzo's Architecture
            </h1>
            <p className="text-slate-400 mt-2">
              Living system visualization • Last updated: {currentTime} EST
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-emerald-400">System Online</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Telegram Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Identity & Memory */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Core Identity
          </h2>
          <div className="space-y-3">
            {systemNodes
              .filter(n => ["soul", "identity", "user"].includes(n.id))
              .map(node => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  onClick={() => setSelectedNode(node.id)}
                />
              ))}
          </div>

          <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2 mt-8">
            <Database className="w-5 h-5 text-cyan-400" />
            Memory Systems
          </h2>
          <div className="space-y-3">
            {systemNodes
              .filter(n => ["memory", "daily-memory"].includes(n.id))
              .map(node => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  onClick={() => setSelectedNode(node.id)}
                />
              ))}
          </div>
        </div>

        {/* Center Column - Communication Hub */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            Communication
          </h2>
          <div className="space-y-3">
            {systemNodes
              .filter(n => ["telegram", "gateway"].includes(n.id))
              .map(node => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  onClick={() => setSelectedNode(node.id)}
                />
              ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Active Session</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Channel:</span>
                <span className="text-blue-400">Telegram</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User:</span>
                <span className="text-slate-300">@sirakinb</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Model:</span>
                <span className="text-slate-300">Kimi K2.5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-slate-300">Adzo's VM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tools & APIs */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            Tools & Skills
          </h2>
          <div className="space-y-3">
            {systemNodes
              .filter(n => ["tools", "browser-use", "exa", "alpaca"].includes(n.id))
              .map(node => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  onClick={() => setSelectedNode(node.id)}
                />
              ))}
          </div>

          <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2 mt-8">
            <Zap className="w-5 h-5 text-amber-400" />
            External APIs
          </h2>
          <div className="space-y-3">
            {systemNodes
              .filter(n => n.id === "external-apis")
              .map(node => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  onClick={() => setSelectedNode(node.id)}
                />
              ))}
          </div>
          <div className="p-3 rounded-md bg-slate-900/30 border border-slate-700 text-xs">
            <div className="text-slate-400 mb-2">Connected Services:</div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">GitHub</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Gmail</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Calendar</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">Twitter/X</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">OpenAI</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">xAI</span>
            </div>
          </div>
        </div>

        {/* Far Right - Storage */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-pink-400" />
            Document Storage
          </h2>
          <div className="space-y-3">
            {systemNodes
              .filter(n => ["second-brain", "daily-journal"].includes(n.id))
              .map(node => (
                <NodeCard
                  key={node.id}
                  node={node}
                  isSelected={selectedNode === node.id}
                  onClick={() => setSelectedNode(node.id)}
                />
              ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-slate-900/50 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Storage Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Daily Journals:</span>
                <span className="text-slate-300">2 entries</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tool Docs:</span>
                <span className="text-slate-300">4 documents</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Memory Files:</span>
                <span className="text-slate-300">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next Journal:</span>
                <span className="text-cyan-400">Jan 31, 4:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Flow Visualization */}
      <div className="mt-12 p-6 rounded-xl bg-slate-900/30 border border-slate-700">
        <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          Data Flow
        </h2>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-slate-300">You message →</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-slate-300">Gateway routes →</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-300">I process (read memory, use tools) →</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-400" />
              <span className="text-slate-300">Update docs/memory →</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-slate-300">Reply to you</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-slate-400">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <span className="text-slate-400">Connected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="text-slate-400">Idle/Standby</span>
        </div>
      </div>
    </div>
  );
}
