import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { IngestionView } from './components/IngestionView';
import { AnalysisView } from './components/AnalysisView';
import { ArchitectureView } from './components/ArchitectureView';
import { SettingsView } from './components/SettingsView';
import { ViewState, KnowledgeFile } from './types';

// Initial Mock Data moved from AnalysisView
const INITIAL_FILES: KnowledgeFile[] = [
  { 
    id: 'f1', 
    name: 'BABA_FY2024_Q3_Transcript.pdf', 
    type: 'PDF', 
    date: '2024-02-07',
    summary: '阿里巴巴第三季度业绩电话会议纪要',
    content: `[Source: BABA_FY2024_Q3_Transcript.pdf]
    CEO: 感谢大家参加 BABA 第三季度财报会议。本季度我们面临复杂的宏观环境。
    CFO: 财务数据方面，本季度营收同比增长 5%，达到 2603 亿元人民币。调整后 EBITDA 同比下降 2%。
    CEO: 云智能集团（Cloud Intelligence Group）收入增长放缓至 3%，我们正在主动削减低利润率的项目制合同，转向公共云服务。
    CFO: 我们将股票回购计划规模扩大 250 亿美元。我们认为目前股价被严重低估（Undervalued），PE 倍数处于历史低位。`
  },
  { 
    id: 'f2', 
    name: 'NVDA_GTC_2024_Keynote.mp4', 
    type: 'Video', 
    date: '2024-03-18', 
    summary: '英伟达 GTC 大会黄仁勋演讲 (Whisper 转写)',
    content: `[Source: NVDA_GTC_2024_Keynote.mp4]
    Jensen Huang: Welcome to GTC. Today we are launching Blackwell, the world's most powerful AI chip.
    Performance: 20 petaflops of AI performance.
    Efficiency: Reduces cost and energy consumption by up to 25x compared to H100.
    Partnerships: AWS, Google, Microsoft, and Oracle are all gearing up for Blackwell.
    Stock Impact: Analyst expect data center revenue to triple next year.`
  },
  { 
    id: 'f3', 
    name: 'China_Macro_Outlook_2025_GS.docx', 
    type: 'Report', 
    date: '2024-04-10',
    summary: '高盛中国宏观经济展望报告',
    content: `[Source: China_Macro_Outlook_2025_GS.docx]
    GDP Growth: Forecast 4.8% for 2025.
    Sector Analysis: Overweight Technology and Green Energy; Underweight Real Estate.
    Capital Flow: Northbound funds have shown net inflow for 3 consecutive weeks, favoring CATL and Kweichow Moutai.
    Risks: Geopolitical tensions and supply chain diversification trends.`
  },
  {
    id: 'f4',
    name: 'A_Share_Technical_Analysis_Weekly.pdf',
    type: 'PDF',
    date: '2024-04-24',
    summary: 'A股本周技术面复盘',
    content: `[Source: A_Share_Technical_Analysis_Weekly.pdf]
    Index: Shanghai Composite (SSEC) holding above 3000 psychological support.
    Pattern: Possible "Double Bottom" forming on weekly charts for Renewables.
    Volume: Shrinking volume indicates seller exhaustion.
    Signal: MACD golden cross observed in semiconductor sector.`
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  // Shared State: Knowledge Base Files
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeFile[]>(INITIAL_FILES);

  const handleFileIngest = (newFile: KnowledgeFile) => {
    setKnowledgeBase(prev => [newFile, ...prev]); // Add new file to the top
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardView />;
      case ViewState.INGESTION:
        return <IngestionView onIngest={handleFileIngest} />;
      case ViewState.ANALYSIS:
        return <AnalysisView files={knowledgeBase} />;
      case ViewState.ARCHITECTURE:
        return <ArchitectureView />;
      case ViewState.SETTINGS:
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-medium text-slate-100 tracking-wide">
            {currentView === ViewState.DASHBOARD && '全局概览 (Executive Overview)'}
            {currentView === ViewState.INGESTION && '数据源与采集 (Data Ingestion)'}
            {currentView === ViewState.ANALYSIS && 'AI 投研助手 (AI Analysis)'}
            {currentView === ViewState.ARCHITECTURE && '系统架构与文档 (System Architecture)'}
            {currentView === ViewState.SETTINGS && '系统设置 (System Configuration)'}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400">
                v2.5.1-connected
             </div>
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-900/20">
                FI
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;