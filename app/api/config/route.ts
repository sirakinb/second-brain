import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILES = [
  {
    name: 'SOUL.md',
    path: 'SOUL.md',
    description: 'Personality, values, and behavioral guidelines'
  },
  {
    name: 'IDENTITY.md',
    path: 'IDENTITY.md',
    description: 'Core identity - name, role, vibe'
  },
  {
    name: 'USER.md',
    path: 'USER.md',
    description: 'Information about Aki and working context'
  },
  {
    name: 'MEMORY.md',
    path: 'MEMORY.md',
    description: 'Curated long-term memory and important context'
  },
  {
    name: 'AGENTS.md',
    path: 'AGENTS.md',
    description: 'System operations manual and protocols'
  },
  {
    name: 'TOOLS.md',
    path: 'TOOLS.md',
    description: 'Local tool notes and environment-specific info'
  },
  {
    name: 'HEARTBEAT.md',
    path: 'HEARTBEAT.md',
    description: 'Periodic check tasks (runs every ~30 minutes)'
  }
];

export async function GET() {
  try {
    const files = CONFIG_FILES.map(file => {
      const filePath = path.join(process.cwd(), 'public', 'config', file.path);
      
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').length;
        const words = content.split(/\s+/).filter(w => w.length > 0).length;
        
        return {
          ...file,
          content,
          lines,
          words
        };
      } catch (error) {
        console.error(`Error reading ${file.name}:`, error);
        return {
          ...file,
          content: '(File not found or empty)',
          lines: 0,
          words: 0
        };
      }
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error reading config files:', error);
    return NextResponse.json({ error: 'Failed to read config files' }, { status: 500 });
  }
}
