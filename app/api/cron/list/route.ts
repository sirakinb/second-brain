import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";

export async function GET() {
  try {
    const cronStorePath = path.join(os.homedir(), ".clawdbot", "cron-store.json");
    const data = await fs.readFile(cronStorePath, "utf-8");
    const cronStore = JSON.parse(data);
    
    const jobs = Object.entries(cronStore.jobs || {}).map(([id, job]: [string, any]) => ({
      id,
      schedule: job.schedule || job.every || "Unknown",
      text: job.text || job.prompt || "Unnamed task",
      nextRun: job.nextRun,
      enabled: job.enabled !== false,
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    // If no cron store exists yet, return empty
    return NextResponse.json({ jobs: [] });
  }
}
