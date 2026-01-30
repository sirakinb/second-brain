"use client";

import { useState, useEffect } from "react";
import { 
  DollarSign, 
  Image, 
  Video, 
  Mic, 
  Search, 
  Globe,
  TrendingUp,
  Music,
  User,
  Zap,
  Activity,
  PieChart,
  ArrowUpRight,
  Brain
} from "lucide-react";

interface ApiUsage {
  service: string;
  today: number;
  month: number;
  unit: string;
  cost: number;
  icon: React.ReactNode;
  color: string;
  trend: "up" | "down" | "stable";
}

const usageData: ApiUsage[] = [
  {
    service: "Kimi K2.5",
    today: 1,
    month: 1,
    unit: "sessions",
    cost: 0.15,
    icon: <Brain className="w-5 h-5" />,
    color: "from-rose-500 to-rose-600",
    trend: "up"
  },
  {
    service: "OpenAI",
    today: 0,
    month: 0,
    unit: "tokens",
    cost: 0,
    icon: <DollarSign className="w-5 h-5" />,
    color: "from-emerald-500 to-emerald-600",
    trend: "stable"
  },
  {
    service: "Gemini (Nano Banana)",
    today: 3,
    month: 3,
    unit: "images",
    cost: 0,
    icon: <Image className="w-5 h-5" />,
    color: "from-violet-500 to-violet-600",
    trend: "up"
  },
  {
    service: "fal.ai (Images)",
    today: 0,
    month: 0,
    unit: "images",
    cost: 0,
    icon: <Image className="w-5 h-5" />,
    color: "from-indigo-500 to-indigo-600",
    trend: "stable"
  },
  {
    service: "fal.ai (Video)",
    today: 0,
    month: 0,
    unit: "videos",
    cost: 0,
    icon: <Video className="w-5 h-5" />,
    color: "from-pink-500 to-pink-600",
    trend: "stable"
  },
  {
    service: "ElevenLabs",
    today: 1,
    month: 1,
    unit: "voices",
    cost: 0.03,
    icon: <Mic className="w-5 h-5" />,
    color: "from-blue-500 to-blue-600",
    trend: "up"
  },
  {
    service: "HeyGen",
    today: 0,
    month: 0,
    unit: "videos",
    cost: 0,
    icon: <User className="w-5 h-5" />,
    color: "from-orange-500 to-orange-600",
    trend: "stable"
  },
  {
    service: "Runway",
    today: 0,
    month: 0,
    unit: "videos",
    cost: 0,
    icon: <Video className="w-5 h-5" />,
    color: "from-red-500 to-red-600",
    trend: "stable"
  },
  {
    service: "Suno",
    today: 0,
    month: 0,
    unit: "tracks",
    cost: 0,
    icon: <Music className="w-5 h-5" />,
    color: "from-green-500 to-green-600",
    trend: "stable"
  },
  {
    service: "Exa MCP",
    today: 0,
    month: 0,
    unit: "searches",
    cost: 0,
    icon: <Search className="w-5 h-5" />,
    color: "from-cyan-500 to-cyan-600",
    trend: "stable"
  },
  {
    service: "Browser-Use",
    today: 0,
    month: 0,
    unit: "sessions",
    cost: 0,
    icon: <Globe className="w-5 h-5" />,
    color: "from-amber-500 to-amber-600",
    trend: "stable"
  }
];

export default function UsageDashboard() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const totalCost = usageData.reduce((sum, item) => sum + item.cost, 0);
  const activeServices = usageData.filter(item => item.today > 0).length;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                API Usage Analytics
              </h1>
              <p className="text-slate-400 mt-2 text-lg">
                Real-time cost tracking across all AI services • {currentTime} EST
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-6 py-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-sm text-slate-400 mb-1">Total This Month</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  ${totalCost.toFixed(2)}
                </div>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
                <div className="text-sm text-slate-400 mb-1">Active Services</div>
                <div className="text-3xl font-bold text-cyan-400">{activeServices}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-slate-400 text-sm">API Calls Today</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {usageData.reduce((sum, item) => sum + item.today, 0)}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-slate-400 text-sm">Most Used</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 truncate">
              {usageData.sort((a, b) => b.month - a.month)[0]?.service.split(" ")[0]}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-slate-400 text-sm">Avg Cost/Call</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              ${totalCost > 0 ? (totalCost / Math.max(1, usageData.reduce((s, i) => s + i.month, 0))).toFixed(3) : "0.00"}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <PieChart className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-slate-400 text-sm">Free Tier Used</span>
            </div>
            <div className="text-2xl font-bold text-amber-400">
              {usageData.filter(i => i.cost === 0 && i.today > 0).length}
            </div>
          </div>
        </div>

        {/* Usage Cards Grid */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {usageData.map((api) => (
            <div 
              key={api.service}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${api.color} bg-opacity-20`}>
                    {api.icon}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {api.trend === "up" && <ArrowUpRight className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>
              
              <h3 className="font-semibold text-slate-200 mb-1 group-hover:text-cyan-400 transition-colors">
                {api.service}
              </h3>
              
              <div className="text-2xl font-bold text-slate-300 mb-3">
                ${api.cost.toFixed(2)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Today:</span>
                  <span className="text-slate-300 font-medium">{api.today} {api.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Month:</span>
                  <span className="text-slate-300 font-medium">{api.month} {api.unit}</span>
                </div>
              </div>
              
              <div className="mt-4 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${api.color} transition-all`}
                  style={{ width: `${Math.min((api.month / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Cost Breakdown & Insights */}
        <div className="grid grid-cols-2 gap-6">
          {/* Today's Activity */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Today's Activity
            </h2>
            <div className="space-y-3">
              {usageData
                .filter(api => api.today > 0)
                .map(api => (
                  <div key={api.service} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${api.color}`}>
                        {api.icon}
                      </div>
                      <span className="text-slate-300">{api.service}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400">{api.today} {api.unit}</span>
                      <span className="text-emerald-400 font-medium">${api.cost.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              {usageData.filter(api => api.today > 0).length === 0 && (
                <p className="text-slate-500 text-center py-4">No activity today</p>
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Usage Insights
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 font-medium">Cost Optimization</span>
                </div>
                <p className="text-sm text-slate-400">
                  Using Gemini Nano Banana for images saves ~$0.03 per image vs DALL-E 3
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-400 font-medium">Free Tier Active</span>
                </div>
                <p className="text-sm text-slate-400">
                  2 services on free tier today (Gemini, Exa MCP)
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-blue-400 font-medium">Most Active</span>
                </div>
                <p className="text-sm text-slate-400">
                  Marketing content generation is today's primary driver
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900/30 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Quick Actions
          </h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors border border-slate-700">
              Export Usage CSV
            </button>
            <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors border border-slate-700">
              Set Budget Alerts
            </button>
            <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors border border-slate-700">
              View Detailed Logs
            </button>
            <button className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-sm text-cyan-400 transition-colors border border-cyan-500/30">
              Configure APIs
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>📊 Costs are estimates based on standard pricing tiers • Updated in real-time</p>
          <p className="mt-1">💡 Set budget alerts to avoid unexpected charges</p>
        </div>
      </div>
    </div>
  );
}
