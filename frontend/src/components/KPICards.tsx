import React from 'react';
import { Users, Clock, CheckCircle2 } from 'lucide-react';
import type { AnalyticsSummary } from '../types';

interface KPICardsProps {
  summary: AnalyticsSummary;
}

export const KPICards: React.FC<KPICardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Queue</p>
            <p className="text-3xl font-bold text-white mt-1">{summary.active_waiting}</p>
            <p className="text-xs text-amber-400 mt-1">Parties currently waiting</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Quoted Wait</p>
            <p className="text-3xl font-bold text-white mt-1">
              {summary.avg_wait_min} <span className="text-base font-normal text-slate-400">mins</span>
            </p>
            <p className="text-xs text-blue-400 mt-1">Estimated wait time</p>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Seated Today</p>
            <p className="text-3xl font-bold text-white mt-1">{summary.total_seated_today}</p>
            <p className="text-xs text-emerald-400 mt-1">Completed parties</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
