import React, { useState, useEffect } from 'react';
import { ShieldCheck, Key, Save, Server, AlertTriangle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [deepSeekKey, setDeepSeekKey] = useState('');
  const [geminiStatus, setGeminiStatus] = useState<'active' | 'missing'>('missing');

  useEffect(() => {
    // Load DeepSeek key from local storage
    const storedDsKey = localStorage.getItem('DEEPSEEK_API_KEY');
    if (storedDsKey) setDeepSeekKey(storedDsKey);

    // Check environment variable for Gemini
    if (process.env.API_KEY) {
      setGeminiStatus('active');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('DEEPSEEK_API_KEY', deepSeekKey);
    // Visual feedback could be added here
    alert('DeepSeek API Key 已保存 (Saved)');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" />
            系统设置 (System Configuration)
        </h2>
        <p className="text-slate-400 text-sm mb-6">
            配置 AI 模型接口密钥。FinanceInsight AI 采用双核架构：Gemini 负责数据摄取，DeepSeek 负责逻辑推理。
        </p>

        <div className="space-y-6">
            {/* Gemini Config (Environment Variable) */}
            <div className="bg-slate-950/50 p-6 rounded-lg border border-slate-800 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Server size={20} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-200">Google Gemini API Key</label>
                            <span className="text-xs text-slate-500">Core Engine (Ingestion & Context)</span>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        geminiStatus === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                        {geminiStatus === 'active' ? 'Active / Connected' : 'Missing Configuration'}
                    </div>
                </div>
                
                <div className="relative">
                    <input 
                        type="text" 
                        value={geminiStatus === 'active' ? "**************************************" : ""}
                        disabled
                        className="w-full bg-slate-900 border border-slate-700 text-slate-500 rounded-lg px-4 py-3 font-mono text-sm cursor-not-allowed opacity-70"
                        placeholder="Not Configured"
                    />
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <AlertTriangle size={12} className="text-yellow-500" />
                        <span>Security Enforced: This key is managed via <code className="text-emerald-400 bg-slate-900 px-1 rounded">process.env.API_KEY</code> environment variable.</span>
                    </div>
                </div>
            </div>

            {/* DeepSeek Config (Writable) */}
            <div className="bg-slate-950/50 p-6 rounded-lg border border-slate-800 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <Key size={20} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-200">DeepSeek API Key</label>
                            <span className="text-xs text-slate-500">Reasoning Engine (Logic & Red Teaming)</span>
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium border bg-slate-800 text-slate-400 border-slate-700">
                        Optional / User Managed
                    </div>
                </div>

                <div className="flex gap-2">
                    <input 
                        type="password" 
                        value={deepSeekKey}
                        onChange={(e) => setDeepSeekKey(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-4 py-3 font-mono text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder-slate-600"
                        placeholder="sk-..."
                    />
                    <button 
                        onClick={handleSave}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-purple-900/20"
                    >
                        <Save size={18} />
                        Save
                    </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    Used for the "Deep Research" pipeline. If left empty, the system will use Gemini to simulate DeepSeek's reasoning logic.
                </p>
            </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
         <h3 className="text-lg font-semibold text-slate-200 mb-4">Deployment Info</h3>
         <div className="grid grid-cols-2 gap-4 text-sm">
             <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                 <span className="block text-slate-500 mb-1">Environment</span>
                 <span className="font-mono text-emerald-400">Production (Vercel/Docker)</span>
             </div>
             <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                 <span className="block text-slate-500 mb-1">Model Pipeline</span>
                 <span className="font-mono text-purple-400">Gemini 2.5 + DeepSeek R1</span>
             </div>
         </div>
      </div>
    </div>
  );
};