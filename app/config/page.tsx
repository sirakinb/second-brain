'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ConfigFile {
  name: string;
  path: string;
  description: string;
  content: string;
  lines: number;
  words: number;
}

export default function ConfigPage() {
  const [files, setFiles] = useState<ConfigFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<ConfigFile | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">System Configuration</h1>
          <div className="text-gray-400">Loading configuration files...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold">System Configuration</h1>
            <p className="text-gray-400 mt-2">
              Core configuration files that define Adzo's personality, memory, and operations
            </p>
          </div>
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {files.map((file) => (
            <div
              key={file.path}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => setSelectedFile(file)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white">{file.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadFile(file);
                  }}
                  className="text-gray-400 hover:text-white"
                  title="Download"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
              
              <p className="text-sm text-gray-400 mb-4">{file.description}</p>
              
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{file.lines} lines</span>
                <span>{file.words} words</span>
              </div>
            </div>
          ))}
        </div>

        {/* File Viewer Modal */}
        {selectedFile && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-8 z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <div>
                  <h2 className="text-2xl font-bold">{selectedFile.name}</h2>
                  <p className="text-sm text-gray-400 mt-1">{selectedFile.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadFile(selectedFile)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-auto flex-1">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {selectedFile.content}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
