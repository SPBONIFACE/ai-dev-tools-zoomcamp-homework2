import React from 'react';
import type { Table, Party } from '../types';
import { Check, UserCheck, Armchair } from 'lucide-react';

interface TableGridProps {
  tables: Table[];
  parties: Party[];
  onClearTable: (tableId: string) => Promise<void>;
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, parties, onClearTable }) => {
  const availableCount = tables.filter((t) => t.status === 'available').length;

  return (
    <div className="bg-white border border-[#e8e2d8] rounded-2xl p-6 shadow-[0_2px_12px_-3px_rgba(40,30,20,0.04)]">
      <div className="flex items-center justify-between pb-4 border-b border-[#f0eae1] mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Armchair className="w-5 h-5 text-[#b85422]" />
            <h3 className="font-serif text-lg font-bold text-[#2a241e]">Dining Room</h3>
          </div>
          <p className="text-xs text-[#8c8275] mt-0.5">Floor capacity and table turns</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-[#edf5f0] text-[#226343] rounded-full border border-[#d0e5d8]">
          {availableCount} Available
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {tables.map((table) => {
          const isAvailable = table.status === 'available';
          const seatedParty = table.current_party_id
            ? parties.find((p) => p.id === table.current_party_id)
            : null;

          return (
            <div
              key={table.id}
              className={`p-4 rounded-xl border transition-all ${
                isAvailable
                  ? 'bg-[#faf8f4] border-[#e8e2d8] hover:border-[#d6cebf]'
                  : 'bg-[#fcf8f2] border-[#ebd7bf]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#2a241e]">{table.name}</h4>
                  <p className="text-xs text-[#8c8275] mt-0.5">{table.capacity}-Guest Top</p>
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isAvailable
                      ? 'bg-[#edf5f0] text-[#226343] border border-[#d0e5d8]'
                      : 'bg-[#faf3ea] text-[#b85422] border border-[#f0dfcc]'
                  }`}
                >
                  {isAvailable ? 'Free' : 'Occupied'}
                </span>
              </div>

              {!isAvailable && (
                <div className="mt-3.5 pt-3 border-t border-[#f0e3d2]">
                  <div className="flex items-center gap-1.5 text-xs text-[#4a4034] truncate">
                    <UserCheck className="w-3.5 h-3.5 text-[#226343] shrink-0" />
                    <span className="truncate font-semibold font-serif">
                      {seatedParty ? seatedParty.guest_name : 'Seated Party'}
                    </span>
                  </div>
                  <button
                    onClick={() => onClearTable(table.id)}
                    className="mt-2.5 w-full py-1.5 px-2 bg-white hover:bg-[#faf5ee] text-[#b85422] text-xs font-semibold rounded-lg border border-[#ebd7bf] shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-[#226343]" />
                    <span>Clear Table</span>
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
