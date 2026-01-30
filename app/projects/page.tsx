"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  MoreHorizontal,
  Filter,
  Search,
  TrendingUp,
  Layout,
  List,
  ArrowRight
} from "lucide-react";

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
  { id: "backlog", label: "Backlog", color: "from-slate-500 to-slate-600" },
  { id: "todo", label: "To Do", color: "from-blue-500 to-blue-600" },
  { id: "in-progress", label: "In Progress", color: "from-amber-500 to-amber-600" },
  { id: "review", label: "Review", color: "from-purple-500 to-purple-600" },
  { id: "done", label: "Done", color: "from-emerald-500 to-emerald-600" }
];

const priorityColors = {
  low: "bg-slate-500",
  medium: "bg-blue-500",
  high: "bg-amber-500",
  urgent: "bg-red-500"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Project Command Center
              </h1>
              <p className="text-slate-400 mt-2 text-lg">
                Track progress across all initiatives • {currentTime} EST
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-all text-sm">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-slate-400 text-sm">Completed Today</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400">{completedToday}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-slate-400 text-sm">In Progress</span>
              </div>
              <div className="text-3xl font-bold text-amber-400">{inProgressCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-slate-400 text-sm">Completion Rate</span>
              </div>
              <div className="text-3xl font-bold text-cyan-400">{completionRate}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <List className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-slate-400 text-sm">Total Tasks</span>
              </div>
              <div className="text-3xl font-bold text-purple-400">{totalTasks}</div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl bg-slate-900/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-all w-64"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-700 text-slate-200 focus:border-cyan-500/50 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Marketing">Marketing</option>
              <option value="API Integration">API Integration</option>
              <option value="Design">Design</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setView("board")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                view === "board" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <Layout className="w-4 h-4" />
              Board
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                view === "list" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400 hover:text-slate-300"
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color}`} />
                    <h3 className="font-semibold text-slate-300">{column.label}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400">
                      {tasksByStatus[column.id]?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  {tasksByStatus[column.id]?.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
                          {task.title}
                        </h4>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                          <span className="text-xs text-slate-500 capitalize">{task.priority}</span>
                        </div>
                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                          {task.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      {task.completedAt && (
                        <div className="flex items-center gap-1 mt-3 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          Completed {new Date(task.completedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-all"
              >
                <div className={`w-2 h-12 rounded-full bg-gradient-to-b ${columns.find(c => c.id === task.status)?.color || "from-slate-500 to-slate-600"}`} />
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200">{task.title}</h4>
                  <p className="text-sm text-slate-400">{task.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
                    {task.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]} bg-opacity-20 text-white`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Timeline */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-slate-300 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {tasks
              .filter(t => t.completedAt)
              .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
              .slice(0, 5)
              .map((task, index) => (
                <div key={task.id} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="flex-1 p-4 rounded-xl bg-slate-900/30 border border-slate-700/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-emerald-400 font-medium">Completed:</span>
                        <span className="text-slate-300 ml-2">{task.title}</span>
                      </div>
                      <span className="text-sm text-slate-500">
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
      </div>
    </div>
  );
}
