'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, X, Eye, Search } from 'lucide-react';

interface ConfigFile {
  name: string;
  path: string;
  description: string;
  content: string;
  lines: number;
  words: number;
}

const fileColors: Record<string, { accent: string; bg: string; border: string }> = {
  'SOUL.md': { accent: '#FF7A5C', bg: 'bg-[#FF7A5C]/10', border: 'border-[#FF7A5C]/20' },
  'IDENTITY.md': { accent: '#A78BFA', bg: 'bg-[#A78BFA]/10', border: 'border-[#A78BFA]/20' },
  'MEMORY.md': { accent: '#73A9FF', bg: 'bg-[#73A9FF]/10', border: 'border-[#73A9FF]/20' },
  'USER.md': { accent: '#06D6A0', bg: 'bg-[#06D6A0]/10', border: 'border-[#06D6A0]/20' },
  'AGENTS.md': { accent: '#FFD166', bg: 'bg-[#FFD166]/10', border: 'border-[#FFD166]/20' },
  'TOOLS.md': { accent: '#FF6B9D', bg: 'bg-[#FF6B9D]/10', border: 'border-[#FF6B9D]/20' },
  'HEARTBEAT.md': { accent: '#06D6A0', bg: 'bg-[#06D6A0]/10', border: 'border-[#06D6A0]/20' },
};

function getFileStyle(name: string) {
  return fileColors[name] || { accent: '#9D9BA8', bg: 'bg-white/[0.03]', border: 'border-white/[0.06]' };
}

export default function ConfigPage() {
  const [files, setFiles] = useState<ConfigFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<ConfigFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConfigFiles();
  }, []);

  const fetchConfigFiles = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setFiles(data.files);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching config files:', error);
      setLoading(false);
    }
  };

  const downloadFile = (file: ConfigFile) => {
    const blob = new Blob([file.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-observatory text-white">
        <div className="fixed inset-0 pointer-events-none grid-overlay opacity-30" />
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[30%] left-1/4 w-[50%] h-[50%] rounded-full bg-[#A78BFA]/[0.04] blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] rounded-full bg-[#FF7A5C]/[0.04] blur-[150px]" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-white/[0.04] rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-white/[0.02] rounded-2xl border border-white/[0.04]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-observatory text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none grid-overlay opacity-30" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] left-1/4 w-[50%] h-[50%] rounded-full bg-[#A78BFA]/[0.04] blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] rounded-full bg-[#FF7A5C]/[0.04] blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-[#9D9BA8] hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back</span>
                </Link>
                <div className="w-px h-6 bg-white/[0.06]" />
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    System Configuration
                  </h1>
                  <p className="text-sm text-[#6B6977] mt-1">
                    Core files that define personality, memory, and operations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6977]" />
                  <input
                    type="text"
                    placeholder="Search configs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-observatory pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Files', value: files.length, accent: '#FF7A5C' },
              { label: 'Total Lines', value: files.reduce((acc, f) => acc + f.lines, 0).toLocaleString(), accent: '#73A9FF' },
              { label: 'Total Words', value: files.reduce((acc, f) => acc + f.words, 0).toLocaleString(), accent: '#FFD166' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="card-observatory p-5"
              >
                <div className="label-mono mb-2">{stat.label}</div>
                <div className="text-2xl font-semibold" style={{ color: stat.accent }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* File Grid */}
        <div className="max-w-6xl mx-auto px-8 pb-12">
          <div className="label-mono mb-4">Configuration Files</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFiles.map((file, index) => {
              const style = getFileStyle(file.name);
              return (
                <div
                  key={file.path}
                  className={`group card-elevated p-6 cursor-pointer hover-lift animate-slide-up opacity-0`}
                  style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${style.bg} ${style.border} border`}>
                      <FileText className="w-5 h-5" style={{ color: style.accent }} />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(file);
                        }}
                        className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[#9D9BA8] hover:text-white transition-all"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadFile(file);
                        }}
                        className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[#9D9BA8] hover:text-white transition-all"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF7A5C] transition-colors">
                    {file.name}
                  </h3>

                  <p className="text-sm text-[#6B6977] mb-4 line-clamp-2 leading-relaxed">
                    {file.description}
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-white/[0.04]">
                    <span className="text-xs text-[#6B6977] font-mono">
                      {file.lines} lines
                    </span>
                    <span className="text-xs text-[#6B6977]">•</span>
                    <span className="text-xs text-[#6B6977] font-mono">
                      {file.words} words
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 mx-auto mb-4 text-[#6B6977]/50" />
              <p className="text-[#6B6977]">No config files match your search</p>
            </div>
          )}
        </div>

        {/* File Viewer Modal */}
        {selectedFile && (
          <div
            className="fixed inset-0 bg-[#0C0B0E]/90 backdrop-blur-sm flex items-center justify-center p-8 z-50 animate-fade-in"
            onClick={() => setSelectedFile(null)}
          >
            <div
              className="card-elevated max-w-4xl w-full max-h-[85vh] flex flex-col animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${getFileStyle(selectedFile.name).bg} ${getFileStyle(selectedFile.name).border} border`}>
                    <FileText className="w-5 h-5" style={{ color: getFileStyle(selectedFile.name).accent }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedFile.name}</h2>
                    <p className="text-sm text-[#6B6977] mt-0.5">{selectedFile.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadFile(selectedFile)}
                    className="btn-observatory"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2.5 rounded-lg text-[#6B6977] hover:text-white hover:bg-white/[0.04] transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-auto p-6">
                <pre className="text-sm text-[#B8B5C4] whitespace-pre-wrap font-mono leading-relaxed">
                  {selectedFile.content}
                </pre>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.04] bg-white/[0.01]">
                <div className="flex items-center gap-4 text-xs text-[#6B6977] font-mono">
                  <span>{selectedFile.lines} lines</span>
                  <span>•</span>
                  <span>{selectedFile.words} words</span>
                </div>
                <span className="text-xs text-[#6B6977] font-mono">{selectedFile.path}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
