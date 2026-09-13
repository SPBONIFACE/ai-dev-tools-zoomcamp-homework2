import React from 'react';
import type { Table, Party } from '../types';
import { Check, UserCheck, Armchair } from 'lucide-react';


interface TableGridProps {
  tables: Table[];
  parties: Party[];
  onClearTable: (tableId: string) => Promise<void>;
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, parties, onClearTable }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Armchair className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white">Floor & Tables</h3>
        </div>
        <span className="text-xs text-slate-400">
          {tables.filter((t) => t.status === 'available').length} / {tables.length} Available
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tables.map((table) => {
          const isAvailable = table.status === 'available';
          const seatedParty = table.current_party_id
            ? parties.find((p) => p.id === table.current_party_id)
            : null;

          return (
            <div
              key={table.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isAvailable
                  ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  : 'bg-amber-950/20 border-amber-900/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{table.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{table.capacity} Top</p>
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isAvailable
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {isAvailable ? 'Available' : 'Occupied'}
                </span>
              </div>

              {!isAvailable && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 truncate">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate font-medium">
                      {seatedParty ? seatedParty.guest_name : 'Seated Party'}
                    </span>
                  </div>
                  <button
                    onClick={() => onClearTable(table.id)}
                    className="mt-2 w-full py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    Clear Table
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
