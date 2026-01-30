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
  Calendar,
  Music,
  User
} from "lucide-react";

interface ApiUsage {
  service: string;
  today: number;
  month: number;
  unit: string;
  cost: number;
  icon: React.ReactNode;
  color: string;
}

const usageData: ApiUsage[] = [
  {
    service: "OpenAI",
    today: 0,
    month: 0,
    unit: "tokens",
    cost: 0,
    icon: <DollarSign className="w-5 h-5" />,
    color: "bg-emerald-500"
  },
  {
    service: "Gemini (Nano Banana)",
    today: 3,
    month: 3,
    unit: "images",
    cost: 0,
    icon: <Image className="w-5 h-5" />,
    color: "bg-purple-500"
  },
  {
    service: "fal.ai (Images)",
    today: 0,
    month: 0,
    unit: "images",
    cost: 0,
    icon: <Image className="w-5 h-5" />,
    color: "bg-indigo-500"
  },
  {
    service: "fal.ai (Video)",
    today: 0,
    month: 0,
    unit: "videos",
    cost: 0,
    icon: <Video className="w-5 h-5" />,
    color: "bg-pink-500"
  },
  {
    service: "ElevenLabs",
    today: 1,
    month: 1,
    unit: "voices",
    cost: 0.03,
    icon: <Mic className="w-5 h-5" />,
    color: "bg-blue-500"
  },
  {
    service: "HeyGen",
    today: 0,
    month: 0,
    unit: "videos",
    cost: 0,
    icon: <User className="w-5 h-5" />,
    color: "bg-orange-500"
  },
  {
    service: "Runway",
    today: 0,
    month: 0,
    unit: "videos",
    cost: 0,
    icon: <Video className="w-5 h-5" />,
    color: "bg-red-500"
  },
  {
    service: "Suno",
    today: 0,
    month: 0,
    unit: "tracks",
    cost: 0,
    icon: <Music className="w-5 h-5" />,
    color: "bg-green-500"
  },
  {
    service: "Exa MCP",
    today: 0,
    month: 0,
    unit: "searches",
    cost: 0,
    icon: <Search className="w-5 h-5" />,
    color: "bg-cyan-500"
  },
  {
    service: "Browser-Use",
    today: 0,
    month: 0,
    unit: "sessions",
    cost: 0,
    icon: <Globe className="w-5 h-5" />,
    color: "bg-amber-500"
  }
];

export default function UsageDashboard() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const totalCost = usageData.reduce((sum, item) => sum + item.cost, 0);

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
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              API Usage Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Track costs across all services • {currentTime} EST
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-6 py-3 rounded-xl bg-slate-900/50 border border-slate-700">
              <div className="text-sm text-slate-400">Total This Month</div>
              <div className="text-2xl font-bold text-emerald-400">${totalCost.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {usageData.map((api) => (
          <div 
            key={api.service}
            className="p-6 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${api.color} bg-opacity-20`}>
                  {api.icon}
                </div>
                <h3 className="font-semibold text-slate-200">{api.service}</h3>
              </div>
              <span className="text-2xl font-bold text-slate-300">
                ${api.cost.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Today:</span>
                <span className="text-slate-300">{api.today} {api.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">This Month:</span>
                <span className="text-slate-300">{api.month} {api.unit}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full ${api.color} transition-all`}
                  style={{ width: `${Math.min((api.month / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-6 rounded-xl bg-slate-900/30 border border-slate-700">
        <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Quick Actions
        </h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors">
            Export Usage CSV
          </button>
          <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors">
            Set Budget Alerts
          </button>
          <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors">
            View Detailed Logs
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-8 p-4 rounded-lg bg-slate-900/30 border border-slate-700 text-sm text-slate-400">
        <p>📊 Usage tracking is updated in real-time as APIs are called.</p>
        <p className="mt-1">💡 Costs are estimates based on standard pricing tiers.</p>
        <p className="mt-1">⚠️ Set budget alerts to avoid unexpected charges.</p>
      </div>
    </div>
  );
}
