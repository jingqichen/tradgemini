import React, { useState, useEffect } from 'react';
import { Key, Save, ShieldCheck, ExternalLink, Eye, EyeOff } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('GEMINI_API_KEY');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('GEMINI_API_KEY', apiKey.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
        localStorage.removeItem('GEMINI_API_KEY');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
            <Key className="text-emerald-500" />
            API 密钥配置
        </h2>
        <p className="text-slate-400 text-sm mb-6">
            为了激活 AI 分析功能，请配置您的 Google Gemini API Key。您的密钥仅存储在本地浏览器中，绝不会发送到第三方服务器。
        </p>

        <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Gemini API Key</label>
            <div className="relative">
                <input
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors pr-12 font-mono"
                    placeholder="AIzaSy..."
                />
                <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                    {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            
            <div className="flex justify-between items-center">
                <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                    <ExternalLink size={14} />
                    获取免费的 Gemini API Key
                </a>
                <button 
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                        saved 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 text-slate-900 hover:bg-white'
                    }`}
                >
                    {saved ? <ShieldCheck size={18} /> : <Save size={18} />}
                    {saved ? '已保存' : '保存设置'}
                </button>
            </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
         <h3 className="text-lg font-semibold text-slate-200 mb-4">关于部署</h3>
         <div className="prose prose-invert text-sm text-slate-400">
             <p>
                 当前版本为浏览器端预览版 (Preview)。在生产环境中，API 调用应通过后端代理进行，以防止密钥泄露。
                 完整的部署指南请参考 <span className="text-emerald-400 font-mono">系统架构 -> 部署指南</span> 章节。
             </p>
         </div>
      </div>
    </div>
  );
};