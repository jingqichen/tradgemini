import React from 'react';
import { TrendingUp, Database, Activity, FileCheck } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: '周一', value: 4000 },
  { name: '周二', value: 3000 },
  { name: '周三', value: 5000 },
  { name: '周四', value: 2780 },
  { name: '周五', value: 1890 },
  { name: '周六', value: 2390 },
  { name: '周日', value: 3490 },
];

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '已处理文档', value: '1,284', icon: FileCheck, color: 'text-blue-400' },
          { label: '网盘数据吞吐量', value: '45 GB', icon: Database, color: 'text-purple-400' },
          { label: '生成洞察报告', value: '892', icon: Activity, color: 'text-emerald-400' },
          { label: '市场情绪指数', value: '看涨 (Bullish)', icon: TrendingUp, color: 'text-orange-400' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-100 mt-2">{stat.value}</h3>
              </div>
              <stat.icon className={`${stat.color} opacity-80`} size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">处理流水线活跃度</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">最近接入任务</h3>
          <div className="space-y-4">
            {[
              { file: 'Q3_Earnings_Call.mp4', type: '视频', status: 'Completed', time: '10分钟前' },
              { file: 'Tech_Sector_Analysis.pdf', type: 'PDF', status: 'Processing', time: '24分钟前' },
              { file: 'Macro_Outlook_2025.docx', type: '文档', status: 'Pending', time: '1小时前' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${item.status === 'Completed' ? 'bg-emerald-500' : item.status === 'Processing' ? 'bg-yellow-500' : 'bg-slate-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-300 truncate w-32">{item.file}</p>
                    <p className="text-xs text-slate-500">{item.type}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};