"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Search,
  TrendingUp,
  Layout,
  List,
  ArrowLeft,
  Circle,
  Timer,
  Target
} from "lucide-react";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  createdAt: string;
  completedAt?: string;
  tags: string[];
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Create Second Brain documentation system",
    description: "Built comprehensive docs for API integrations, architecture, and usage tracking",
    status: "done",
    priority: "high",
    category: "Infrastructure",
    createdAt: "2026-01-30T01:00:00Z",
    completedAt: "2026-01-30T02:00:00Z",
    tags: ["docs", "architecture", "setup"]
  },
  {
    id: "2",
    title: "Implement API usage tracking dashboard",
    description: "Created real-time cost tracking for all AI services with visual dashboard",
    status: "done",
    priority: "high",
    category: "Infrastructure",
    createdAt: "2026-01-30T01:30:00Z",
    completedAt: "2026-01-30T03:00:00Z",
    tags: ["api", "tracking", "dashboard"]
  },
  {
    id: "3",
    title: "Create Still App promotional video",
    description: "Generated AI images, voiceover, and composed 9.3s vertical video for TikTok/Reels",
    status: "done",
    priority: "high",
    category: "Marketing",
    createdAt: "2026-01-30T02:00:00Z",
    completedAt: "2026-01-30T02:50:00Z",
    tags: ["video", "marketing", "still-app"]
  },
  {
    id: "4",
    title: "Integrate HeyGen avatar API",
    description: "Attempted to connect HeyGen for avatar video generation - endpoint issues persist",
    status: "review",
    priority: "medium",
    category: "API Integration",
    createdAt: "2026-01-30T02:30:00Z",
    tags: ["api", "video", "avatar"]
  },
  {
    id: "5",
    title: "Build project management system",
    description: "Create Kanban-style task tracking with sophisticated UI design",
    status: "in-progress",
    priority: "high",
    category: "Infrastructure",
    createdAt: "2026-01-30T03:50:00Z",
    tags: ["project-management", "ui", "kanban"]
  },
  {
    id: "6",
    title: "Integrate Suno music API",
    description: "Connect to Suno for AI-generated meditation music in Still App",
    status: "todo",
    priority: "medium",
    category: "API Integration",
    createdAt: "2026-01-30T03:00:00Z",
    tags: ["api", "music", "still-app"]
  },
  {
    id: "7",
    title: "Create more Still App content variations",
    description: "Generate additional video scripts, images, and marketing materials",
    status: "backlog",
    priority: "medium",
    category: "Marketing",
    createdAt: "2026-01-30T03:00:00Z",
    tags: ["content", "marketing", "still-app"]
  },
  {
    id: "8",
    title: "Update UI design across all pages",
    description: "Apply sophisticated, futuristic design system to all existing components",
    status: "in-progress",
    priority: "high",
    category: "Design",
    createdAt: "2026-01-30T03:50:00Z",
    tags: ["design", "ui", "system"]
  }
];

const columns = [
  { id: "backlog", label: "Backlog", icon: Circle, color: "#71717a" },
  { id: "todo", label: "To Do", icon: Target, color: "#3b82f6" },
  { id: "in-progress", label: "In Progress", icon: Timer, color: "#f59e0b" },
  { id: "review", label: "Review", icon: Clock, color: "#8b5cf6" },
  { id: "done", label: "Done", icon: CheckCircle2, color: "#10b981" }
];

