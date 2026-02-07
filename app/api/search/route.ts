import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const results: any[] = [];

  // Search MEMORY.md
  try {
    const memoryPath = path.join(os.homedir(), "clawd", "MEMORY.md");
    const content = await fs.readFile(memoryPath, "utf-8");
    
    if (content.toLowerCase().includes(query.toLowerCase())) {
      const lines = content.split('\n');
      const matchingLines = lines.filter(line => 
        line.toLowerCase().includes(query.toLowerCase())
      );
      
      results.push({
        id: "memory-1",
        type: "memory",
        title: "MEMORY.md",
        snippet: matchingLines.slice(0, 3).join(' '),
        path: "~/clawd/MEMORY.md",
        score: 0.9,
      });
    }
  } catch (error) {
    // MEMORY.md doesn't exist yet
  }

  // Search memory/*.md files
  try {
    const memoryDir = path.join(os.homedir(), "clawd", "memory");
    const files = await fs.readdir(memoryDir);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(memoryDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        
        if (content.toLowerCase().includes(query.toLowerCase())) {
          const lines = content.split('\n');
          const matchingLines = lines.filter(line => 
            line.toLowerCase().includes(query.toLowerCase())
          );
          
          results.push({
            id: `memory-${file}`,
            type: "memory",
            title: file,
            snippet: matchingLines.slice(0, 3).join(' '),
            path: `~/clawd/memory/${file}`,
            score: 0.8,
          });
        }
      }
    }
  } catch (error) {
    // memory/ dir doesn't exist yet
  }

  // Search documents
  try {
    const docsPath = path.join(os.homedir(), "clawd", "projects", "second-brain", "my-app", "documents");
    const searchDocs = async (dir: string, basePath: string = "") => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
        
        if (entry.isDirectory()) {
          await searchDocs(fullPath, relativePath);
        } else if (entry.name.endsWith('.md')) {
          const content = await fs.readFile(fullPath, "utf-8");
          
          if (content.toLowerCase().includes(query.toLowerCase())) {
            const lines = content.split('\n');
            const matchingLines = lines.filter(line => 
              line.toLowerCase().includes(query.toLowerCase())
            );
            
            results.push({
              id: `doc-${relativePath}`,
              type: "document",
              title: entry.name.replace('.md', ''),
              snippet: matchingLines.slice(0, 3).join(' '),
              path: relativePath,
              score: 0.7,
            });
          }
        }
      }
    };
    
    await searchDocs(docsPath);
  } catch (error) {
    // documents dir doesn't exist yet
  }

  // Sort by score
  results.sort((a, b) => b.score - a.score);

  return NextResponse.json({ results: results.slice(0, 50) });
}
