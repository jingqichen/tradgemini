import React, { useState, useEffect } from 'react';
import { Cloud, Link as LinkIcon, HardDrive, RefreshCw, Upload, FileUp, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface QueueItem {
  id: string;
  name: string;
  status: string;
  progress: number;
  color: string;
  source: 'Local' | 'Netdisk';
}

export const IngestionView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: '1', name: 'BABA_Q3_Transcript.pdf', status: 'OCR 处理中', progress: 85, color: 'bg-emerald-500', source: 'Netdisk' },
    { id: '2', name: 'NVDA_Analysis_Video.mp4', status: 'Whisper 语音转写中', progress: 42, color: 'bg-blue-500', source: 'Netdisk' }
  ]);

  // 模拟进度条自动增长
  useEffect(() => {
    const interval = setInterval(() => {
      setQueue(prevQueue => 
        prevQueue.map(item => {
          if (item.progress >= 100) {
            return { ...item, status: '已完成 (Completed)', progress: 100, color: 'bg-slate-600' };
          }
          // 随机增加进度
          const increment = Math.random() * 5; 
          const newProgress = Math.min(item.progress + increment, 100);
          
          let newStatus = item.status;
          if (newProgress < 30) newStatus = '排队中 (Queued)';
          else if (newProgress < 60) newStatus = item.name.endsWith('.mp4') ? '音频提取中 (Extracting)' : '文档解析中 (Parsing)';
          else if (newProgress < 90) newStatus = item.name.endsWith('.mp4') ? 'Whisper 转写中 (ASR)' : 'OCR 识别中 (OCR)';
          else if (newProgress < 100) newStatus = '向量化存入 (Indexing)';

          return { ...item, progress: newProgress, status: newStatus };
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleNetdiskSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);

    // 模拟网络请求延迟
    setTimeout(() => {
      const newFiles: QueueItem[] = [
        { id: Date.now().toString(), name: '2024_Macro_Strategy_Report.pdf', status: '等待处理', progress: 0, color: 'bg-purple-500', source: 'Netdisk' },
        { id: (Date.now()+1).toString(), name: 'CEO_Interview_CCTV.mp4', status: '等待处理', progress: 0, color: 'bg-blue-500', source: 'Netdisk' }
      ];
      setQueue(prev => [...newFiles, ...prev]);
      setIsSyncing(false);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file, idx) => ({
        id: `local-${Date.now()}-${idx}`,
        name: file.name,
        status: '等待处理 (Pending)',
        progress: 0,
        color: 'bg-emerald-500',
        source: 'Local' as const
      }));
      
      setQueue(prev => [...newFiles, ...prev]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Baidu Netdisk Section */}
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-800/30 p-8 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">百度网盘连接器 (Baidu Netdisk)</h2>
          <p className="text-blue-200 text-sm mb-6 max-w-xl">
            安全连接您的云存储。系统采用 API 与 Selenium 混合策略，可自动绕过反爬机制进行数据同步。
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 bg-slate-950/50 border border-blue-500/30 rounded-lg p-1 flex items-center">
                <LinkIcon className="ml-3 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="粘贴百度网盘分享链接 (例如: pan.baidu.com/s/...)"
                    className="flex-1 bg-transparent border-none outline-none text-white px-4 py-2 text-sm"
                    defaultValue="https://pan.baidu.com/s/1A2b3C_Finance_Data"
                />
             </div>
             <div className="w-32 bg-slate-950/50 border border-blue-500/30 rounded-lg p-1 flex items-center">
                <input 
                    type="text" 
                    placeholder="提取码"
                    className="flex-1 bg-transparent border-none outline-none text-white px-4 py-2 text-sm text-center"
                    defaultValue="8888"
                />
             </div>
             <button 
                onClick={handleNetdiskSync}
                disabled={isSyncing}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/50 whitespace-nowrap flex items-center gap-2"
             >
                {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <Cloud size={18} />}
                {isSyncing ? '同步中...' : '开始同步'}
             </button>
          </div>
          {isSyncing && (
             <div className="mt-4 flex items-center gap-2 text-xs text-blue-300 animate-pulse">
                <AlertCircle size={12} />
                正在绕过验证码...正在扫描目录...
             </div>
          )}
        </div>
        <Cloud className="absolute right-0 top-0 text-blue-500/10 w-64 h-64 -mr-10 -mt-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Local Upload Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
           <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Upload size={18} className="text-emerald-400" />
                本地文件解析
            </h3>
            <div className="flex-1 border-2 border-dashed border-slate-700 rounded-lg bg-slate-950/50 hover:bg-slate-950 transition-colors flex flex-col items-center justify-center p-8 text-center group relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                  multiple 
                />
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileUp size={32} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h4 className="text-slate-200 font-medium">点击或拖拽上传文件</h4>
                <p className="text-slate-500 text-xs mt-2 max-w-xs">
                    支持 PDF, Word, MP4, MP3 格式。文件将自动进入 RAG 解析队列。
                </p>
            </div>
        </div>

        {/* Processing Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <RefreshCw size={18} className="text-emerald-400" />
                    处理队列 (Processing Queue)
                </h3>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    {queue.length} 个任务
                </span>
             </div>
            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {queue.map((item) => (
                   <div key={item.id} className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-2 truncate max-w-[180px]">
                            {item.progress >= 100 ? <CheckCircle2 size={12} className="text-emerald-500"/> : <Loader2 size={12} className="animate-spin text-slate-600"/>}
                            <span className="truncate">{item.name}</span>
                            <span className="text-[10px] px-1 border border-slate-700 rounded text-slate-500">{item.source}</span>
                          </span>
                          <span>{item.status}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color} transition-all duration-500 ease-out`} 
                            style={{ width: `${item.progress}%` }}
                          ></div>
                      </div>
                  </div>
                ))}
            </div>
        </div>

        {/* Active Monitors */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <HardDrive size={18} className="text-purple-400" />
                活跃监控任务 (Active Monitors)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { path: '/Finance/Earnings_Calls_2024', count: 12, status: '监控中' },
                    { path: '/Research/Goldman_Sachs', count: 5, status: '同步中' },
                    { path: '/Videos/Bloomberg_News', count: 89, status: '空闲' }
                ].map((monitor, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
                        <div>
                            <p className="text-sm font-medium text-slate-300">{monitor.path}</p>
                            <p className="text-xs text-slate-500">{monitor.count} 个新文件检测到</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            monitor.status === '同步中' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                        }`}>
                            {monitor.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};