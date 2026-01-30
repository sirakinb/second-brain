import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import type { DocFrontmatter, DocTreeNode } from "@/lib/types";

export const DOCS_ROOT = path.resolve(
  process.cwd(),
  "documents",
);

const MARKDOWN_EXTS = new Set([".md", ".mdx"]);

export async function ensureDocsDir() {
  await fs.mkdir(DOCS_ROOT, { recursive: true });
  return DOCS_ROOT;
}

function isMarkdownFile(fileName: string) {
  return MARKDOWN_EXTS.has(path.extname(fileName).toLowerCase());
}

function normalizeRelativePath(inputPath: string) {
  const cleaned = inputPath.replace(/\\/g, "/").replace(/^\/+/, "");
  const ext = path.extname(cleaned);
  if (!ext) {
    return `${cleaned}.md`;
  }
  return cleaned;
}

export async function resolveDocPath(relativePath: string) {
  await ensureDocsDir();
  const normalized = normalizeRelativePath(relativePath);
  const fullPath = path.resolve(DOCS_ROOT, normalized);
  if (!fullPath.startsWith(DOCS_ROOT)) {
    throw new Error("Invalid document path.");
  }
  return { fullPath, normalized };
}

async function buildTree(
  directory: string,
  relativeBase: string,
): Promise<DocTreeNode[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const dirs: DocTreeNode[] = [];
  const files: DocTreeNode[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      const childPath = path.join(directory, entry.name);
      const relativePath = path.join(relativeBase, entry.name);
      const children = await buildTree(childPath, relativePath);
      dirs.push({
        name: entry.name,
        path: relativePath.replace(/\\/g, "/"),
        type: "dir",
        children,
      });
    } else if (entry.isFile() && isMarkdownFile(entry.name)) {
      const filePath = path.join(relativeBase, entry.name);
      files.push({
        name: entry.name.replace(/\.(md|mdx)$/i, ""),
        path: filePath.replace(/\\/g, "/"),
        type: "file",
      });
    }
  }

  dirs.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));
  return [...dirs, ...files];
}

export async function getDocTree() {
  await ensureDocsDir();
  return buildTree(DOCS_ROOT, "");
}

export async function readDoc(relativePath: string) {
  const { fullPath, normalized } = await resolveDocPath(relativePath);
  const raw = await fs.readFile(fullPath, "utf8");
  const parsed = matter(raw);
  const frontmatter = parsed.data as DocFrontmatter;
  return {
    path: normalized,
    content: parsed.content,
    frontmatter,
  };
}

function serializeFrontmatter(frontmatter: DocFrontmatter) {
  const lines: string[] = [];
  if (frontmatter.title) {
    lines.push(`title: ${JSON.stringify(frontmatter.title)}`);
  }
  if (frontmatter.date) {
    lines.push(`date: ${JSON.stringify(frontmatter.date)}`);
  }
  if (frontmatter.tags?.length) {
    const serializedTags = frontmatter.tags
      .filter(Boolean)
      .map((tag) => JSON.stringify(tag));
    lines.push(`tags: [${serializedTags.join(", ")}]`);
  }
  if (lines.length === 0) return "";
  return `---\n${lines.join("\n")}\n---\n\n`;
}

export async function writeDoc(params: {
  path: string;
  content?: string;
  frontmatter?: DocFrontmatter;
}) {
  const { fullPath, normalized } = await resolveDocPath(params.path);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  const frontmatter = params.frontmatter ?? {};
  const header = serializeFrontmatter(frontmatter);
  const body = params.content ?? "";
  await fs.writeFile(fullPath, `${header}${body}`, "utf8");
  return normalized;
}

export function flattenTree(tree: DocTreeNode[]) {
  const files: DocTreeNode[] = [];
  const visit = (nodes: DocTreeNode[]) => {
    for (const node of nodes) {
      if (node.type === "file") {
        files.push(node);
      } else if (node.children) {
        visit(node.children);
      }
    }
  };
  visit(tree);
  return files;
}
