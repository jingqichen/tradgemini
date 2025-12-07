import React, { useState } from 'react';
import { ARCHITECTURE_DOCS } from '../constants';
import { Code, Terminal, BookOpen, Layers } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-100">系统架构规范说明书</h2>
            <p className="text-slate-400 text-sm mt-1">FinanceInsight AI 技术设计文档</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-lg flex space-x-2">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded"><Terminal size={18} /></button>
            <button className="p-2 text-emerald-400 bg-slate-900 rounded shadow"><BookOpen size={18} /></button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
        <div className="flex border-b border-slate-800 overflow-x-auto">
            {ARCHITECTURE_DOCS.map((doc, idx) => (
                <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors flex items-center space-x-2 ${
                        activeTab === idx 
                        ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500' 
                        : 'bg-slate-950 text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                    }`}
                >
                    <Layers size={14} className={activeTab === idx ? "opacity-100" : "opacity-50"} />
                    <span>{doc.title}</span>
                </button>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-4xl mx-auto">
                <div className="prose prose-invert prose-emerald max-w-none">
                     {/* 
                       Note: A real app would use a proper Markdown renderer like react-markdown. 
                       For this constrained environment, we handle simple text rendering.
                     */}
                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-light text-sm md:text-base">
                        {ARCHITECTURE_DOCS[activeTab].content.split('\n').map((line, i) => {
                             if (line.trim().startsWith('*')) {
                                return <li key={i} className="ml-4 list-disc marker:text-emerald-500">{line.replace('*', '')}</li>;
                             }
                             if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                                 return <h3 key={i} className="text-lg font-bold text-slate-100 mt-6 mb-2">{line.replace(/\*\*/g, '')}</h3>;
                             }
                             return <p key={i} className="mb-2">{line}</p>;
                        })}
                    </div>

                    {ARCHITECTURE_DOCS[activeTab].code && (
                        <div className="mt-8 relative group">
                            <div className="absolute -top-3 left-4 bg-slate-800 text-xs px-2 py-1 rounded border border-slate-700 text-slate-400 font-mono">
                                {ARCHITECTURE_DOCS[activeTab].language}
                            </div>
                            <pre className="bg-slate-950 p-6 rounded-lg border border-slate-800 overflow-x-auto text-sm font-mono text-emerald-50/90 shadow-inner">
                                <code>{ARCHITECTURE_DOCS[activeTab].code}</code>
                            </pre>
                            <button className="absolute top-4 right-4 text-slate-500 hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Code size={16} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};