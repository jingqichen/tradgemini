import React, { useState, useRef, useEffect } from 'react';
import { generateFinancialInsight } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, AlertCircle, Loader2, PlayCircle, FileText } from 'lucide-react';

// 模拟从后端 RAG 系统检索到的“脏”数据（模拟 OCR/Whisper 结果）
const MOCK_RAG_CONTEXT = `
[00:12:30] CEO: 感谢大家参加 BABA 第三季度财报会议。本季度我们面临复杂的宏观环境。
[00:12:45] CFO: 财务数据方面，本季度营收同比增长 5%，达到 2603 亿元人民币。调整后 EBITDA 同比下降 2%，主要由于我们在 Taobao 和 Tmall 上的高投入用户留存策略。
[00:13:10] CEO: 云智能集团（Cloud Intelligence Group）收入增长放缓至 3%，我们正在主动削减低利润率的项目制合同，转向公共云服务。
[00:14:00] Analyst (Goldman Sachs): 关于资本配置，你们宣布了新的回购计划？
[00:14:15] CFO: 是的，我们将股票回购计划规模扩大 250 亿美元。我们认为目前股价被严重低估（Undervalued），PE 倍数处于历史低位。
[00:15:00] Risk Officer: 监管层面，我们注意到反垄断整改已基本完成，但地缘政治对芯片供应链的影响仍在持续。
`;

export const AnalysisView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "你好。我是 FinanceInsight AI。我已经完成了对百度网盘和本地上传文件的解析。我可以为你提取投资论点、识别风险因素或进行特定的股票分析。请问你想了解什么？",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (overrideText?: string, context?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

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
      // 传递 context 模拟 RAG 检索到的文档片段
      const responseText = await generateFinancialInsight(userMsg.text, context);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const runSimulationTest = () => {
      const prompt = "基于提供的会议纪要，生成一份投资分析备忘录。包含核心观点、风险和估值看法。";
      handleSend(prompt, MOCK_RAG_CONTEXT);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <Bot size={18} className="text-emerald-500" />
          AI 投资分析专员
        </h3>
        <div className="flex items-center gap-3">
            <button 
                onClick={runSimulationTest}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded border border-blue-400/30 transition-colors shadow-lg shadow-blue-900/20"
                title="点击测试 Prompt 效果"
            >
                <PlayCircle size={14} />
                运行仿真测试 (BABA Q3)
            </button>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">
                RAG 已启用
            </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-4 ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-200 border border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span>{msg.role === 'user' ? '投资经理' : 'FinanceInsight AI'}</span>
              </div>
              <div className="text-sm whitespace-pre-wrap leading-relaxed markdown-content">
                  {msg.text}
              </div>
              {msg.role === 'model' && msg.text.includes("BABA") && (
                 <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-500 flex items-center gap-1">
                    <FileText size={12} />
                    <span>数据来源: [Mock] 2024_Q3_Earnings_Call_Transcript.txt</span>
                 </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col gap-2 min-w-[300px]">
              <div className="flex items-center gap-3">
                <Loader2 size={16} className="animate-spin text-emerald-500" />
                <span className="text-slate-400 text-sm font-medium">正在思考 (Chain of Thought)...</span>
              </div>
              <div className="pl-7 space-y-1">
                 <p className="text-xs text-slate-500 animate-pulse">Retrieving chunks from VectorDB (Milvus)...</p>
                 <p className="text-xs text-slate-500 animate-pulse delay-75">Ranking context relevance (Cohere)...</p>
                 <p className="text-xs text-slate-500 animate-pulse delay-150">Generating financial thesis...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-2 focus-within:border-emerald-500 transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="询问关于个股分析、风险因素或系统架构..."
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-sm p-2"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-md transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
          <AlertCircle size={10} />
          AI 生成内容。不构成财务建议。请以原始文件为准。
        </p>
      </div>
    </div>
  );
};