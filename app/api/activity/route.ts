import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  // TODO: Connect to Convex or activity log
  // For now, return mock data
  const activities = [
    {
      id: "1",
      timestamp: Date.now() - 120000,
      type: "tool",
      action: "web_search",
      details: "Searched for 'AI agents building'",
      tokens: 1250,
      status: "success",
    },
    {
      id: "2",
      timestamp: Date.now() - 300000,
      type: "exec",
      action: "npm install",
      details: "Installed convex package",
      status: "success",
    },
    {
      id: "3",
      timestamp: Date.now() - 600000,
      type: "file",
      action: "Write File",
      details: "Created mission-control/page.tsx",
      status: "success",
    },
  ];

  return NextResponse.json({ activities });
}
