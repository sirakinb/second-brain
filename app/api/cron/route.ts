import { exec } from "node:child_process";
import { promisify } from "node:util";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync("clawdbot cron list --json", {
      maxBuffer: 1024 * 1024 * 10,
    });

    const data = JSON.parse(stdout);
    return Response.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const stderr =
      typeof error === "object" && error && "stderr" in error
        ? String((error as { stderr?: string }).stderr ?? "")
        : "";

    console.error("Failed to list cron jobs:", message, stderr);

    return Response.json(
      {
        error: stderr.trim() || message,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