const priorityConfig = {
  low: { color: "#71717a", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
  medium: { color: "#3b82f6", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  high: { color: "#f59e0b", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  urgent: { color: "#ef4444", bg: "bg-red-500/10", border: "border-red-500/20" }
};

export default function ProjectManagement() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<"board" | "list">("board");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filter === "all" || task.category.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const tasksByStatus = columns.reduce((acc, col) => {
    acc[col.id] = filteredTasks.filter(t => t.status === col.id);
    return acc;
  }, {} as Record<string, Task[]>);

  const completedToday = tasks.filter(t =>
    t.status === "done" &&
    t.completedAt &&
    new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const inProgressCount = tasks.filter(t => t.status === "in-progress").length;
  const totalTasks = tasks.length;
  const completionRate = Math.round((tasks.filter(t => t.status === "done").length / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00d4ff]/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/[0.03] rounded-full blur-[150px]" />
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
                  <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
                  <p className="text-sm text-zinc-500 mt-1">
                    Track progress across all initiatives • {currentTime} EST
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d4ff] text-[#0a0a0b] font-medium text-sm hover:bg-[#00d4ff]/90 transition-colors">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-8 py-8">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Completed Today", value: completedToday, icon: CheckCircle2, color: "#10b981" },
              { label: "In Progress", value: inProgressCount, icon: Timer, color: "#f59e0b" },
              { label: "Completion Rate", value: `${completionRate}%`, icon: TrendingUp, color: "#00d4ff" },
              { label: "Total Tasks", value: totalTasks, icon: List, color: "#8b5cf6" }
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="text-3xl font-semibold" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] text-sm text-white placeholder-zinc-500 focus:border-[#00d4ff]/40 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/10 transition-all w-64"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-white/[0.06] bg-white/[0.02] text-sm text-zinc-300 focus:border-[#00d4ff]/40 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Marketing">Marketing</option>
                <option value="API Integration">API Integration</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg border border-white/[0.06] bg-white/[0.02]">
              <button
                onClick={() => setView("board")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                  view === "board" ? "bg-[#00d4ff]/10 text-[#00d4ff]" : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                <Layout className="w-4 h-4" />
                Board
              </button>
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                  view === "list" ? "bg-[#00d4ff]/10 text-[#00d4ff]" : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
          </div>

          {/* Kanban Board */}
          {view === "board" ? (
            <div className="grid grid-cols-5 gap-4">
              {columns.map((column) => (
                <div key={column.id} className="flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <column.icon className="w-4 h-4" style={{ color: column.color }} />
                      <h3 className="text-sm font-medium text-zinc-300">{column.label}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-xs text-zinc-500">
                        {tasksByStatus[column.id]?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3 flex-1">
                    {tasksByStatus[column.id]?.map((task) => {
                      const priority = priorityConfig[task.priority];
                      return (
                        <div
                          key={task.id}
                          className="group p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm text-zinc-200 group-hover:text-white transition-colors leading-snug">
                              {task.title}
                            </h4>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/[0.04]">
                              <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                            </button>
                          </div>
                          <p className="text-xs text-zinc-500 mb-3 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${priority.bg} ${priority.border} border`}
                                style={{ color: priority.color }}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-600">
                              {task.category}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {task.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.02] text-zinc-500 border border-white/[0.04]"
                              >
                                #{tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.02] text-zinc-600">
                                +{task.tags.length - 2}
                              </span>
                            )}
                          </div>
                          {task.completedAt && (
                            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/[0.04]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400">
                                Completed {new Date(task.completedAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-2">
              {filteredTasks.map((task) => {
                const column = columns.find(c => c.id === task.status);
                const priority = priorityConfig[task.priority];
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] transition-all"
                  >
                    <div
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: column?.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-zinc-200 truncate">{task.title}</h4>
                      <p className="text-xs text-zinc-500 truncate">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-zinc-500 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.04]">
                        {task.category}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider ${priority.bg} ${priority.border} border`}
                        style={{ color: priority.color }}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs text-zinc-600 w-24 text-right">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recent Activity */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/[0.04]">
              <Clock className="w-4 h-4 text-[#00d4ff]" />
              <h2 className="text-sm font-medium text-zinc-300">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {tasks
                .filter(t => t.completedAt)
                .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                .slice(0, 4)
                .map((task) => (
                  <div key={task.id} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                    <div className="flex-1 p-4 rounded-xl border border-white/[0.04] bg-white/[0.02]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-zinc-300">{task.title}</span>
                        </div>
                        <span className="text-xs text-zinc-600">
                          {task.completedAt && new Date(task.completedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
