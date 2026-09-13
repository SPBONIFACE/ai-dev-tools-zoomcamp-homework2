import React from 'react';
import { Users, Clock, CheckCircle2 } from 'lucide-react';
import type { AnalyticsSummary } from '../types';

interface KPICardsProps {
  summary: AnalyticsSummary;
}

export const KPICards: React.FC<KPICardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {/* Active Queue Card */}
      <div className="bg-white border border-[#e8e2d8] rounded-2xl p-5 shadow-[0_2px_12px_-3px_rgba(40,30,20,0.04)] relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#8c8275]">
              Active Waitlist
            </span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-4xl font-serif text-[#2a241e]">{summary.active_waiting}</span>
              <span className="text-xs text-[#8c8275]">parties waiting</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#faf5ee] border border-[#ebdccb] flex items-center justify-center text-[#c25e2e]">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#f2ece3] flex items-center justify-between text-xs text-[#8c8275]">
          <span>Current front-of-house demand</span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#c25e2e]"></span>
        </div>
      </div>

      {/* Avg Quoted Wait Card */}
      <div className="bg-white border border-[#e8e2d8] rounded-2xl p-5 shadow-[0_2px_12px_-3px_rgba(40,30,20,0.04)] relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#8c8275]">
              Estimated Wait
            </span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-4xl font-serif text-[#2a241e]">{summary.avg_wait_min}</span>
              <span className="text-sm font-medium text-[#8c8275]">minutes avg</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#f0f5fa] border border-[#d4e1ed] flex items-center justify-center text-[#355c7d]">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#f2ece3] flex items-center justify-between text-xs text-[#8c8275]">
          <span>Dynamically paced quotes</span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#355c7d]"></span>
        </div>
      </div>

      {/* Seated Today Card */}
      <div className="bg-white border border-[#e8e2d8] rounded-2xl p-5 shadow-[0_2px_12px_-3px_rgba(40,30,20,0.04)] relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-[#8c8275]">
              Seated This Service
            </span>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-4xl font-serif text-[#2a241e]">{summary.total_seated_today}</span>
              <span className="text-xs text-[#8c8275]">parties hosted</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#f2f7f4] border border-[#d0e2d7] flex items-center justify-center text-[#2d6a4f]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#f2ece3] flex items-center justify-between text-xs text-[#8c8275]">
          <span>Service turnover tracking</span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#2d6a4f]"></span>
        </div>
      </div>
    </div>
  );
};
