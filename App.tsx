import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { IngestionView } from './components/IngestionView';
import { AnalysisView } from './components/AnalysisView';
import { ArchitectureView } from './components/ArchitectureView';
import { SettingsView } from './components/SettingsView';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardView />;
      case ViewState.INGESTION:
        return <IngestionView />;
      case ViewState.ANALYSIS:
        return <AnalysisView />;
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
                v2.5.0-stable
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