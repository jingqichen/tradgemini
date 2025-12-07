import React, { useState, useRef, useEffect } from 'react';
import { generateFinancialInsight } from '../services/geminiService';
import { ChatMessage, KnowledgeFile } from '../types';
import { Send, Bot, User, AlertCircle, Loader2, PlayCircle, FileText, FileBarChart, CheckSquare, Square, BrainCircuit, Sparkles, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

interface AnalysisViewProps {
  files: KnowledgeFile[];
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ files }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "你好。我是 FinanceInsight AI 投资决策委员会。\n\n我采用了双核架构：\n1. **Gemini (Reader)**: 负责阅读海量研报、视频字幕。\n2. **DeepSeek Logic (Thinker)**: 负责逻辑推演与风控。\n\n请在左侧选择文件，然后点击下方 **'生成深度投研报告'**。",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<string>(''); // For tracking analysis steps
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, step]);

  const toggleFileSelection = (id: string) => {
    setSelectedFileIds(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const getSelectedContext = () => {
    if (selectedFileIds.length === 0) return undefined;
    
    return files
      .filter(f => selectedFileIds.includes(f.id))
      .map(f => f.content)
      .join("\n\n---\n\n");
  };

  const handleSend = async (overrideText?: string, mode: 'simple' | 'deep_strategy' = 'simple') => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    const context = getSelectedContext();
    const isContextAware = !!context;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (mode === 'deep_strategy') {
          // Simulation of multi-step processing visual
          setStep('正在调用 Gemini 提取宏观与行业数据 (Information Extraction)...');
          await new Promise(r => setTimeout(r, 1200));
          
          setStep('正在构建产业链图谱与基本面筛选...');
          await new Promise(r => setTimeout(r, 1200));

          setStep('DeepSeek 逻辑引擎介入: 进行红队测试与逻辑纠错 (Red Teaming)...');
          await new Promise(r => setTimeout(r, 1500));
          
          setStep('正在计算胜率赔率与生成交易指令...');
      }

      const responseText = await generateFinancialInsight(userMsg.text, context, mode);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       console.error(error);
       setMessages(prev => [...prev, {
         id: Date.now().toString(),
         role: 'model',
         text: "系统错误: 分析管道中断。",
         timestamp: new Date()
       }]);
    } finally {
      setLoading(false);
      setStep('');
    }
  };

  const handleDeepAnalysis = () => {
    if (selectedFileIds.length === 0) {
        alert("请至少选择一份文件进行深度分析。");
        return;
    }
    // Triggers the Prompt 1 -> Prompt 5 chain defined in geminiService
    const prompt = `请基于选中的 ${selectedFileIds.length} 份文件，生成一份《A股/美股深度投资策略报告》。请严格执行双阶段分析（信息提取 -> 逻辑对抗），并给出明确的买入/卖出标的和操作区间。`;
    handleSend(prompt, 'deep_strategy');
  };

  return (
    <div className="h-full flex gap-4 animate-in fade-in duration-300">
      
      {/* LEFT SIDEBAR: KNOWLEDGE BASE */}
      <div className="w-80 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden shrink-0 shadow-lg">
        <div className="p-4 border-b border-slate-800 bg-slate-950/30">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                <BrainCircuit size={18} className="text-emerald-500" />
                数据摄取层 (Ingestion)
            </h3>
            <p className="text-xs text-slate-500 mt-1">Gemini 1.5 Pro Context Window</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {files.length === 0 && (
                <div className="text-center p-8 text-slate-500 text-xs">
                    暂无文件，请前往“数据接入”页面同步网盘数据。
                </div>
            )}
            {files.map(file => {
                const isSelected = selectedFileIds.includes(file.id);
                return (
                    <div 
                        key={file.id}
                        onClick={() => toggleFileSelection(file.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 group ${
                            isSelected 
                            ? 'bg-emerald-900/20 border-emerald-500/50' 
                            : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 ${isSelected ? 'text-emerald-500' : 'text-slate-600'}`}>
                                {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center gap-2 mb-1">
                                    {file.type === 'Video' ? <PlayCircle size={14} className="text-blue-400"/> : 
                                     file.type === 'PDF' ? <FileText size={14} className="text-red-400"/> : 
                                     <FileBarChart size={14} className="text-orange-400"/>}
                                    <span className={`text-sm font-medium truncate ${isSelected ? 'text-emerald-100' : 'text-slate-300'}`}>
                                        {file.name}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{file.summary}</p>
                                <p className="text-[10px] text-slate-600 mt-1">{file.date}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/30 space-y-2">
            <button
                onClick={handleDeepAnalysis}
                disabled={selectedFileIds.length === 0 || loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white py-3 rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-900/20 border border-emerald-500/20"
            >
                <Cpu size={16} />
                {loading ? '分析计算中...' : '生成深度研报 (Deep Research)'}
            </button>
            <p className="text-[10px] text-center text-slate-500">
                调用链路: Gemini Extract &rarr; DeepSeek Logic
            </p>
        </div>
      </div>

      {/* RIGHT MAIN: CHAT INTERFACE */}
      <div className="flex-1 flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg relative">
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-emerald-400" />
                <span className="text-sm font-medium text-slate-300">
                    投资决策委员会 (Investment Committee)
                </span>
            </div>
            {selectedFileIds.length > 0 && (
                <div className="flex gap-2">
                     <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
                        Context: {selectedFileIds.length} files
                     </span>
                     <button 
                        onClick={() => setSelectedFileIds([])}
                        className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" ref={scrollRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-xl p-5 shadow-md ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800/80 backdrop-blur-sm text-slate-200 border border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-3 text-xs opacity-70 pb-2 border-b border-white/10">
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span className="font-mono uppercase tracking-wider">{msg.role === 'user' ? 'Portfolio Manager' : 'AI Architect (Gemini + DeepSeek)'}</span>
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed markdown-content font-sans">
                    {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start w-full">
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700/50 w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Loader2 size={20} className="animate-spin text-emerald-500" />
                    <div className="absolute inset-0 bg-emerald-500/30 blur-lg animate-pulse"></div>
                  </div>
                  <span className="text-emerald-400 text-sm font-medium tracking-wide">AI Thinking Process</span>
                </div>
                
                <div className="space-y-3 pl-8 border-l-2 border-slate-700 ml-2">
                   <div className={`flex items-center gap-3 text-xs ${step.includes('Gemini') ? 'text-emerald-300' : 'text-slate-500'}`}>
                        <FileText size={14} />
                        <span>阅读上下文与数据提取 (Context Ingestion)</span>
                   </div>
                   <div className={`flex items-center gap-3 text-xs ${step.includes('图谱') ? 'text-emerald-300' : 'text-slate-500'}`}>
                        <TrendingUp size={14} />
                        <span>构建宏观与行业图谱 (Structuring)</span>
                   </div>
                   <div className={`flex items-center gap-3 text-xs ${step.includes('DeepSeek') ? 'text-purple-300 animate-pulse font-bold' : 'text-slate-500'}`}>
                        <BrainCircuit size={14} />
                        <span>DeepSeek 逻辑推理与红队测试 (Reasoning)</span>
                   </div>
                   <div className={`flex items-center gap-3 text-xs ${step.includes('指令') ? 'text-emerald-300' : 'text-slate-500'}`}>
                        <Sparkles size={14} />
                        <span>生成最终策略报告 (Output)</span>
                   </div>
                   
                   <p className="pt-2 text-xs text-slate-400 font-mono italic">
                       {step || 'Initializing neural engines...'}
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 z-10">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-2 focus-within:border-emerald-500 transition-colors shadow-inner">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(undefined, 'simple')}
              placeholder={selectedFileIds.length > 0 ? "针对选中的研报进行追问 (例如: 为什么看好光模块?)" : "输入问题..."}
              className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-sm p-2"
            />
            <button
              onClick={() => handleSend(undefined, 'simple')}
              disabled={loading || !input.trim()}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-md transition-colors"
              title="普通对话"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};