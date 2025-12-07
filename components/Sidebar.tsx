import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, FileText, UploadCloud, ServerCog, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: '仪表盘', icon: LayoutDashboard },
    { id: ViewState.INGESTION, label: '数据接入', icon: UploadCloud },
    { id: ViewState.ANALYSIS, label: '智能分析', icon: FileText },
    { id: ViewState.ARCHITECTURE, label: '系统架构', icon: ServerCog },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          FinanceInsight AI
        </h1>
        <p className="text-xs text-slate-500 mt-1">Enterprise Architect Edition</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
         <button
            onClick={() => onNavigate(ViewState.SETTINGS)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 ${
                currentView === ViewState.SETTINGS
                  ? 'bg-slate-800 text-slate-200'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
         >
            <Settings size={20} />
            <span className="font-medium text-sm">系统设置</span>
         </button>

        <div className="flex items-center space-x-3 text-slate-500 text-xs px-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>Gemini 2.5 Flash: Online</span>
        </div>
      </div>
    </div>
  );
};