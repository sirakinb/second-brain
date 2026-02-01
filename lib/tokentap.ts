import { promises as fs } from "fs";
import os from "os";
import path from "path";

type TokentapEntry = {
  id: string;
  timestampIso: string;
  timestampMs: number;
  dateKey: string;
  provider: string;
  model: string;
  tokens: number;
  promptPreview: string;
  fileName: string;
};

type TokentapSummary = {
  totalTokens: number;
  totalRequests: number;
  activeDays: number;
  providers: Array<{
    provider: string;
    tokens: number;
    requests: number;
  }>;
  days: Array<{
    date: string;
    tokens: number;
    requests: number;
  }>;
  recent: TokentapEntry[];
  firstSeenIso: string | null;
  lastSeenIso: string | null;
};

type TokentapHistory = {
  promptsDir: string;
  entries: TokentapEntry[];
  summary: TokentapSummary;
  error: string | null;
};

const TOKENTAP_DIR_NAME = ".tokentap";
const PROMPTS_DIR_NAME = "prompts";
const MAX_RECENT = 50;
const PREVIEW_LIMIT = 180;

function resolvePromptsDir() {
  const configured = process.env.TOKENTAP_PROMPTS_DIR;
  if (configured) return path.resolve(configured);
  return path.join(os.homedir(), TOKENTAP_DIR_NAME, PROMPTS_DIR_NAME);
}

function parseTimestamp(input: string | null) {
  if (!input) return null;
  const match = input.match(
    /(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/,
  );
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function parseFileTimestamp(fileName: string) {
  const match = fileName.match(
    /(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})/,
  );
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function parseProviderFromFile(fileName: string) {
  const match = fileName.match(/_(\w+)\.md$/i);
  if (!match) return null;
  return match[1]?.toLowerCase() ?? null;
}

function normalizeProvider(value: string | null) {
  if (!value) return "unknown";
  return value.trim().toLowerCase();
}

function parseTokens(raw: string | null) {
  if (!raw) return 0;
  const digits = raw.replace(/[^0-9]/g, "");
  const parsed = Number.parseInt(digits || "0", 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function extractPromptPreview(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const sections: Array<{ role: string; text: string }> = [];
  let currentRole: string | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (currentRole) {
        sections.push({
          role: currentRole,
          text: buffer.join("\n").trim(),
        });
      }
      currentRole = line.slice(4).trim().toLowerCase();
      buffer = [];
      continue;
    }
    if (currentRole) {
      buffer.push(line);
    }
  }

  if (currentRole) {
    sections.push({
      role: currentRole,
      text: buffer.join("\n").trim(),
    });
  }

  const userSections = sections.filter((section) => section.role.includes("user"));
  const target = userSections.length
    ? userSections[userSections.length - 1]
    : sections[sections.length - 1];

  if (!target || !target.text) return "";
  const collapsed = target.text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= PREVIEW_LIMIT) return collapsed;
  return `${collapsed.slice(0, PREVIEW_LIMIT)}...`;
}

function parseEntry(markdown: string, fileName: string): TokentapEntry | null {
  const timestampLine = markdown.match(/^#\s*Prompt\s*-\s*(.+)$/m)?.[1] ?? null;
  const providerLine = markdown.match(/^\*\*Provider:\*\*\s*(.+)$/m)?.[1] ?? null;
  const modelLine = markdown.match(/^\*\*Model:\*\*\s*(.+)$/m)?.[1] ?? null;
  const tokensLine = markdown.match(/^\*\*Tokens:\*\*\s*(.+)$/m)?.[1] ?? null;

  const headerDate = parseTimestamp(timestampLine);
  const fileDate = parseFileTimestamp(fileName);
  const date = headerDate ?? fileDate;
  if (!date) return null;

  const provider = normalizeProvider(providerLine ?? parseProviderFromFile(fileName));
  const model = modelLine?.trim() || "unknown";
  const tokens = parseTokens(tokensLine);
  const preview = extractPromptPreview(markdown);
  const dateKey = date.toISOString().slice(0, 10);

  return {
    id: fileName.replace(/\.md$/i, ""),
    timestampIso: date.toISOString(),
    timestampMs: date.getTime(),
    dateKey,
    provider,
    model,
    tokens,
    promptPreview: preview,
    fileName,
  };
}

function buildSummary(entries: TokentapEntry[]): TokentapSummary {
  let totalTokens = 0;
  const providers = new Map<string, { provider: string; tokens: number; requests: number }>();
  const days = new Map<string, { date: string; tokens: number; requests: number }>();

  for (const entry of entries) {
    totalTokens += entry.tokens;

    const providerKey = entry.provider;
    const providerStats = providers.get(providerKey) ?? {
      provider: providerKey,
      tokens: 0,
      requests: 0,
    };
    providerStats.tokens += entry.tokens;
    providerStats.requests += 1;
    providers.set(providerKey, providerStats);

    const dayStats = days.get(entry.dateKey) ?? {
      date: entry.dateKey,
      tokens: 0,
      requests: 0,
    };
    dayStats.tokens += entry.tokens;
    dayStats.requests += 1;
    days.set(entry.dateKey, dayStats);
  }

  const sortedEntries = [...entries].sort(
    (a, b) => b.timestampMs - a.timestampMs,
  );

  const providersSorted = [...providers.values()].sort(
    (a, b) => b.tokens - a.tokens,
  );
  const daysSorted = [...days.values()].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const firstSeen = sortedEntries[sortedEntries.length - 1]?.timestampIso ?? null;
  const lastSeen = sortedEntries[0]?.timestampIso ?? null;

  return {
    totalTokens,
    totalRequests: entries.length,
    activeDays: days.size,
    providers: providersSorted,
    days: daysSorted,
    recent: sortedEntries.slice(0, MAX_RECENT),
    firstSeenIso: firstSeen,
    lastSeenIso: lastSeen,
  };
}

export async function getTokentapHistory(): Promise<TokentapHistory> {
  const promptsDir = resolvePromptsDir();
  let entries: TokentapEntry[] = [];
  let error: string | null = null;

  try {
    const files = await fs.readdir(promptsDir);
    const markdownFiles = files.filter((file) => file.toLowerCase().endsWith(".md"));

    const parsedEntries = await Promise.all(
      markdownFiles.map(async (fileName) => {
        const fullPath = path.join(promptsDir, fileName);
        const markdown = await fs.readFile(fullPath, "utf8");
        return parseEntry(markdown, fileName);
      }),
    );

    entries = parsedEntries.filter((entry): entry is TokentapEntry => Boolean(entry));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    error = message;
  }

  const summary = buildSummary(entries);

  return {
    promptsDir,
    entries,
    summary,
    error,
  };
}
